import {
  ActiveSelection,
  type Canvas,
  type FabricObject,
  Group,
  Rect,
  Textbox,
} from 'fabric';
import { v4 as uuidv4 } from 'uuid';
import { getCanvasInstance } from '../components/Canvas/EditorCanvas';
import { useEditorStore } from '../store/editorStore';

// 캔버스에 Textbox 추가
export const addTextboxToCanvas = async () => {
  const canvas = getCanvasInstance();
  if (!canvas) return;

  const fabricTextbox = new Textbox('Text', {
    left: 100,
    top: 100,
  });

  fabricTextbox.set({
    jeiId: uuidv4(),
    jeiRole: 'choice',
  });

  canvas.add(fabricTextbox);
  canvas.setActiveObject(fabricTextbox);
  canvas.requestRenderAll();
};

// 캔버스에 Rect 추가
export const addRectToCanvas = async () => {
  const canvas = getCanvasInstance();
  if (!canvas) return;

  const fabricRect = new Rect({
    left: 100,
    top: 100,
    width: 56,
    height: 56,
    fill: 'transparent',
    strokeWidth: 2,
    stroke: '#e5e7eb',
    strokeLineCap: 'round',
    strokeLineJoin: 'round',
  });

  fabricRect.set({
    jeiId: uuidv4(),
    jeiRole: 'choice',
  });

  canvas.add(fabricRect);
  canvas.setActiveObject(fabricRect);
  canvas.requestRenderAll();
};

// 선택된 객체 그룹화
export const group = async () => {
  const canvas = getCanvasInstance();
  if (!canvas) return;

  const activeObject = canvas.getActiveObject();
  if (!activeObject) return;

  if (activeObject.type === 'activeselection') {
    // @ts-ignore: fabric.js 내부 프로퍼티 사용
    const objects = activeObject._objects;

    // 그룹화될 객체들의 ID 수집
    const objectIds: string[] = [];

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    objects.forEach((obj: any) => {
      // 객체가 jeiId를 가지고 있다면 수집
      if (obj.jeiId) {
        objectIds.push(obj.jeiId);
      }
    });

    // 그룹 생성
    const group = new Group(
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      objects.map((obj: any) => {
        // 그룹에 추가될 때 객체의 group 속성 초기화
        obj.group = null;
        return obj;
      }),
      {
        originX: 'left',
        originY: 'top',
      },
    );

    group.set({
      jeiId: uuidv4(),
      jeiRole: 'choice',
    });

    // 기존 객체와 activeSelection을 캔버스에서 제거
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    objects.forEach((obj: any) => canvas.remove(obj));
    canvas.remove(activeObject);

    // 그룹을 캔버스에 추가
    canvas.add(group);
    canvas.setActiveObject(group);
    canvas.requestRenderAll();

    // 옵션에서 그룹화된 개별 객체들 제거
    if (objectIds.length > 0) {
      // TODO(@한현): 직접 스토어 호출하지 않도록 리팩토링하기
      const { removeOptionsByIds } = useEditorStore.getState();
      removeOptionsByIds(objectIds);
    }
  }
};

// 그룹해제
// https://github.com/fabricjs/fabric.js/issues/9990 버그 리포트 참고
export const ungroup = () => {
  const canvas = getCanvasInstance();
  if (!canvas) return;

  const activeObject = canvas.getActiveObject();
  if (!activeObject || activeObject.type !== 'group') return;

  const group = activeObject as Group;

  // 그룹 제거
  canvas.remove(group);

  // 그룹 자체의 옵션만 삭제
  const { removeOption } = useEditorStore.getState();
  removeOption(group.jeiId!);

  // 그룹 내부 객체 추출 및 그룹에서 분리
  const objects = group.removeAll();

  // 각 객체를 캔버스에 다시 추가
  canvas.add(...objects);

  // 객체 상태 업데이트
  objects.forEach((obj) => {
    obj.group = undefined; // 수동으로 해제
    obj.setCoords();
  });

  // 새롭게 선택 영역 지정
  const selection = new ActiveSelection(objects, {
    canvas,
    originX: 'left',
    originY: 'top',
  });

  canvas.setActiveObject(selection);
  canvas.requestRenderAll();
};

// 캡처 함수
export const captureSingleObject = (canvas: Canvas, target: FabricObject) => {
  const others = canvas.getObjects().filter((obj) => obj !== target);

  // 1. 나머지 객체 숨기기
  others.forEach((obj) => obj.set({ opacity: 0 }));

  // 2. 대상 객체의 바운딩 박스 계산
  const { left, top, width, height } = target.getBoundingRect();

  // 3. 해당 영역만 이미지로 캡처
  const url = canvas.toDataURL({
    left,
    top,
    width,
    height,
    multiplier: 1,
  });

  // 4. 숨긴 객체 복원
  others.forEach((obj) => obj.set({ opacity: 1 }));
  canvas.renderAll();

  return url;
};
