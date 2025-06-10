import { getCanvasInstance } from '../components/Canvas/EditorCanvas';
import { getEditorState } from '../store/useEditorStore';
import type { OptionState } from '../store/useEditorStore';
import { captureSingleObject } from './fabricUtils';

export async function addOptionsFromSelectedObjects() {
  const canvas = getCanvasInstance();

  const { selectedObjects, options, setOptions } = getEditorState();

  if (!canvas) return;
  const newOptions: OptionState[] = [];

  for (const obj of selectedObjects) {
    const id = obj.jeiId;
    if (!id || options.find((o) => o.id === id)) continue;

    obj.set({
      jeiRole: 'choice',
    });
    const imageDataUrl = captureSingleObject(canvas, obj);
    newOptions.push({ id, isAnswer: false, imageDataUrl });
  }

  setOptions([...options, ...newOptions]);
}
