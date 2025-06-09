export interface KeyboardShortcut {
  key: string;
  metaKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  description: string;
  handler: () => void;
  preventDefault?: boolean;
}

export interface KeyboardCommand {
  id: string;
  shortcut: KeyboardShortcut;
  condition?: () => boolean; // 실행 조건
}
