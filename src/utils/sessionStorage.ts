import type { Canvas } from 'fabric';
import { useEditorStore } from '../store/editorStore';

export const saveEditorState = (canvas: Canvas) => {
  // fabric 데이터
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const fabricJson = (canvas as any).toJSON(['jeiId', 'jeiRole']);
  sessionStorage.setItem('fabricData', JSON.stringify(fabricJson));

  // interaction 등 별도 데이터
  const { options, mode } = useEditorStore.getState();
  const optionIds = options.map((o) => o.id);
  const answerIds = options.filter((o) => o.isAnswer).map((o) => o.id);

  const interactionData = {
    type: 'choice',
    interactionType: 'choice',
    choices: [
      {
        mode,
        options: optionIds,
        answer: answerIds,
        sounds: {},
      },
    ],
  };
  sessionStorage.setItem('interactionData', JSON.stringify(interactionData));
};
