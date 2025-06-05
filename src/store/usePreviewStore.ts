import { create } from 'zustand';

interface PreviewState {
  selectedIds: string[];
  correctIds: string[];
  mode: 'unit' | 'multi';
  submitted: boolean;
  retryCount: number;

  select: (id: string) => void;
  submit: () => void;
  retry: () => void;
  init: (mode: 'unit' | 'multi', correctIds: string[]) => void;
}

export const usePreviewStore = create<PreviewState>((set, get) => ({
  selectedIds: [],
  correctIds: [],
  mode: 'unit',
  submitted: false,
  retryCount: 0,

  // 선택지 선택 처리 (단일/다중 모드 지원)
  select: (id) => {
    const { selectedIds, mode, submitted } = get();
    if (submitted) return;

    if (mode === 'unit') {
      set({ selectedIds: [id] });
    } else {
      set({
        selectedIds: selectedIds.includes(id)
          ? selectedIds.filter((i) => i !== id)
          : [...selectedIds, id],
      });
    }
  },

  // 채점 처리: submitted = true, retryCount++
  submit: () => {
    const { submitted, retryCount } = get();
    if (submitted) return;

    set({
      submitted: true,
      retryCount: retryCount + 1,
    });
  },

  // 다시풀기: selected 초기화 + submitted 해제 (단, 3회 제한)
  retry: () => {
    const retryCount = get().retryCount;
    if (retryCount >= 3) return;

    set({
      selectedIds: [],
      submitted: false,
    });
  },

  // 초기 설정 (모드 및 정답 목록 지정)
  init: (mode, correctIds) => {
    set({
      mode,
      correctIds,
      selectedIds: [],
      submitted: false,
      retryCount: 0,
    });
  },
}));
