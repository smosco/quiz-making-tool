import type { Canvas, FabricObject } from 'fabric';
import { useEffect } from 'react';
import { useEditorStore } from '../store/useEditorStore';

interface FabricEvent {
  target: FabricObject;
  e?: Event;
}

export const useCanvasObjectSync = (canvas: Canvas) => {
  const { updateOptionImage } = useEditorStore();

  useEffect(() => {
    if (!canvas) return;

    const handleObjectModified = (e: FabricEvent) => {
      const modifiedObject = e.target;
      if (modifiedObject?.jeiId) {
        updateOptionImage(modifiedObject.jeiId, modifiedObject, canvas);
      }
    };

    // 개별적으로 등록/해제
    canvas.on('object:modified', handleObjectModified);
    canvas.on('object:scaling', handleObjectModified);
    canvas.on('object:rotating', handleObjectModified);
    canvas.on('object:moving', handleObjectModified);
    canvas.on('text:changed', handleObjectModified);
    // TODO(@한현): 텍스트 폰트, 사이즈, 굵기 변경 이벤트 감지
    // canvas.on('text:editing:entered', handleObjectModified);
    // canvas.on('text:editing:exited', handleObjectModified);
    // canvas.on('text:selection:changed', handleObjectModified);

    return () => {
      canvas.off('object:modified', handleObjectModified);
      canvas.off('object:scaling', handleObjectModified);
      canvas.off('object:rotating', handleObjectModified);
      canvas.off('object:moving', handleObjectModified);
      canvas.off('text:changed', handleObjectModified);
      // canvas.off('text:editing:entered', handleObjectModified);
      // canvas.off('text:editing:exited', handleObjectModified);
      // canvas.off('text:selection:changed', handleObjectModified);
    };
  }, [canvas, updateOptionImage]);
};
