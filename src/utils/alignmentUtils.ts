import type { Canvas, FabricObject } from 'fabric';

export type AlignType =
  | 'left'
  | 'center'
  | 'right'
  | 'top'
  | 'middle'
  | 'bottom';

/**
 * 선택된 객체들 정렬하는 함수
 *
 * @param {Canvas} canvas
 * @param {AlignType} type
 */
export const alignObjects = (canvas: Canvas, type: AlignType) => {
  const selectedObjects = canvas.getActiveObjects();

  // 2개 이상의 객체가 선택된 경우만 정렬 실행
  if (selectedObjects.length < 2) {
    return;
  }

  alignMultipleObjects(canvas, selectedObjects, type);
};

/**
 * 여러 개의 개별 객체들을 정렬
 */
const alignMultipleObjects = (
  canvas: Canvas,
  objects: FabricObject[],
  type: AlignType,
) => {
  const bounds = objects.map((obj) => getObjectBounds(obj));

  switch (type) {
    case 'left': {
      const leftmost = Math.min(...bounds.map((b) => b.left));
      objects.forEach((obj, i) =>
        setObjectPosition(obj, leftmost, bounds[i].top),
      );
      break;
    }
    case 'center': {
      const left = Math.min(...bounds.map((b) => b.left));
      const right = Math.max(...bounds.map((b) => b.right));
      const centerX = (left + right) / 2;
      objects.forEach((obj, i) =>
        setObjectPosition(obj, centerX - bounds[i].width / 2, bounds[i].top),
      );
      break;
    }
    case 'right': {
      const rightmost = Math.max(...bounds.map((b) => b.right));
      objects.forEach((obj, i) =>
        setObjectPosition(obj, rightmost - bounds[i].width, bounds[i].top),
      );
      break;
    }
    case 'top': {
      const topmost = Math.min(...bounds.map((b) => b.top));
      objects.forEach((obj, i) =>
        setObjectPosition(obj, bounds[i].left, topmost),
      );
      break;
    }
    case 'middle': {
      const top = Math.min(...bounds.map((b) => b.top));
      const bottom = Math.max(...bounds.map((b) => b.bottom));
      const centerY = (top + bottom) / 2;
      objects.forEach((obj, i) =>
        setObjectPosition(obj, bounds[i].left, centerY - bounds[i].height / 2),
      );
      break;
    }
    case 'bottom': {
      const bottommost = Math.max(...bounds.map((b) => b.bottom));
      objects.forEach((obj, i) =>
        setObjectPosition(obj, bounds[i].left, bottommost - bounds[i].height),
      );
      break;
    }
  }

  // 정렬 후 선택 해제하여 컨트롤 숨기기
  canvas.discardActiveObject();
  canvas.requestRenderAll();
};

/**
 * 객체의 경계 정보 계산 (회전 고려)
 */
const getObjectBounds = (obj: FabricObject) => {
  // getBoundingRect를 사용하여 회전된 객체의 실제 경계 박스를 가져옴
  const boundingRect = obj.getBoundingRect();

  return {
    left: boundingRect.left,
    top: boundingRect.top,
    width: boundingRect.width,
    height: boundingRect.height,
    right: boundingRect.left + boundingRect.width,
    bottom: boundingRect.top + boundingRect.height,
  };
};

/**
 * 객체 위치 설정 (회전 고려)
 */
const setObjectPosition = (obj: FabricObject, left: number, top: number) => {
  const currentBounds = obj.getBoundingRect();

  // 현재 경계 박스와 새로운 위치의 차이를 계산
  const deltaX = left - currentBounds.left;
  const deltaY = top - currentBounds.top;

  // 객체의 현재 위치에서 차이만큼 이동
  obj.set({
    left: obj.left! + deltaX,
    top: obj.top! + deltaY,
  });

  obj.setCoords();
};
