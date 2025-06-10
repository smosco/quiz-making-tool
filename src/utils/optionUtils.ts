import { getCanvasInstance } from '../components/Canvas/EditorCanvas';
import { getEditorState } from '../store/editorStore';
import type { OptionState } from '../store/editorStore';
import { captureSingleObject } from './fabricUtils';

export async function addOptionsFromSelectedObjects() {
  const canvas = getCanvasInstance();

  const { selectedObjects, options, setOptions } = getEditorState();

  if (!canvas) return;
  const newOptions: OptionState[] = [];

  for (const obj of selectedObjects) {
    const id = obj.jeiId;
    if (!id || options.find((o) => o.id === id)) continue;
    const imageDataUrl = captureSingleObject(canvas, obj);
    newOptions.push({ id, isAnswer: false, imageDataUrl });
  }

  setOptions([...options, ...newOptions]);
}
