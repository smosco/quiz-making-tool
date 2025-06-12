import type { Canvas } from 'fabric';
import { getEditorState } from '../store/useEditorStore';

export const saveEditorState = (canvas: Canvas) => {
  // fabric 객체 JSON으로 저장
  const fabricJson = canvas.toObject(['jeiId', 'jeiRole']);
  sessionStorage.setItem('fabricData', JSON.stringify(fabricJson));

  // 일반 함수 내부에서 훅 사용 불가 -> 선택적 구독 불가
  const { options, mode } = getEditorState();

  const interactionData = {
    type: 'choice',
    interactionType: 'choice',
    choices: [
      {
        mode,
        options,
        sounds: {},
      },
    ],
  };

  sessionStorage.setItem('interactionData', JSON.stringify(interactionData));
};
