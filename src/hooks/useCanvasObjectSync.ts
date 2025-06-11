import type { Canvas, FabricObject } from 'fabric';
import { useEffect } from 'react';
import { useEditorStore } from '../store/useEditorStore';

interface FabricEvent {
  target: FabricObject;
  e?: Event;
}

export const useCanvasObjectSync = (canvas: Canvas | null) => {
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

    return () => {
      canvas.off('object:modified', handleObjectModified);
      canvas.off('object:scaling', handleObjectModified);
      canvas.off('object:rotating', handleObjectModified);
    };
  }, [canvas, updateOptionImage]);
};
