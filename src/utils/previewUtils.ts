import type { Canvas, Group, Rect } from 'fabric';
import { usePreviewStore } from '../store/usePreviewStore';

export const updateVisualStyle = (canvas: Canvas) => {
  const { selectedIds, correctIds, submitted } = usePreviewStore.getState();

  canvas.getObjects().forEach((obj) => {
    if (obj.type !== 'group') return;
    const group = obj as Group & { jeiId: string; jeiRole: string };
    if (group.jeiRole !== 'choice') return;

    const border = group._objects.find((o) => o.type === 'rect') as Rect;
    if (!border) return;

    const isSelected = selectedIds.includes(group.jeiId);
    const isCorrect = correctIds.includes(group.jeiId);

    if (!submitted) {
      border.set('stroke', isSelected ? '#3B82F6' : '#D1D5DB'); // blue or gray
    } else {
      if (!isSelected) {
        border.set('stroke', '#E5E7EB');
        border.set('opacity', 0.4);
      } else {
        border.set('stroke', isCorrect ? '#10B981' : '#EF4444'); // green or red
        border.set('opacity', 1);
      }
    }
  });

  canvas.requestRenderAll();
};
