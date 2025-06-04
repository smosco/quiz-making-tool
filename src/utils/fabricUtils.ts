import { Rect, Textbox } from 'fabric';
import { v4 as uuidv4 } from 'uuid';
import { getCanvasInstance } from '../components/Canvas/EditorCanvas';

// 캔버스에 Text 추가
export const addTextToCanvas = async () => {
  const canvas = getCanvasInstance();
  if (!canvas) return;

  const fabricTextbox = new Textbox('Text', {
    left: 100,
    top: 100,
  });

  fabricTextbox.set({
    jeiId: uuidv4(),
    jeiRole: 'choice',
  });

  console.log(fabricTextbox);

  canvas.add(fabricTextbox);
  canvas.setActiveObject(fabricTextbox);
  canvas.requestRenderAll();
};

// 캔버스에 Rect 추가
export const addRectToCanvas = async () => {
  const canvas = getCanvasInstance();
  if (!canvas) return;

  const fabricRect = new Rect({
    left: 100,
    top: 100,
    width: 56,
    height: 56,
    fill: 'transparent',
    strokeWidth: 2,
    stroke: '#e5e7eb',
    strokeLineCap: 'round',
    strokeLineJoin: 'round',
  });

  fabricRect.set({
    jeiId: uuidv4(),
    jeiRole: 'choice',
  });

  canvas.add(fabricRect);
  canvas.setActiveObject(fabricRect);
  canvas.requestRenderAll();
};
