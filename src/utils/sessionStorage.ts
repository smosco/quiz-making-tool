import type { Canvas } from 'fabric';
import { useEditorStore } from '../store/editorStore';

export const saveEditorState = (canvas: Canvas) => {
  // fabric 객체 JSON 저장
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const fabricJson = (canvas as any).toJSON(['jeiId', 'jeiRole']);
  sessionStorage.setItem('fabricData', JSON.stringify(fabricJson));

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
