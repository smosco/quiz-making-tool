import { Canvas, type Group, Rect } from 'fabric';
import { useEffect, useRef } from 'react';
import { usePreviewStore } from '../../store/usePreviewStore';
import { updateVisualStyle } from '../../utils/previewUtils';

export default function PreviewCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { selectedIds, submitted, mode, select } = usePreviewStore();

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    const canvas = new Canvas(el, {
      backgroundColor: 'white',
      selection: false,
      preserveObjectStacking: true,
    });

    canvas.setDimensions({ width: 800, height: 500 });

    const fabricJson = sessionStorage.getItem('fabricData');
    const interactionJson = sessionStorage.getItem('interactionData');

    if (!fabricJson || !interactionJson) return;

    const interaction = JSON.parse(interactionJson);
    const { options, mode: choiceMode } = interaction.choices[0];
    const correctIds = options
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      .filter((o: any) => o.isAnswer)
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      .map((o: any) => o.id);

    usePreviewStore.setState({
      mode: choiceMode,
      correctIds,
      selectedIds: [],
      submitted: false,
      retryCount: 0,
    });

    canvas.loadFromJSON(JSON.parse(fabricJson), () => {
      // 이미지 로딩 완료까지 약간의 시간 대기
      setTimeout(() => {
        canvas.requestRenderAll();

        const objs = canvas.getObjects();
        console.log('객체 확인', objs);

        objs.forEach((obj) => {
          console.log('hello', obj.type);
          if (obj.type !== 'group') return;
          const group = obj as Group & { jeiId: string; jeiRole: string };

          console.log(group, 'group', group.jeiRole);
          if (group.jeiRole === 'choice') {
            console.log('role', group.jeiRole);
            group.set({
              hoverCursor: 'pointer',
              selectable: false,
              hasControls: false,
            });

            group.on('mousedown', () => {
              if (usePreviewStore.getState().submitted) return;

              const id = group.jeiId;
              usePreviewStore.getState().select(id);
              updateVisualStyle(canvas);
            });
          }
        });

        updateVisualStyle(canvas);
      }, 50); // 이미지 로딩 보장 시간
    });

    return () => {
      canvas.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className='border border-gray-300' />;
}
