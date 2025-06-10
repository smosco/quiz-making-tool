import { Canvas, type Group } from 'fabric';
import { useEffect, useRef } from 'react';
import {
  usePreviewStore,
  useSelectedIds,
  useSubmitted,
} from '../../store/usePreviewStore';
import { updateVisualStyle } from '../../utils/previewUtils';

export default function PreviewCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);

  // 선택적 구독 - 필요한 상태만 개별적으로 구독
  const selectedIds = useSelectedIds();
  const submitted = useSubmitted();

  // 초기 캔버스 세팅
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    const canvas = new Canvas(el, {
      backgroundColor: 'white',
      selection: false,
      preserveObjectStacking: true,
    });

    fabricCanvasRef.current = canvas;
    canvas.setDimensions({ width: 800, height: 500 });

    // 세션 데이터 로드
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

    // init 액션 사용
    usePreviewStore.getState().init(choiceMode, correctIds);

    canvas.loadFromJSON(JSON.parse(fabricJson), () => {
      // 이미지 등 비동기 요소가 반영될 수 있으므로 지연 렌더링
      setTimeout(() => {
        canvas.requestRenderAll();

        canvas.getObjects().forEach((obj) => {
          if (obj.type !== 'group') return;
          // TODO(@한현): 객체의 타입이 group이 아닌 경우에도 아래 set 설정 필요(group과는 살짝 다름)

          const group = obj as Group;
          if (group.jeiRole !== 'choice') return;

          group.set({
            hoverCursor: 'pointer',
            hasControls: false,
            lockMovementX: true,
            lockMovementY: true,
          });

          group.on('mousedown', () => {
            const { submitted, select } = usePreviewStore.getState();
            if (submitted) return;

            const id = group.jeiId;
            if (id) {
              select(id);
              updateVisualStyle(canvas);
            }
          });
        });

        updateVisualStyle(canvas);
      }, 50);
    });

    return () => {
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, []);

  // 상태 변화 시 시각적 스타일 업데이트
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    updateVisualStyle(canvas);
  }, [selectedIds, submitted]);

  return <canvas ref={canvasRef} className='border border-gray-300' />;
}
