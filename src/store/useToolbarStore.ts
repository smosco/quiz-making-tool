import { create } from 'zustand';

type ToolbarState = {
  showTextToolbar: boolean;
  showGroupToolbar: boolean;
  setTextToolbar: (show: boolean) => void;
  setGroupToolbar: (show: boolean) => void;
  resetToolbar: () => void;
};

const useToolbarStore = create<ToolbarState>((set) => ({
  showTextToolbar: false,
  showGroupToolbar: false,
  setTextToolbar: (show) =>
    set({ showTextToolbar: show, showGroupToolbar: false }),
  setGroupToolbar: (show) =>
    set({ showGroupToolbar: show, showTextToolbar: false }),
  resetToolbar: () => set({ showTextToolbar: false, showGroupToolbar: false }),
}));

export default useToolbarStore;
