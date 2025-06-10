import { Canvas, type FabricObject, Line } from 'fabric';
import { useEffect, useRef } from 'react';
import { useCanvasObjectSync } from '../../hooks/useCanvasEvents';
import { getEditorState } from '../../store/useEditorStore';
import useToolbarStore from '../../store/useToolbarStore';

let canvas: Canvas;
export const getCanvasInstance = () => canvas;

// 가이드라인 관련 상수
const SNAP_THRESHOLD = 10; // 스냅 임계값 (px)
const GUIDELINE_COLOR = '#ff0000';
const GUIDELINE_STROKE_WIDTH = 1;

// 가이드라인 저장 배열
let guidelines: Line[] = [];

// 가이드라인 생성
const createGuideline = (
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
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } as any);
};

// 가이드라인 제거
const clearLines = () => {
  guidelines.forEach((line) => {
    if (canvas.contains(line)) {
      canvas.remove(line);
    }
  });
  guidelines = [];
  canvas.requestRenderAll();
};

export default function EditorCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    // Fabric 캔버스 생성 및 설정
    canvas = new Canvas(el, {
      backgroundColor: 'white',
      preserveObjectStacking: true,
      selection: true,
    });

    canvas.setDimensions({ width: 800, height: 500 });
    canvas.on('mouse:wheel', (opt) => opt.e.preventDefault());

    // 간단한 가이드라인 시스템
    canvas.on('object:moving', (e) => {
      if (!e.target) return;

      const movingObj = e.target;
      const objCenter = movingObj.getCenterPoint();
      const canvasCenter = {
        x: canvas.getWidth() / 2,
        y: canvas.getHeight() / 2,
      };

      clearLines();

      // 캔버스 중앙 정렬 체크
      if (Math.abs(objCenter.x - canvasCenter.x) < SNAP_THRESHOLD) {
        const verticalLine = createGuideline(
          true,
          canvasCenter,
          canvas.getWidth(),
          canvas.getHeight(),
        );
        canvas.add(verticalLine);
        guidelines.push(verticalLine);
        movingObj.left = canvasCenter.x - movingObj.getScaledWidth() / 2;
      }

      if (Math.abs(objCenter.y - canvasCenter.y) < SNAP_THRESHOLD) {
        const horizontalLine = createGuideline(
          false,
          canvasCenter,
          canvas.getWidth(),
          canvas.getHeight(),
        );
        canvas.add(horizontalLine);
        guidelines.push(horizontalLine);
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

        // 수직 중앙 정렬 (좌우 중심)
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
              // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            } as any,
          );
          canvas.add(verticalLine);
          guidelines.push(verticalLine);
          movingObj.left = otherCenter.x - movingObj.getScaledWidth() / 2;
        }

        // 수평 중앙 정렬 (위아래 중심)
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
              // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            } as any,
          );
          canvas.add(horizontalLine);
          guidelines.push(horizontalLine);
          movingObj.top = otherCenter.y - movingObj.getScaledHeight() / 2;
        }
      }
    });

    // 이동 완료 후 가이드라인 제거
    canvas.on('mouse:up', () => {
      clearLines();
    });

    const handleSelectionChange = () => {
      setTimeout(() => {
        const activeObjects = canvas.getActiveObjects();
        const { setSelectedObjects } = getEditorState();
        const { setToolbar } = useToolbarStore.getState();

        setSelectedObjects(activeObjects);

        // ToolbarType 설정
        if (activeObjects.length === 1) {
          const obj = activeObjects[0];
          if (obj.type === 'textbox') {
            setToolbar('text');
          } else if (obj.type === 'group') {
            setToolbar('group');
          } else {
            setToolbar('default');
          }
        } else if (activeObjects.length > 1) {
          setToolbar('group');
        } else {
          setToolbar('default');
        }
      }, 0);
    };

    const handleSelectionCleared = () => {
      clearLines(); // 선택 해제 시에도 가이드라인 정리
      setTimeout(() => {
        const { setSelectedObjects } = getEditorState();
        const { setToolbar } = useToolbarStore.getState();

        setSelectedObjects([]);
        setToolbar('default');
      }, 0);
    };

    canvas.on('selection:created', handleSelectionChange);
    canvas.on('selection:updated', handleSelectionChange);
    canvas.on('selection:cleared', handleSelectionCleared);

    // 세션에서 fabric JSON 복원
    const fabricJson = sessionStorage.getItem('fabricData');
    if (fabricJson) {
      canvas.loadFromJSON(JSON.parse(fabricJson), () => {
        canvas.requestRenderAll();
      });
    }

    // 세션에서 interaction 데이터 복원
    const interactionJson = sessionStorage.getItem('interactionData');
    if (interactionJson) {
      const interaction = JSON.parse(interactionJson);
      const { options, mode } = interaction.choices[0];

      const { setMode, setOptions } = getEditorState();
      setMode(mode);
      setOptions(options);
    }

    // 언마운트 시 캔버스 해제
    return () => {
      clearLines();
      canvas.dispose();
    };
  }, []);

  useCanvasObjectSync(canvas);

  return (
    <canvas
      ref={canvasRef}
      className='rounded-md shadow-inner border border-gray-100'
    />
  );
}
