import { type Canvas, Line } from 'fabric';

// 가이드라인 관련 상수
export const SNAP_THRESHOLD = 10;
export const GUIDELINE_COLOR = '#ff0000';
export const GUIDELINE_STROKE_WIDTH = 1;

// 가이드라인 저장 배열
let guidelines: Line[] = [];

/**
 * 가이드라인 생성
 *
 * @param {boolean} isVertical
 * @param {{ x: number; y: number }} canvasCenter
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 * @returns {Line}
 */
export const createGuideline = (
  isVertical: boolean,
  canvasCenter: { x: number; y: number },
  canvasWidth: number,
  canvasHeight: number,
): Line => {
  const coords: [number, number, number, number] = isVertical
    ? [canvasCenter.x, 0, canvasCenter.x, canvasHeight]
    : [0, canvasCenter.y, canvasWidth, canvasCenter.y];

  return new Line(coords, {
    stroke: GUIDELINE_COLOR,
    strokeWidth: GUIDELINE_STROKE_WIDTH,
    strokeDashArray: [3, 3],
    selectable: false,
    evented: false,
    excludeFromExport: true,
  });
};

/**
 * 가이드라인 제거
 *
 * @param {Canvas} canvas
 */
export const clearLines = (canvas: Canvas) => {
  guidelines.forEach((line) => {
    if (canvas.contains(line)) {
      canvas.remove(line);
    }
  });
  guidelines = [];
  canvas.requestRenderAll();
};

/**
 * 캔버스에 가이드라인 추가
 *
 * @param {Canvas} canvas
 * @param {Line} line
 */
export const addGuideline = (canvas: Canvas, line: Line) => {
  canvas.add(line);
  guidelines.push(line);
};

/**
 * 객체가 이동할 때 캔버스에 중앙정렬 가이드 라인을 그리고 스냅하는 함수
 *
 * @param {Canvas} canvas
 * @param {*} e
 */
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const handleObjectMoving = (canvas: Canvas, e: any) => {
  if (!e.target) return;

  const movingObj = e.target;
  const objCenter = movingObj.getCenterPoint();
  const canvasCenter = {
    x: canvas.getWidth() / 2,
    y: canvas.getHeight() / 2,
  };

  clearLines(canvas);

  // 캔버스 중앙 정렬 체크
  if (Math.abs(objCenter.x - canvasCenter.x) < SNAP_THRESHOLD) {
    const verticalLine = createGuideline(
      true,
      canvasCenter,
      canvas.getWidth(),
      canvas.getHeight(),
    );
    addGuideline(canvas, verticalLine);

    // 회전된 객체도 고려한 중앙 정렬
    const currentCenter = movingObj.getCenterPoint();
    movingObj.set({
      left: movingObj.left + (canvasCenter.x - currentCenter.x),
    });
  }

  if (Math.abs(objCenter.y - canvasCenter.y) < SNAP_THRESHOLD) {
    const horizontalLine = createGuideline(
      false,
      canvasCenter,
      canvas.getWidth(),
      canvas.getHeight(),
    );
    addGuideline(canvas, horizontalLine);

    // 회전된 객체도 고려한 중앙 정렬
    const currentCenter = movingObj.getCenterPoint();
    movingObj.set({
      top: movingObj.top + (canvasCenter.y - currentCenter.y),
    });
  }

  // 다른 객체들과의 정렬 체크
  const allObjects = canvas
    .getObjects()
    .filter(
      (obj) => obj !== movingObj && obj.visible && obj.selectable !== false,
    );

  for (const obj of allObjects) {
    const otherCenter = obj.getCenterPoint();

    // 수직 중앙 정렬
    if (Math.abs(objCenter.x - otherCenter.x) < SNAP_THRESHOLD) {
      const verticalLine = new Line(
        [otherCenter.x, 0, otherCenter.x, canvas.getHeight()],
        {
          stroke: GUIDELINE_COLOR,
          strokeWidth: GUIDELINE_STROKE_WIDTH,
          strokeDashArray: [3, 3],
          selectable: false,
          evented: false,
          excludeFromExport: true,
        },
      );
      addGuideline(canvas, verticalLine);

      // 회전된 객체도 고려한 중앙 정렬
      const currentCenter = movingObj.getCenterPoint();
      movingObj.set({
        left: movingObj.left + (otherCenter.x - currentCenter.x),
      });
    }

    // 수평 중앙 정렬
    if (Math.abs(objCenter.y - otherCenter.y) < SNAP_THRESHOLD) {
      const horizontalLine = new Line(
        [0, otherCenter.y, canvas.getWidth(), otherCenter.y],
        {
          stroke: GUIDELINE_COLOR,
          strokeWidth: GUIDELINE_STROKE_WIDTH,
          strokeDashArray: [3, 3],
          selectable: false,
          evented: false,
          excludeFromExport: true,
        },
      );
      addGuideline(canvas, horizontalLine);

      // 회전된 객체도 고려한 중앙 정렬
      const currentCenter = movingObj.getCenterPoint();
      movingObj.set({
        top: movingObj.top + (otherCenter.y - currentCenter.y),
      });
    }
  }
};
