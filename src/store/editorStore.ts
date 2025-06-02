import { create } from 'zustand';

interface OptionState {
  id: string;
  isAnswer: boolean;
}

interface EditorStore {
  mode: 'unit' | 'multi';
  options: OptionState[];
  setMode: (mode: 'unit' | 'multi') => void;
  setOptions: (options: OptionState[]) => void;
  toggleAnswer: (id: string) => void;
  addOption: (id: string) => void;
  removeOption: (id: string) => void;
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  mode: 'unit',
  options: [],
  setMode: (mode) => set({ mode }),
  setOptions: (options) => set({ options }),
  toggleAnswer: (id) => {
    const { options, mode } = get();
    const updated = options.map((opt) =>
      opt.id === id
        ? { ...opt, isAnswer: mode === 'unit' ? true : !opt.isAnswer }
        : mode === 'unit'
          ? { ...opt, isAnswer: false }
          : opt,
    );
    set({ options: updated });
  },
  addOption: (id) => {
    const options = get().options;
    if (!options.find((o) => o.id === id)) {
      set({ options: [...options, { id, isAnswer: false }] });
    }
  },
  removeOption: (id) => {
    const options = get().options.filter((o) => o.id !== id);
    set({ options });
  },
}));
