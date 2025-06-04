import { FabricImage } from 'fabric';
import { v4 as uuidv4 } from 'uuid';
import { getCanvasInstance } from '../components/Canvas/EditorCanvas';

export const addImageToCanvas = async (url: string) => {
  const canvas = getCanvasInstance();
  if (!canvas) return;

  const imgEl = await new Promise<HTMLImageElement>((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.src = url;
  });

  const fabricImg = new FabricImage(imgEl, {
    left: 100,
    top: 100,
  });

  fabricImg.set({
    jeiId: uuidv4(),
    jeiRole: 'choice',
  });

  console.log(fabricImg);

  canvas.add(fabricImg);
  canvas.setActiveObject(fabricImg);
  canvas.requestRenderAll();
};
