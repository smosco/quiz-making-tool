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
  const objects = canvas.getActiveObjects();
  if (objects.length < 2) return;

  const bounds = objects.map((obj) => {
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
  });

  const setPos = (obj: FabricObject, left: number, top: number) => {
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

  switch (type) {
    case 'left': {
      const leftmost = Math.min(...bounds.map((b) => b.left));
      objects.forEach((obj, i) => setPos(obj, leftmost, bounds[i].top));
      break;
    }
    case 'center': {
      const left = Math.min(...bounds.map((b) => b.left));
      const right = Math.max(...bounds.map((b) => b.right));
      const centerX = (left + right) / 2;
      objects.forEach((obj, i) =>
        setPos(obj, centerX - bounds[i].width / 2, bounds[i].top),
      );
      break;
    }
    case 'right': {
      const rightmost = Math.max(...bounds.map((b) => b.right));
      objects.forEach((obj, i) =>
        setPos(obj, rightmost - bounds[i].width, bounds[i].top),
      );
      break;
    }
    case 'top': {
      const topmost = Math.min(...bounds.map((b) => b.top));
      objects.forEach((obj, i) => setPos(obj, bounds[i].left, topmost));
      break;
    }
    case 'middle': {
      const top = Math.min(...bounds.map((b) => b.top));
      const bottom = Math.max(...bounds.map((b) => b.bottom));
      const centerY = (top + bottom) / 2;
      objects.forEach((obj, i) =>
        setPos(obj, bounds[i].left, centerY - bounds[i].height / 2),
      );
      break;
    }
    case 'bottom': {
      const bottommost = Math.max(...bounds.map((b) => b.bottom));
      objects.forEach((obj, i) =>
        setPos(obj, bounds[i].left, bottommost - bounds[i].height),
      );
      break;
    }
  }

  canvas.requestRenderAll();
};
