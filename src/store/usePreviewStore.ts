import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// 상태와 액션 분리
interface PreviewState {
  selectedIds: string[];
  correctIds: string[];
  mode: 'unit' | 'multi';
  submitted: boolean;
  retryCount: number;
}

interface PreviewActions {
  select: (id: string) => void;
  submit: () => void;
  retry: () => void;
  init: (mode: 'unit' | 'multi', correctIds: string[]) => void;
  reset: () => void;
  getIsCorrect: () => boolean;
  canRetry: () => boolean;
}

type PreviewStore = PreviewState & PreviewActions;

// 비즈니스 로직 분리
const handleUnitSelection = (selectedIds: string[], id: string): string[] => {
  return [id];
};

const handleMultiSelection = (selectedIds: string[], id: string): string[] => {
  return selectedIds.includes(id)
    ? selectedIds.filter((i) => i !== id)
    : [...selectedIds, id];
};

const checkAnswer = (selectedIds: string[], correctIds: string[]): boolean => {
  if (selectedIds.length !== correctIds.length) return false;
  return selectedIds.every((id) => correctIds.includes(id));
};

// 상수 정의
const MAX_RETRY_COUNT = 3;

export const usePreviewStore = create<PreviewStore>()(
  devtools(
    (set, get) => ({
      // 초기 상태
      selectedIds: [],
      correctIds: [],
      mode: 'unit',
      submitted: false,
      retryCount: 0,

      // 선택지 선택 처리 (단일/다중 모드 지원)
      select: (id) => {
        const { selectedIds, mode, submitted } = get();
        if (submitted) return;

        const newSelectedIds =
          mode === 'unit'
            ? handleUnitSelection(selectedIds, id)
            : handleMultiSelection(selectedIds, id);

        set({ selectedIds: newSelectedIds });
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
        const { retryCount } = get();
        if (retryCount >= MAX_RETRY_COUNT) return;

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

      // 완전 초기화
      reset: () => {
        set({
          selectedIds: [],
          correctIds: [],
          mode: 'unit',
          submitted: false,
          retryCount: 0,
        });
      },

      // 정답 여부 확인
      getIsCorrect: () => {
        const { selectedIds, correctIds } = get();
        return checkAnswer(selectedIds, correctIds);
      },

      // 재시도 가능 여부 확인
      canRetry: () => {
        const { retryCount } = get();
        return retryCount < MAX_RETRY_COUNT;
      },
    }),
    {
      name: 'preview-store',
    },
  ),
);

// 선택적 구독을 위한 셀렉터들
export const useSelectedIds = () =>
  usePreviewStore((state) => state.selectedIds);

export const useCorrectIds = () => usePreviewStore((state) => state.correctIds);

export const usePreviewMode = () => usePreviewStore((state) => state.mode);

export const useSubmitted = () => usePreviewStore((state) => state.submitted);

export const useRetryCount = () => usePreviewStore((state) => state.retryCount);
