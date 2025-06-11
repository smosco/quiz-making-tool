import { type Canvas, Line } from 'fabric';

// 가이드라인 관련 상수
export const SNAP_THRESHOLD = 10;
export const GUIDELINE_COLOR = '#ff0000';
export const GUIDELINE_STROKE_WIDTH = 1;

// 가이드라인 저장 배열
let guidelines: Line[] = [];

// 가이드라인 생성
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

// 가이드라인 제거
export const clearLines = (canvas: Canvas) => {
  guidelines.forEach((line) => {
    if (canvas.contains(line)) {
      canvas.remove(line);
    }
  });
  guidelines = [];
  canvas.requestRenderAll();
};

// 가이드라인 추가
export const addGuideline = (canvas: Canvas, line: Line) => {
  canvas.add(line);
  guidelines.push(line);
};

// 메인 가이드라인 로직
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
    movingObj.left = canvasCenter.x - movingObj.getScaledWidth() / 2;
  }

  if (Math.abs(objCenter.y - canvasCenter.y) < SNAP_THRESHOLD) {
    const horizontalLine = createGuideline(
      false,
      canvasCenter,
      canvas.getWidth(),
      canvas.getHeight(),
    );
    addGuideline(canvas, horizontalLine);
    movingObj.top = canvasCenter.y - movingObj.getScaledHeight() / 2;
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
      movingObj.left = otherCenter.x - movingObj.getScaledWidth() / 2;
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
      movingObj.top = otherCenter.y - movingObj.getScaledHeight() / 2;
    }
  }
};
