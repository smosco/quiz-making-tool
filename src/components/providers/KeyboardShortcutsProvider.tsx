import type React from 'react';
import { useEditorKeyboardShortcuts } from '../../hooks/useEditorKeyboardShortcuts';

interface KeyboardShortcutsProviderProps {
  children: React.ReactNode;
}

export const KeyboardShortcutsProvider: React.FC<
  KeyboardShortcutsProviderProps
> = ({ children }) => {
  useEditorKeyboardShortcuts();

  return <>{children}</>;
};
