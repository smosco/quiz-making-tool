import { Canvas, type FabricObject } from 'fabric';
import { useEffect, useRef } from 'react';
import { useEditorStore } from '../../store/editorStore';
import useToolbarStore from '../../store/useToolbarStore';

let canvas: Canvas;
export const getCanvasInstance = () => canvas;

export default function EditorCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const store = useEditorStore.getState();
  const { setToolbar } = useToolbarStore();

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

    // 객체 선택 시 zustand의 selectedObjects에 반영
    const setSelectedObjects = store.setSelectedObjects;

    // TODO(@한현): 이벤트 타입, selected 타입 임시로 any로 해놓음
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const handleSelectionChange = (e: any) => {
      const selected = (e.selected ?? []) as FabricObject[];
      setSelectedObjects(selected);

      console.log(selected);

      if (selected.length === 1) {
        const obj = selected[0];
        if (obj.type === 'textbox') {
          setToolbar('text');
        } else if (obj.type === 'group') {
          setToolbar('group');
        } else {
          setToolbar('default');
        }
      } else if (selected.length > 1) {
        setToolbar('group');
      } else {
        setToolbar('default');
      }
    };

    canvas.on('selection:created', handleSelectionChange);
    canvas.on('selection:updated', handleSelectionChange);
    canvas.on('selection:cleared', () => {
      setSelectedObjects([]);
      setToolbar('default');
    });

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

  return <canvas ref={canvasRef} className='border border-gray-300' />;
}
