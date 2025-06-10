import type { Canvas, FabricObject } from 'fabric';
import { debounce } from 'lodash';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { captureSingleObject } from '../utils/fabricUtils';

export interface OptionState {
  id: string;
  isAnswer: boolean;
  imageDataUrl: string;
}

interface EditorStore {
  // 상태
  mode: 'unit' | 'multi';
  selectedObjects: FabricObject[];
  options: OptionState[];

  // 액션들
  setMode: (mode: 'unit' | 'multi') => void;
  setSelectedObjects: (selected: FabricObject[]) => void;
  clearSelectedObjects: () => void;
  setOptions: (options: OptionState[]) => void;
  addOption: (option: OptionState) => void;
  toggleAnswer: (id: string) => void;
  removeOption: (id: string) => void;
  removeOptionsByIds: (ids: string[]) => void;
  updateOptionImage: (
    optionId: string,
    fabricObject: FabricObject,
    canvas: Canvas,
  ) => void;
  clearOptions: () => void;
}

// 비즈니스 로직 분리
const createUpdatedOptions = (
  options: OptionState[],
  mode: 'unit' | 'multi',
  targetId: string,
): OptionState[] => {
  return options.map((opt) =>
    opt.id === targetId
      ? { ...opt, isAnswer: mode === 'unit' ? true : !opt.isAnswer }
      : mode === 'unit'
        ? { ...opt, isAnswer: false }
        : opt,
  );
};

export const useEditorStore = create<EditorStore>()(
  devtools(
    (set, get) => {
      // 디바운스된 이미지 업데이트 함수
      const debouncedImageUpdate = debounce(
        async (
          optionId: string,
          fabricObject: FabricObject,
          canvas: Canvas,
        ) => {
          try {
            const newImageDataUrl = captureSingleObject(canvas, fabricObject);
            const { options } = get();

            set({
              options: options.map((option) =>
                option.id === optionId
                  ? { ...option, imageDataUrl: newImageDataUrl }
                  : option,
              ),
            });
          } catch (error) {
            console.error('Failed to update option image:', error);
          }
        },
        10,
      );

      return {
        // 초기 상태
        mode: 'unit',
        selectedObjects: [],
        options: [],

        // 액션들
        setMode: (mode) => set({ mode }),

        setSelectedObjects: (selected) => set({ selectedObjects: selected }),

        clearSelectedObjects: () => set({ selectedObjects: [] }),

        setOptions: (options) => set({ options }),

        addOption: (option) =>
          set((state) => ({
            options: [...state.options, option],
          })),

        toggleAnswer: (id) => {
          const { options, mode } = get();
          set({ options: createUpdatedOptions(options, mode, id) });
        },

        removeOption: (id) =>
          set((state) => ({
            options: state.options.filter((o) => o.id !== id),
          })),

        removeOptionsByIds: (ids) =>
          set((state) => ({
            options: state.options.filter((o) => !ids.includes(o.id)),
          })),

        clearOptions: () => set({ options: [] }),

        updateOptionImage: (optionId, fabricObject, canvas) => {
          debouncedImageUpdate(optionId, fabricObject, canvas);
        },
      };
    },
    {
      name: 'editor-store',
    },
  ),
);

// 선택적 구독을 위한 셀렉터들
export const useEditorMode = () => useEditorStore((state) => state.mode);

export const useSelectedObjects = () =>
  useEditorStore((state) => state.selectedObjects);

export const useOptions = () => useEditorStore((state) => state.options);

export const useModeAndOptions = () =>
  useEditorStore((state) => ({
    mode: state.mode,
    options: state.options,
  }));

// 컴포넌트 외부에서 스토어 접근
export const getEditorState = () => useEditorStore.getState();

// 특정 옵션 셀렉터
export const useOptionById = (id: string) =>
  useEditorStore((state) => state.options.find((option) => option.id === id));

// 답안 옵션들만 가져오기
export const useAnswerOptions = () =>
  useEditorStore((state) => state.options.filter((option) => option.isAnswer));
