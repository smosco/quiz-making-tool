import { Canvas } from 'fabric';
import { useEffect, useRef } from 'react';
import { useEditorStore } from '../../store/editorStore';
import { loadEditorState } from '../../utils/sessionStorage';

let canvas: Canvas;
export const getCanvasInstance = () => canvas;

export default function EditorCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const addOption = useEditorStore((s) => s.addOption);

  const store = useEditorStore.getState();

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    canvas = new Canvas(el, {
      backgroundColor: 'white',
      preserveObjectStacking: true,
      selection: true,
    });

    canvas.setDimensions({ width: 800, height: 500 });
    canvas.on('mouse:wheel', (opt) => opt.e.preventDefault());

    // 객체 클릭 시 zustand에 추가
    canvas.on('mouse:down', (e) => {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const target = e.target as any;
      if (target?.jeiRole === 'choice' && target.jeiId) {
        addOption(target.jeiId);
      }
    });

    const saved = loadEditorState();
    console.log('saved', saved?.elements);
    if (saved?.elements) {
      canvas.loadFromJSON(saved.elements, () => {
        setTimeout(() => canvas.requestRenderAll(), 0);
      });
    }
    if (saved?.interaction?.choices?.[0]) {
      const { options, answer, mode } = saved.interaction.choices[0];
      store.setMode(mode);
      store.setOptions(
        options.map((id) => ({ id, isAnswer: answer.includes(id) })),
      );
    }

    return () => {
      canvas.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className='border border-gray-300' />;
}
