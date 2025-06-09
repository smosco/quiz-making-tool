import type { Canvas, FabricObject } from 'fabric';
import { useCallback } from 'react';
import { type AlignmentType, AlignmentUtils } from '../utils/alignmentUtils';

export const useAlignment = (canvas: Canvas | null) => {
  const getSelectedObjects = useCallback((): FabricObject[] => {
    if (!canvas) return [];
    return canvas.getActiveObjects();
  }, [canvas]);

  const align = useCallback(
    (type: AlignmentType) => {
      if (!canvas) return;

      const selectedObjects = getSelectedObjects();
      AlignmentUtils.executeAlignment(canvas, selectedObjects, type);
    },
    [canvas, getSelectedObjects],
  );

  const canAlign = useCallback((): boolean => {
    return getSelectedObjects().length >= 2;
  }, [getSelectedObjects]);

  return { align, canAlign, getSelectedObjects };
};
