import type { Canvas, Group, Rect } from 'fabric';
import { util } from 'fabric';
import { usePreviewStore } from '../store/usePreviewStore';

/**
 * 펄스 애니메이션 생성(선택)
 *
 * @param {Group} group
 * @param {Canvas} canvas
 */
const createPulseAnimation = (group: Group, canvas: Canvas) => {
  const originalScaleX = group.scaleX || 1;
  const originalScaleY = group.scaleY || 1;

  group.animate(
    {
      scaleX: originalScaleX * 1.1,
      scaleY: originalScaleY * 1.1,
    },
    {
      duration: 300,
      easing: util.ease.easeOutQuad,
      onChange: () => canvas.requestRenderAll(),
      onComplete: () => {
        group.animate(
          {
            scaleX: originalScaleX,
            scaleY: originalScaleY,
          },
          {
            duration: 200,
            easing: util.ease.easeOutQuad,
            onChange: () => canvas.requestRenderAll(),
          },
        );
      },
    },
  );
};

/**
 * 성공 애니메이션 생성 (정답)
 *
 * @param {Group} group
 * @param {Canvas} canvas
 */
const createSuccessAnimation = (group: Group, canvas: Canvas) => {
  const originalScaleX = group.scaleX || 1;
  const originalScaleY = group.scaleY || 1;
  const originalAngle = group.angle || 0;

  // 1단계: 작아지기
  group.animate(
    {
      scaleX: originalScaleX * 0.8,
      scaleY: originalScaleY * 0.8,
    },
    {
      duration: 150,
      easing: util.ease.easeInQuad,
      onChange: () => canvas.requestRenderAll(),
      onComplete: () => {
        // 2단계: 크게 튀어나오기 + 살짝 회전
        group.animate(
          {
            scaleX: originalScaleX * 1.2,
            scaleY: originalScaleY * 1.2,
            angle: originalAngle + 5,
          },
          {
            duration: 200,
            easing: util.ease.easeOutBack,
            onChange: () => canvas.requestRenderAll(),
            onComplete: () => {
              // 3단계: 원래 크기로 돌아가기
              group.animate(
                {
                  scaleX: originalScaleX,
                  scaleY: originalScaleY,
                  angle: originalAngle,
                },
                {
                  duration: 200,
                  easing: util.ease.easeOutQuad,
                  onChange: () => canvas.requestRenderAll(),
                },
              );
            },
          },
        );
      },
    },
  );
};

/**
 * 실패 애니메이션 생성 (오답)
 *
 * @param {Group} group
 * @param {Canvas} canvas
 */
const createFailAnimation = (group: Group, canvas: Canvas) => {
  const originalLeft = group.left || 0;
  const originalAngle = group.angle || 0;
  const shakeDistance = 10;

  // 좌우로 흔들기 애니메이션
  let shakeCount = 0;
  const maxShakes = 3;

  const shake = () => {
    if (shakeCount >= maxShakes) {
      // 원래 위치로 복귀
      group.animate(
        {
          left: originalLeft,
          angle: originalAngle,
        },
        {
          duration: 100,
          easing: util.ease.easeOutQuad,
          onChange: () => canvas.requestRenderAll(),
        },
      );
      return;
    }

    const direction = shakeCount % 2 === 0 ? 1 : -1;

    group.animate(
      {
        left: originalLeft + shakeDistance * direction,
        angle: originalAngle + 3 * direction,
      },
      {
        duration: 80,
        easing: util.ease.easeInOutQuad,
        onChange: () => canvas.requestRenderAll(),
        onComplete: () => {
          shakeCount++;
          shake();
        },
      },
    );
  };

  shake();
};

/**
 * 프리뷰 캔버스에서 선택, 정답, 오답 여부에 따라 시각적 피드백 주는 함수
 *
 * @param {Canvas} canvas
 */
export const updateVisualStyle = (canvas: Canvas) => {
  const { selectedIds, correctIds, submitted, mode, getIsCorrect } =
    usePreviewStore.getState();

  // 전체 정답 여부 확인 (다중선택 모드에서 필요)
  const isAllCorrect = getIsCorrect();

  canvas.getObjects().forEach((obj) => {
    if (obj.type !== 'group') return;
    const group = obj as Group;
    if (group.jeiRole !== 'choice') return;

    const border = group._objects.find((o) => o.type === 'rect') as Rect;
    if (!border) return;

    if (!group.jeiId) return;

    const isSelected = selectedIds.includes(group.jeiId);
    const isCorrectChoice = correctIds.includes(group.jeiId);

    if (!submitted) {
      // 제출 전: 선택/미선택 상태
      border.set('stroke', isSelected ? '#3B82F6' : '#D1D5DB');
      border.set('opacity', 1);

      if (isSelected) {
        // 선택된 항목에 펄스 애니메이션
        createPulseAnimation(group, canvas);
      }
    } else {
      // 제출 후: 정답/오답 결과 표시
      if (!isSelected) {
        // 선택되지 않은 항목들 - 모두 동일하게 처리
        border.set('stroke', '#E5E7EB');
        border.set('opacity', 0.4);
      } else {
        // 선택된 항목들
        if (mode === 'unit') {
          // 단일선택: 개별 선택지의 정답 여부로 판단
          border.set('stroke', isCorrectChoice ? '#10B981' : '#EF4444');
          border.set('opacity', 1);

          if (isCorrectChoice) {
            createSuccessAnimation(group, canvas);
          } else {
            createFailAnimation(group, canvas);
          }
        } else {
          // 다중선택: 전체 정답 여부로 판단
          if (isAllCorrect) {
            // 모든 선택이 맞은 경우: 선택된 모든 항목에 성공 애니메이션
            border.set('stroke', '#10B981');
            border.set('opacity', 1);
            createSuccessAnimation(group, canvas);
          } else {
            // 일부 틀린 경우: 선택된 모든 항목에 실패 애니메이션
            border.set('stroke', '#EF4444');
            border.set('opacity', 1);
            createFailAnimation(group, canvas);
          }
        }
      }
    }
  });

  canvas.requestRenderAll();
};
