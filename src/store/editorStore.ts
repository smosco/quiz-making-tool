import type { Canvas, FabricObject } from 'fabric';
import { debounce } from 'lodash';
import { create } from 'zustand';
import { captureSingleObject } from '../utils/fabricUtils';

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
  removeOptionsByIds: (ids: string[]) => void;

  updateOptionImage: (
    optionId: string,
    fabricObject: FabricObject,
    canvas: Canvas,
  ) => void;
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
  removeOptionsByIds: (ids) =>
    set({ options: get().options.filter((o) => !ids.includes(o.id)) }),

  // TODO(@한현): 디바운스 걸지 말지 판단
  updateOptionImage: debounce(async (optionId, fabricObject, canvas) => {
    const { options } = get();
    const optionIndex = options.findIndex((option) => option.id === optionId);

    if (optionIndex === -1) return;

    try {
      const newImageDataUrl = captureSingleObject(canvas, fabricObject);

      set((state) => ({
        options: state.options.map((option, index) =>
          index === optionIndex
            ? { ...option, imageDataUrl: newImageDataUrl }
            : option,
        ),
      }));
    } catch (error) {
      console.error('Failed to update option image:', error);
    }
  }, 10),
}));
