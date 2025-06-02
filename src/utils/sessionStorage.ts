import type { Canvas } from 'fabric';

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
  // TODO: Canvas 클래스를 확장해서 직접 타입 오버라이드
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const json = (canvas as any).toJSON(['jeiId', 'jeiRole']);
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const allChoiceIds = (json.objects as any[])
    .filter((obj) => obj.jeiRole === 'choice')
    .map((obj) => obj.jeiId);

  const dataToSave: StoredData = {
    elements: {
      objects: json.objects || [],
      background: json.background || 'white',
    },
    interaction: {
      type: 'choice',
      interactionType: 'choice',
      choices: [
        {
          mode: 'unit', // 기본값 (이후 zustand 상태로 교체 가능)
          options: allChoiceIds,
          answer: [],
          sounds: {},
        },
      ],
    },
  };

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
};

export const loadEditorState = (): StoredData | null => {
  const json = sessionStorage.getItem(STORAGE_KEY);
  return json ? (JSON.parse(json) as StoredData) : null;
};
