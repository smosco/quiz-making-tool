import { create } from 'zustand';
import { getEditorState } from './useEditorStore';

export type ToolbarType = 'default' | 'text' | 'group' | 'image';

type ToolbarState = {
  toolbarType: ToolbarType;
  setToolbar: (type: ToolbarType) => void;
  resetToolbar: () => void;

  // 정렬 툴바 표시 여부를 계산하는 함수
  shouldShowAlignmentToolbar: () => boolean;
};

const useToolbarStore = create<ToolbarState>((set, get) => ({
  toolbarType: 'default',

  setToolbar: (type) => set({ toolbarType: type }),

  resetToolbar: () => set({ toolbarType: 'default' }),

  // 정렬 툴바 표시 조건 계산
  shouldShowAlignmentToolbar: () => {
    const { toolbarType } = get();
    const { selectedObjects } = getEditorState();

    return toolbarType === 'group' || selectedObjects.length >= 2;
  },
}));

export default useToolbarStore;
