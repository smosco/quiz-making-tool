import type { Canvas, FabricObject, Group } from 'fabric';

export type AlignType =
  | 'left'
  | 'center'
  | 'right'
  | 'top'
  | 'middle'
  | 'bottom';

/**
 * 선택된 객체들 정렬하는 함수 (그룹 내부 객체들도 지원)
 *
 * @param {Canvas} canvas
 * @param {AlignType} type
 */
export const alignObjects = (canvas: Canvas, type: AlignType) => {
  const activeSelection = canvas.getActiveObject();

  // 케이스 1: 여러 객체가 선택된 경우
  const selectedObjects = canvas.getActiveObjects();
  if (selectedObjects.length >= 2) {
    alignMultipleObjects(canvas, selectedObjects, type);
    return;
  }

  // 케이스 2: 그룹이 하나 선택된 경우 - 그룹 내부 객체들을 정렬
  if (activeSelection && activeSelection.type === 'group') {
    const group = activeSelection as Group;
    const groupObjects = group.getObjects();

    if (groupObjects.length >= 2) {
      alignGroupObjects(canvas, group, groupObjects, type);
    }
    return;
  }
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

  canvas.requestRenderAll();
};

/**
 * 그룹 내부 객체들을 정렬
 */
const alignGroupObjects = (
  canvas: Canvas,
  group: Group,
  objects: FabricObject[],
  type: AlignType,
) => {
  // 그룹 내부 객체들의 상대적 위치 계산
  const bounds = objects.map((obj) => {
    const width = obj.getScaledWidth();
    const height = obj.getScaledHeight();

    // 그룹 내에서의 상대적 위치
    let left = obj.left!;
    let top = obj.top!;

    if (obj.originX === 'center') left -= width / 2;
    else if (obj.originX === 'right') left -= width;

    if (obj.originY === 'center') top -= height / 2;
    else if (obj.originY === 'bottom') top -= height;

    return {
      left,
      top,
      width,
      height,
      right: left + width,
      bottom: top + height,
    };
  });

  const setGroupObjectPosition = (
    obj: FabricObject,
    left: number,
    top: number,
  ) => {
    const width = obj.getScaledWidth();
    const height = obj.getScaledHeight();

    let newLeft = left;
    let newTop = top;

    if (obj.originX === 'center') newLeft += width / 2;
    else if (obj.originX === 'right') newLeft += width;

    if (obj.originY === 'center') newTop += height / 2;
    else if (obj.originY === 'bottom') newTop += height;

    obj.set({ left: newLeft, top: newTop });
  };

  switch (type) {
    case 'left': {
      const leftmost = Math.min(...bounds.map((b) => b.left));
      objects.forEach((obj, i) =>
        setGroupObjectPosition(obj, leftmost, bounds[i].top),
      );
      break;
    }
    case 'center': {
      const left = Math.min(...bounds.map((b) => b.left));
      const right = Math.max(...bounds.map((b) => b.right));
      const centerX = (left + right) / 2;
      objects.forEach((obj, i) =>
        setGroupObjectPosition(
          obj,
          centerX - bounds[i].width / 2,
          bounds[i].top,
        ),
      );
      break;
    }
    case 'right': {
      const rightmost = Math.max(...bounds.map((b) => b.right));
      objects.forEach((obj, i) =>
        setGroupObjectPosition(obj, rightmost - bounds[i].width, bounds[i].top),
      );
      break;
    }
    case 'top': {
      const topmost = Math.min(...bounds.map((b) => b.top));
      objects.forEach((obj, i) =>
        setGroupObjectPosition(obj, bounds[i].left, topmost),
      );
      break;
    }
    case 'middle': {
      const top = Math.min(...bounds.map((b) => b.top));
      const bottom = Math.max(...bounds.map((b) => b.bottom));
      const centerY = (top + bottom) / 2;
      objects.forEach((obj, i) =>
        setGroupObjectPosition(
          obj,
          bounds[i].left,
          centerY - bounds[i].height / 2,
        ),
      );
      break;
    }
    case 'bottom': {
      const bottommost = Math.max(...bounds.map((b) => b.bottom));
      objects.forEach((obj, i) =>
        setGroupObjectPosition(
          obj,
          bounds[i].left,
          bottommost - bounds[i].height,
        ),
      );
      break;
    }
  }

  // 그룹의 경계 박스 업데이트
  group.setCoords();
  canvas.requestRenderAll();
};

/**
 * 객체의 경계 정보 계산
 */
const getObjectBounds = (obj: FabricObject) => {
  const width = obj.getScaledWidth();
  const height = obj.getScaledHeight();

  let left = obj.left!;
  let top = obj.top!;

  if (obj.originX === 'center') left -= width / 2;
  else if (obj.originX === 'right') left -= width;

  if (obj.originY === 'center') top -= height / 2;
  else if (obj.originY === 'bottom') top -= height;

  return {
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
  };
};

/**
 * 객체 위치 설정
 */
const setObjectPosition = (obj: FabricObject, left: number, top: number) => {
  const width = obj.getScaledWidth();
  const height = obj.getScaledHeight();

  let newLeft = left;
  let newTop = top;

  if (obj.originX === 'center') newLeft += width / 2;
  else if (obj.originX === 'right') newLeft += width;

  if (obj.originY === 'center') newTop += height / 2;
  else if (obj.originY === 'bottom') newTop += height;

  obj.set({ left: newLeft, top: newTop });
  obj.setCoords();
};
