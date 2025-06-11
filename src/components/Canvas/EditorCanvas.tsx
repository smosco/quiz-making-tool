import { Canvas } from 'fabric';
import { useEffect, useRef } from 'react';
import { useCanvasObjectSync } from '../../hooks/useCanvasObjectSync';
import { getEditorState } from '../../store/useEditorStore';
import useToolbarStore from '../../store/useToolbarStore';
import { clearLines, handleObjectMoving } from '../../utils/guidelineUtils';

let canvas: Canvas;
export const getCanvasInstance = () => canvas;

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

    // 객체 이동시 가이드라인 이벤트 호출
    canvas.on('object:moving', (e) => handleObjectMoving(canvas, e));
    canvas.on('mouse:up', () => clearLines(canvas));

    const handleSelectionChange = () => {
      setTimeout(() => {
        const activeObjects = canvas.getActiveObjects();
        const { setSelectedObjects } = getEditorState();
        const { setToolbar } = useToolbarStore.getState();

        setSelectedObjects(activeObjects);

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
      clearLines(canvas); // 선택 해제 시에도 가이드라인 정리
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

    // 세션 데이터 복원
    const fabricJson = sessionStorage.getItem('fabricData');
    if (fabricJson) {
      canvas.loadFromJSON(JSON.parse(fabricJson), () => {
        canvas.requestRenderAll();
      });
    }

    const interactionJson = sessionStorage.getItem('interactionData');
    if (interactionJson) {
      const interaction = JSON.parse(interactionJson);
      const { options, mode } = interaction.choices[0];
      const { setMode, setOptions } = getEditorState();
      setMode(mode);
      setOptions(options);
    }

    return () => {
      clearLines(canvas);
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
