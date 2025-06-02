import { Canvas } from 'fabric';
import { useEffect, useRef } from 'react';

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

    canvas.setWidth(800);
    canvas.setHeight(500);
    canvas.on('mouse:wheel', (opt) => opt.e.preventDefault());

    return () => {
      canvas.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className='border border-gray-300' />;
}
