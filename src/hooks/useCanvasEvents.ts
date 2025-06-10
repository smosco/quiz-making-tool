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
    // TODO(@한현): 텍스트 폰트, 사이즈, 기울기, 굵기 변경 감지 이벤트 추가

    return () => {
      canvas.off('object:modified', handleObjectModified);
      canvas.off('object:scaling', handleObjectModified);
      canvas.off('object:rotating', handleObjectModified);
      canvas.off('object:moving', handleObjectModified);
      canvas.off('text:changed', handleObjectModified);
    };
  }, [canvas, updateOptionImage]);
};
