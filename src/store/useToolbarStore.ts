import { create } from 'zustand';

export type ToolbarType = 'default' | 'text' | 'group' | 'image';

type ToolbarState = {
  toolbarType: ToolbarType;
  setToolbar: (type: ToolbarType) => void;
  resetToolbar: () => void;
};

const useToolbarStore = create<ToolbarState>((set) => ({
  toolbarType: 'default',

  setToolbar: (type) => set({ toolbarType: type }),

  resetToolbar: () => set({ toolbarType: 'default' }),
}));

export default useToolbarStore;
