import { Canvas } from 'fabric';
import { useEffect, useRef } from 'react';
import { useEditorStore } from '../../store/editorStore';

let canvas: Canvas;
export const getCanvasInstance = () => canvas;

export default function EditorCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const store = useEditorStore.getState();
  const { options } = useEditorStore();

  console.log(options);

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

    canvas.on('selection:created', (e) => {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      if (e.selected) setSelectedObjects(e.selected as any[]);
    });

    canvas.on('selection:updated', (e) => {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      if (e.selected) setSelectedObjects(e.selected as any[]);
    });

    canvas.on('selection:cleared', () => {
      setSelectedObjects([]);
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
