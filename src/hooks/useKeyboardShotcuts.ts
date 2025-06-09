import { useCallback, useEffect } from 'react';
import type { KeyboardCommand } from '../types/keyboard';
import { getModifierKey } from '../utils/keyboardUtils';

export const useKeyboardShortcuts = (commands: KeyboardCommand[]) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // 입력 필드에서는 단축키 비활성화
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        (event.target as HTMLElement)?.contentEditable === 'true'
      ) {
        return;
      }

      const matchingCommand = commands.find((command) => {
        const { shortcut } = command;
        const modifierKey = getModifierKey();

        // 키 매칭
        if (event.key.toLowerCase() !== shortcut.key.toLowerCase()) {
          return false;
        }

        // 모디파이어 키 매칭
        const expectedModifier = shortcut.metaKey || shortcut.ctrlKey;
        if (expectedModifier && !event[modifierKey]) {
          return false;
        }

        if (shortcut.shiftKey && !event.shiftKey) {
          return false;
        }

        if (shortcut.altKey && !event.altKey) {
          return false;
        }

        // 실행 조건 확인
        if (command.condition && !command.condition()) {
          return false;
        }

        return true;
      });

      if (matchingCommand) {
        if (matchingCommand.shortcut.preventDefault !== false) {
          event.preventDefault();
          event.stopPropagation();
        }
        matchingCommand.shortcut.handler();
      }
    },
    [commands],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
};
