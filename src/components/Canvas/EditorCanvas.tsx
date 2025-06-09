import { Canvas, type FabricObject } from 'fabric';
import { useEffect, useRef } from 'react';
import { useCanvasObjectSync } from '../../hooks/useCanvasEvents';
import { useEditorStore } from '../../store/editorStore';
import useToolbarStore from '../../store/useToolbarStore';

let canvas: Canvas;
export const getCanvasInstance = () => canvas;

export default function EditorCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const store = useEditorStore.getState();

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

    const handleSelectionChange = () => {
      // 약간의 지연을 주어 Fabric.js 내부 처리 완료 후 실행
      setTimeout(() => {
        const activeObjects = canvas.getActiveObjects();
        const { setSelectedObjects } = useEditorStore.getState();

        // console.log('=== Selection Change (After Timeout) ===');
        // console.log('Active objects count:', activeObjects.length);
        // console.log(
        //   'Active objects:',
        //   activeObjects.map((obj) => ({ type: obj.type, jeiId: obj.jeiId })),
        // );

        setSelectedObjects(activeObjects);

        // Toolbar 설정
        const { setToolbar } = useToolbarStore.getState();
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
      }, 0); // 다음 이벤트 루프에서 실행
    };

    const handleSelectionCleared = () => {
      setTimeout(() => {
        const { setSelectedObjects } = useEditorStore.getState();
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

      store.setMode(mode);
      store.setOptions(options); // imageDataUrl 포함된 객체 배열 그대로
    }

    // 언마운트 시 캔버스 해제
    return () => {
      canvas.dispose();
    };
  }, []);

  // 커스텀 훅으로 객체 동기화 처리
  useCanvasObjectSync(canvas);

  return (
    <canvas
      ref={canvasRef}
      className='rounded-md shadow-inner border border-gray-100'
    />
  );
}
