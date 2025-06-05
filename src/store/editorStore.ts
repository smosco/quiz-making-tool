import type { FabricObject } from 'fabric';
import { create } from 'zustand';

export interface OptionState {
  id: string;
  isAnswer: boolean;
  imageDataUrl: string;
}

interface EditorStore {
  mode: 'unit' | 'multi';
  setMode: (mode: 'unit' | 'multi') => void;

  selectedObjects: FabricObject[];
  setSelectedObjects: (selected: FabricObject[]) => void;

  options: OptionState[];
  setOptions: (options: OptionState[]) => void;
  toggleAnswer: (id: string) => void;
  removeOption: (id: string) => void;
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  mode: 'unit',
  setMode: (mode) => set({ mode }),

  selectedObjects: [],
  setSelectedObjects: (selected) => set({ selectedObjects: selected }),

  options: [],
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
  removeOption: (id) =>
    set({ options: get().options.filter((o) => o.id !== id) }),
}));
