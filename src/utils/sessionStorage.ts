import type { Canvas } from 'fabric';
import { useEditorStore } from '../store/editorStore';

const STORAGE_KEY = 'editorData';

interface StoredData {
  elements: {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    objects: any[];
    background: string;
  };
  interaction: {
    type: string;
    interactionType: string;
    choices: {
      mode: 'unit' | 'multi';
      options: string[];
      answer: string[];
      sounds: Record<string, unknown>;
    }[];
  };
}

export const saveEditorState = (canvas: Canvas) => {
  // TODO: json에 jeiId, jeiRole이 저장 안됨
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const json = (canvas as any).toJSON(['jeiId', 'jeiRole']);
  const { options, mode } = useEditorStore.getState();

  const optionIds = options.map((o) => o.id);
  const answerIds = options.filter((o) => o.isAnswer).map((o) => o.id);

  const dataToSave = {
    elements: {
      objects: json.objects,
      background: json.background || 'white',
    },
    interaction: {
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
    },
  };

  console.log('dataToSave', dataToSave);

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
};

export const loadEditorState = (): StoredData | null => {
  const json = sessionStorage.getItem(STORAGE_KEY);
  return json ? (JSON.parse(json) as StoredData) : null;
};
