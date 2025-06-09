import type { Canvas, FabricObject, Group } from 'fabric';

// 타입 정의
interface ObjectBounds {
  left: number;
  top: number;
  width: number;
  height: number;
  right: number;
  bottom: number;
  centerX: number;
  centerY: number;
}

export type AlignmentType =
  | 'left'
  | 'center'
  | 'right'
  | 'top'
  | 'middle'
  | 'bottom';

// 에러 클래스
class AlignmentError extends Error {
  constructor(
    message: string,
    public code: string,
  ) {
    super(message);
    //  AlignmentUtils.name = 'AlignmentError';
  }
}

export class AlignmentUtils {
  // TODO(@한현): 그룹에도 정렬을 적용할 수 있도록
  private static readonly MIN_OBJECTS_FOR_ALIGNMENT = 2;

  /**
   * 객체 유효성 검사
   */
  private static validateObject(obj: FabricObject): void {
    if (!obj) {
      throw new AlignmentError('Object is null or undefined', 'NULL_OBJECT');
    }

    if (typeof obj.left !== 'number' || typeof obj.top !== 'number') {
      throw new AlignmentError(
        'Object position is invalid',
        'INVALID_POSITION',
      );
    }
  }

  /**
   * Origin 기준점을 고려한 정확한 객체 경계 계산
   */
  static getObjectBounds(obj: FabricObject): ObjectBounds {
    AlignmentUtils.validateObject(obj);

    try {
      // Origin 기준점 가져오기 (기본값: 'left', 'top')
      const originX = obj.originX || 'left';
      const originY = obj.originY || 'top';

      // 스케일이 적용된 실제 크기
      const scaledWidth = obj.getScaledWidth();
      const scaledHeight = obj.getScaledHeight();

      // Origin에 따른 좌상단 좌표 계산
      let left = obj.left!;
      let top = obj.top!;

      // originX 보정
      switch (originX) {
        case 'center':
          left -= scaledWidth / 2;
          break;
        case 'right':
          left -= scaledWidth;
          break;
        // 'left'는 보정 불필요
      }

      // originY 보정
      switch (originY) {
        case 'center':
          top -= scaledHeight / 2;
          break;
        case 'bottom':
          top -= scaledHeight;
          break;
        // 'top'은 보정 불필요
      }

      const bounds: ObjectBounds = {
        left,
        top,
        width: scaledWidth,
        height: scaledHeight,
        right: left + scaledWidth,
        bottom: top + scaledHeight,
        centerX: left + scaledWidth / 2,
        centerY: top + scaledHeight / 2,
      };

      return bounds;
    } catch (error) {
      throw new AlignmentError(
        `Failed to calculate object bounds: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'BOUNDS_CALCULATION_FAILED',
      );
    }
  }

  /**
   * 여러 객체들의 전체 경계 계산 (캐싱 포함)
   */
  static getGroupBounds(objects: FabricObject[]): ObjectBounds {
    if (objects.length === 0) {
      return {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        right: 0,
        bottom: 0,
        centerX: 0,
        centerY: 0,
      };
    }

    // 한 번에 모든 bounds 계산 (성능 최적화)
    const allBounds = objects.map((obj) => AlignmentUtils.getObjectBounds(obj));

    // 극값들을 한 번에 계산
    const leftValues = allBounds.map((b) => b.left);
    const topValues = allBounds.map((b) => b.top);
    const rightValues = allBounds.map((b) => b.right);
    const bottomValues = allBounds.map((b) => b.bottom);

    const left = Math.min(...leftValues);
    const top = Math.min(...topValues);
    const right = Math.max(...rightValues);
    const bottom = Math.max(...bottomValues);

    const width = right - left;
    const height = bottom - top;

    return {
      left,
      top,
      width,
      height,
      right,
      bottom,
      centerX: left + width / 2,
      centerY: top + height / 2,
    };
  }

  /**
   * Origin을 고려한 정확한 객체 위치 설정
   */
  private static setObjectPosition(
    obj: FabricObject,
    targetLeft: number,
    targetTop: number,
  ): void {
    AlignmentUtils.validateObject(obj);

    try {
      const originX = obj.originX || 'left';
      const originY = obj.originY || 'top';

      const scaledWidth = obj.getScaledWidth();
      const scaledHeight = obj.getScaledHeight();

      // Origin에 따른 실제 설정할 좌표 계산
      let newLeft = targetLeft;
      let newTop = targetTop;

      // originX 보정
      switch (originX) {
        case 'center':
          newLeft += scaledWidth / 2;
          break;
        case 'right':
          newLeft += scaledWidth;
          break;
      }

      // originY 보정
      switch (originY) {
        case 'center':
          newTop += scaledHeight / 2;
          break;
        case 'bottom':
          newTop += scaledHeight;
          break;
      }

      obj.set({ left: newLeft, top: newTop });
      obj.setCoords();
    } catch (error) {
      throw new AlignmentError(
        `Failed to set object position: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'POSITION_SET_FAILED',
      );
    }
  }

  /**
   * 그룹 객체 처리
   */
  private static handleGroupObjects(objects: FabricObject[]): FabricObject[] {
    const processedObjects: FabricObject[] = [];

    for (const obj of objects) {
      if (obj.type === 'group') {
        const group = obj as Group;
        // 그룹 내부 객체들을 개별적으로 처리하지 않고 그룹 자체를 하나의 객체로 취급
        processedObjects.push(obj);
      } else {
        processedObjects.push(obj);
      }
    }

    return processedObjects;
  }

  /**
   * 좌측 정렬
   */
  static alignLeft(objects: FabricObject[]): void {
    if (objects.length < AlignmentUtils.MIN_OBJECTS_FOR_ALIGNMENT) {
      throw new AlignmentError(
        `At least ${AlignmentUtils.MIN_OBJECTS_FOR_ALIGNMENT} objects required for alignment`,
        'INSUFFICIENT_OBJECTS',
      );
    }

    const processedObjects = AlignmentUtils.handleGroupObjects(objects);
    const bounds = processedObjects.map((obj) =>
      AlignmentUtils.getObjectBounds(obj),
    );
    const leftmost = Math.min(...bounds.map((b) => b.left));

    processedObjects.forEach((obj, index) => {
      const objBounds = bounds[index];
      AlignmentUtils.setObjectPosition(obj, leftmost, objBounds.top);
    });
  }

  /**
   * 수평 중앙 정렬
   */
  static alignCenter(objects: FabricObject[]): void {
    if (objects.length < AlignmentUtils.MIN_OBJECTS_FOR_ALIGNMENT) {
      throw new AlignmentError(
        `At least ${AlignmentUtils.MIN_OBJECTS_FOR_ALIGNMENT} objects required for alignment`,
        'INSUFFICIENT_OBJECTS',
      );
    }

    const processedObjects = AlignmentUtils.handleGroupObjects(objects);
    const groupBounds = AlignmentUtils.getGroupBounds(processedObjects);
    const centerX = groupBounds.centerX;

    processedObjects.forEach((obj) => {
      const objBounds = AlignmentUtils.getObjectBounds(obj);
      const newLeft = centerX - objBounds.width / 2;
      AlignmentUtils.setObjectPosition(obj, newLeft, objBounds.top);
    });
  }

  /**
   * 우측 정렬
   */
  static alignRight(objects: FabricObject[]): void {
    if (objects.length < AlignmentUtils.MIN_OBJECTS_FOR_ALIGNMENT) {
      throw new AlignmentError(
        `At least ${AlignmentUtils.MIN_OBJECTS_FOR_ALIGNMENT} objects required for alignment`,
        'INSUFFICIENT_OBJECTS',
      );
    }

    const processedObjects = AlignmentUtils.handleGroupObjects(objects);
    const bounds = processedObjects.map((obj) =>
      AlignmentUtils.getObjectBounds(obj),
    );
    const rightmost = Math.max(...bounds.map((b) => b.right));

    processedObjects.forEach((obj, index) => {
      const objBounds = bounds[index];
      const newLeft = rightmost - objBounds.width;
      AlignmentUtils.setObjectPosition(obj, newLeft, objBounds.top);
    });
  }

  /**
   * 상단 정렬
   */
  static alignTop(objects: FabricObject[]): void {
    if (objects.length < AlignmentUtils.MIN_OBJECTS_FOR_ALIGNMENT) {
      throw new AlignmentError(
        `At least ${AlignmentUtils.MIN_OBJECTS_FOR_ALIGNMENT} objects required for alignment`,
        'INSUFFICIENT_OBJECTS',
      );
    }

    const processedObjects = AlignmentUtils.handleGroupObjects(objects);
    const bounds = processedObjects.map((obj) =>
      AlignmentUtils.getObjectBounds(obj),
    );
    const topmost = Math.min(...bounds.map((b) => b.top));

    processedObjects.forEach((obj, index) => {
      const objBounds = bounds[index];
      AlignmentUtils.setObjectPosition(obj, objBounds.left, topmost);
    });
  }

  /**
   * 수직 중앙 정렬
   */
  static alignMiddle(objects: FabricObject[]): void {
    if (objects.length < AlignmentUtils.MIN_OBJECTS_FOR_ALIGNMENT) {
      throw new AlignmentError(
        `At least ${AlignmentUtils.MIN_OBJECTS_FOR_ALIGNMENT} objects required for alignment`,
        'INSUFFICIENT_OBJECTS',
      );
    }

    const processedObjects = AlignmentUtils.handleGroupObjects(objects);
    const groupBounds = AlignmentUtils.getGroupBounds(processedObjects);
    const centerY = groupBounds.centerY;

    processedObjects.forEach((obj) => {
      const objBounds = AlignmentUtils.getObjectBounds(obj);
      const newTop = centerY - objBounds.height / 2;
      AlignmentUtils.setObjectPosition(obj, objBounds.left, newTop);
    });
  }

  /**
   * 하단 정렬
   */
  static alignBottom(objects: FabricObject[]): void {
    if (objects.length < AlignmentUtils.MIN_OBJECTS_FOR_ALIGNMENT) {
      throw new AlignmentError(
        `At least ${AlignmentUtils.MIN_OBJECTS_FOR_ALIGNMENT} objects required for alignment`,
        'INSUFFICIENT_OBJECTS',
      );
    }

    const processedObjects = AlignmentUtils.handleGroupObjects(objects);
    const bounds = processedObjects.map((obj) =>
      AlignmentUtils.getObjectBounds(obj),
    );
    const bottommost = Math.max(...bounds.map((b) => b.bottom));

    processedObjects.forEach((obj, index) => {
      const objBounds = bounds[index];
      const newTop = bottommost - objBounds.height;
      AlignmentUtils.setObjectPosition(obj, objBounds.left, newTop);
    });
  }

  /**
   * 정렬 실행 (에러 처리 포함)
   */
  static executeAlignment(
    canvas: Canvas,
    objects: FabricObject[],
    type: AlignmentType,
  ): { success: boolean; error?: string } {
    if (!canvas) {
      return { success: false, error: 'Canvas is required' };
    }

    if (!objects || objects.length === 0) {
      return { success: false, error: 'No objects provided' };
    }

    try {
      // 객체 유효성 검사
      for (const obj of objects) {
        AlignmentUtils.validateObject(obj);
      }

      // 정렬 실행
      switch (type) {
        case 'left':
          AlignmentUtils.alignLeft(objects);
          break;
        case 'center':
          AlignmentUtils.alignCenter(objects);
          break;
        case 'right':
          AlignmentUtils.alignRight(objects);
          break;
        case 'top':
          AlignmentUtils.alignTop(objects);
          break;
        case 'middle':
          AlignmentUtils.alignMiddle(objects);
          break;
        case 'bottom':
          AlignmentUtils.alignBottom(objects);
          break;
        default:
          return { success: false, error: `Unknown alignment type: ${type}` };
      }

      canvas.requestRenderAll();
      return { success: true };
    } catch (error) {
      console.error('Alignment failed:', error);

      if (error instanceof AlignmentError) {
        return { success: false, error: error.message };
      }

      return {
        success: false,
        error: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * 정렬 가능 여부 검사
   */
  static canAlign(objects: FabricObject[]): boolean {
    if (!objects || objects.length < AlignmentUtils.MIN_OBJECTS_FOR_ALIGNMENT) {
      return false;
    }

    try {
      // 모든 객체가 유효한지 검사
      for (const obj of objects) {
        AlignmentUtils.validateObject(obj);
      }
      return true;
    } catch {
      return false;
    }
  }
}

// 사용 예시 (에러 처리 포함)
export const useRobustAlignment = (canvas: Canvas | null) => {
  const align = (objects: FabricObject[], type: AlignmentType) => {
    if (!canvas) {
      console.error('Canvas not available');
      return;
    }

    const result = AlignmentUtils.executeAlignment(canvas, objects, type);

    if (!result.success) {
      console.error('Alignment failed:', result.error);
      // 사용자에게 에러 표시 (toast, alert 등)
    }
  };

  const canAlign = (objects: FabricObject[]) => {
    return AlignmentUtils.canAlign(objects);
  };

  return { align, canAlign };
};
