import { Canvas, type Group } from 'fabric';
import { useEffect, useRef } from 'react';
import type { OptionState } from '../../store/useEditorStore';

// 패브릭 그룹이 __clickHandlerRegistered을 포함하도록 확장
declare module 'fabric' {
  interface Group {
    __clickHandlerRegistered?: boolean;
  }
}
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

    // 이미 초기화된 캔버스가 있다면 먼저 정리
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.dispose();
      fabricCanvasRef.current = null;
    }

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

    // fabricJson이 없는 경우 빈 캔버스로 초기화
    if (!fabricJson || !interactionJson) {
      canvas.requestRenderAll();
      return () => {
        canvas.dispose();
        fabricCanvasRef.current = null;
      };
    }

    try {
      const interaction = JSON.parse(interactionJson);
      const { options, mode: choiceMode } = interaction.choices[0];
      const correctIds = options
        .filter((option: OptionState) => option.isAnswer)
        .map((option: OptionState) => option.id);

      // init 액션 사용
      usePreviewStore.getState().init(choiceMode, correctIds);

      canvas.loadFromJSON(JSON.parse(fabricJson), () => {
        setTimeout(() => {
          canvas.requestRenderAll();

          canvas.getObjects().forEach((obj) => {
            obj.set({
              selectable: false,
            });

            if (obj.type !== 'group') return;

            const group = obj as Group;
            if (group.jeiRole !== 'choice') return;

            group.set({
              hoverCursor: 'pointer',
            });

            // 이벤트를 한 번만 등록하고 끝 이미 등록되어 있는지 확인
            if (!group.__clickHandlerRegistered) {
              group.on('mousedown', () => {
                const { submitted, select } = usePreviewStore.getState();
                if (submitted) return;

                const id = group.jeiId;
                if (id) {
                  select(id);
                  updateVisualStyle(canvas);
                }
              });

              // 등록 플래그 설정
              group.__clickHandlerRegistered = true;
            }
          });

          updateVisualStyle(canvas);
        }, 50);
      });
    } catch (error) {
      console.error('Failed to load canvas data:', error);
      // 에러 발생 시에도 빈 캔버스 렌더링
      canvas.requestRenderAll();
    }

    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, []);

  // 상태 변화 시 시각적 스타일 업데이트만
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    updateVisualStyle(canvas);
  }, [selectedIds, submitted]);

  return <canvas ref={canvasRef} className='border border-gray-300' />;
}
