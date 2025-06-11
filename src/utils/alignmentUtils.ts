import type { Canvas, FabricObject } from 'fabric';

export type AlignmentType =
  | 'left'
  | 'center'
  | 'right'
  | 'top'
  | 'middle'
  | 'bottom';

export class AlignmentUtils {
  /**
   * 객체의 실제 경계 정보를 가져옴
   */
  private static getBounds(obj: FabricObject) {
    const width = obj.getScaledWidth();
    const height = obj.getScaledHeight();

    // origin 기준점에 따른 좌상단 좌표 계산
    let left = obj.left!;
    let top = obj.top!;

    if (obj.originX === 'center') left -= width / 2;
    else if (obj.originX === 'right') left -= width;

    if (obj.originY === 'center') top -= height / 2;
    else if (obj.originY === 'bottom') top -= height;

    return {
      left,
      top,
      right: left + width,
      bottom: top + height,
      width,
      height,
      centerX: left + width / 2,
      centerY: top + height / 2,
    };
  }

  /**
   * 객체의 위치를 설정 (origin 기준점 고려)
   */
  private static setPosition(obj: FabricObject, left: number, top: number) {
    const width = obj.getScaledWidth();
    const height = obj.getScaledHeight();

    let newLeft = left;
    let newTop = top;

    // origin 기준점에 따른 좌표 보정
    if (obj.originX === 'center') newLeft += width / 2;
    else if (obj.originX === 'right') newLeft += width;

    if (obj.originY === 'center') newTop += height / 2;
    else if (obj.originY === 'bottom') newTop += height;

    obj.set({ left: newLeft, top: newTop });
    obj.setCoords();
  }

  /**
   * 정렬 실행
   */
  static align(canvas: Canvas, objects: FabricObject[], type: AlignmentType) {
    if (!canvas || !objects || objects.length < 2) return;

    const bounds = objects.map((obj) => AlignmentUtils.getBounds(obj));

    switch (type) {
      case 'left': {
        const leftmost = Math.min(...bounds.map((b) => b.left));
        objects.forEach((obj, i) => {
          AlignmentUtils.setPosition(obj, leftmost, bounds[i].top);
        });
        break;
      }

      case 'center': {
        const leftmost = Math.min(...bounds.map((b) => b.left));
        const rightmost = Math.max(...bounds.map((b) => b.right));
        const centerX = (leftmost + rightmost) / 2;

        objects.forEach((obj, i) => {
          const newLeft = centerX - bounds[i].width / 2;
          AlignmentUtils.setPosition(obj, newLeft, bounds[i].top);
        });
        break;
      }

      case 'right': {
        const rightmost = Math.max(...bounds.map((b) => b.right));
        objects.forEach((obj, i) => {
          const newLeft = rightmost - bounds[i].width;
          AlignmentUtils.setPosition(obj, newLeft, bounds[i].top);
        });
        break;
      }

      case 'top': {
        const topmost = Math.min(...bounds.map((b) => b.top));
        objects.forEach((obj, i) => {
          AlignmentUtils.setPosition(obj, bounds[i].left, topmost);
        });
        break;
      }

      case 'middle': {
        const topmost = Math.min(...bounds.map((b) => b.top));
        const bottommost = Math.max(...bounds.map((b) => b.bottom));
        const centerY = (topmost + bottommost) / 2;

        objects.forEach((obj, i) => {
          const newTop = centerY - bounds[i].height / 2;
          AlignmentUtils.setPosition(obj, bounds[i].left, newTop);
        });
        break;
      }

      case 'bottom': {
        const bottommost = Math.max(...bounds.map((b) => b.bottom));
        objects.forEach((obj, i) => {
          const newTop = bottommost - bounds[i].height;
          AlignmentUtils.setPosition(obj, bounds[i].left, newTop);
        });
        break;
      }
    }

    canvas.requestRenderAll();
  }

  /**
   * 기존 코드와의 호환성을 위한 executeAlignment 메서드
   */
  static executeAlignment(
    canvas: Canvas,
    objects: FabricObject[],
    type: AlignmentType,
  ): { success: boolean; error?: string } {
    try {
      if (!canvas) {
        return { success: false, error: 'Canvas is required' };
      }

      if (!objects || objects.length < 2) {
        return {
          success: false,
          error: 'At least 2 objects required for alignment',
        };
      }

      AlignmentUtils.align(canvas, objects, type);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
