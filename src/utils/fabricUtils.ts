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
  }
};

// 그룹해제
// TODO(@한현): 그룹해제시 선택 안됨, 위치 크기 복원 안됨
export const ungroup = async () => {
  const canvas = getCanvasInstance();
  if (!canvas) return;
  const activeObject = canvas.getActiveObject();
  if (!activeObject) return;

  if (activeObject.type === 'group') {
    // @ts-ignore
    const objects = activeObject._objects;
    const groupLeft = activeObject.left;
    const groupTop = activeObject.top;
    const groupScaleX = activeObject.scaleX;
    const groupScaleY = activeObject.scaleY;

    canvas.remove(activeObject);

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    objects.forEach((obj: any) => {
      obj.originX = 'left';
      obj.originY = 'top';
      obj.left = groupLeft + obj.left * groupScaleX;
      obj.top = groupTop + obj.top * groupScaleY;
      obj.angle = obj.angle + activeObject.angle;
      obj.scaleX = obj.scaleX * groupScaleX;
      obj.scaleY = obj.scaleY * groupScaleY;
      obj.group = null;
      obj.setCoords();
      canvas.add(obj);
    });

    canvas.discardActiveObject();
    canvas.renderAll();
    setTimeout(() => {
      const selection = new ActiveSelection(objects, { canvas });
      canvas.setActiveObject(selection);
      canvas.requestRenderAll();
    }, 30);
  }
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

  console.log(url);

  // 4. 숨긴 객체 복원
  others.forEach((obj) => obj.set({ opacity: 1 }));
  canvas.renderAll();

  return url;
};
