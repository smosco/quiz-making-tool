import type { Canvas } from 'fabric';
import { useEditorStore } from '../store/editorStore';

export const saveEditorState = (canvas: Canvas) => {
  // fabric 객체 JSON 저장
  // TODO(@한현): toJSON으로 저장하면 jeiId, jeiRole이 저장이 안되던게 toObject로는 저장이 된다.
  // 차이 비교해보기
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const fabricJson = (canvas as any).toObject(['jeiId', 'jeiRole']);
  sessionStorage.setItem('fabricData', JSON.stringify(fabricJson));

  // console.log('fabricData', JSON.stringify(fabricJson));

  // 옵션 및 모드 저장
  const { options, mode } = useEditorStore.getState();

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
