import { Canvas } from 'fabric';
// components/Canvas/EditorCanvas.tsx
import { useEffect, useRef } from 'react';
import { loadEditorState } from '../../utils/sessionStorage';

let canvas: Canvas;
export const getCanvasInstance = () => canvas;

export default function EditorCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    // 세션 스토리지에서 불러오기
    const saved = loadEditorState();
    // biome-ignore lint/complexity/useOptionalChain: <explanation>
    if (saved && saved.elements) {
      canvas.loadFromJSON(
        {
          objects: saved.elements.objects,
          background: saved.elements.background,
        },
        () => {
          setTimeout(() => canvas.requestRenderAll(), 0); // 이미지 처리까지 기다림
        },
      );
    }

    return () => {
      canvas.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className='border border-gray-300' />;
}
