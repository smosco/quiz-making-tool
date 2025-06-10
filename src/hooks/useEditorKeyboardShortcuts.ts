import { ActiveSelection } from 'fabric';
import { useCallback } from 'react';
import { getCanvasInstance } from '../components/Canvas/EditorCanvas';
import { useEditorStore } from '../store/useEditorStore';
import type { KeyboardCommand } from '../types/keyboard';
import { group, ungroup } from '../utils/fabricUtils';
import { useKeyboardShortcuts } from './useKeyboardShotcuts';

export const useEditorKeyboardShortcuts = () => {
  const { removeOptionsByIds } = useEditorStore();

  // 삭제 핸들러
  const handleDelete = useCallback(() => {
    const canvas = getCanvasInstance();
    if (!canvas) return;

    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length === 0) return;

    const objectIds = activeObjects
      .map((obj) => obj.jeiId)
      .filter((id): id is string => id !== undefined);

    activeObjects.forEach((obj) => {
      canvas.remove(obj);
    });

    canvas.discardActiveObject();
    canvas.requestRenderAll();

    if (objectIds.length > 0) {
      removeOptionsByIds(objectIds);
    }
  }, [removeOptionsByIds]);

  // 그룹화 핸들러
  const handleGroup = useCallback(() => {
    group();
  }, []);

  // 그룹 해제 핸들러
  const handleUngroup = useCallback(() => {
    ungroup();
  }, []);

  // 복사 핸들러
  const handleCopy = useCallback(() => {
    const canvas = getCanvasInstance();
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    // TODO(@한현): 복사 로직 구현
    console.log('Copy object:', activeObject);
  }, []);

  // 붙여넣기 핸들러
  const handlePaste = useCallback(() => {
    // TODO(@한현): 붙여넣기 로직 구현
    console.log('Paste object');
  }, []);

  // 실행 조건 함수들
  const hasActiveObjects = useCallback(() => {
    const canvas = getCanvasInstance();
    return canvas?.getActiveObjects().length > 0;
  }, []);

  const hasMultipleActiveObjects = useCallback(() => {
    const canvas = getCanvasInstance();
    return canvas?.getActiveObjects().length > 1;
  }, []);

  const hasActiveGroup = useCallback(() => {
    const canvas = getCanvasInstance();
    const activeObject = canvas?.getActiveObject();
    return activeObject?.type === 'group';
  }, []);

  // 키보드 명령어 정의
  const commands: KeyboardCommand[] = [
    {
      id: 'delete',
      shortcut: {
        key: 'x',
        metaKey: true, // Mac에서는 metaKey, Windows에서는 ctrlKey로 자동 처리
        description: 'Delete selected objects',
        handler: handleDelete,
      },
      condition: hasActiveObjects,
    },
    {
      id: 'group',
      shortcut: {
        key: 'g',
        metaKey: true,
        description: 'Group selected objects',
        handler: handleGroup,
      },
      condition: hasMultipleActiveObjects,
    },
    {
      id: 'ungroup',
      shortcut: {
        key: 'g',
        metaKey: true,
        shiftKey: true,
        description: 'Ungroup selected group',
        handler: handleUngroup,
      },
      condition: hasActiveGroup,
    },
    {
      id: 'copy',
      shortcut: {
        key: 'c',
        metaKey: true,
        description: 'Copy selected objects',
        handler: handleCopy,
      },
      condition: hasActiveObjects,
    },
    {
      id: 'paste',
      shortcut: {
        key: 'v',
        metaKey: true,
        description: 'Paste objects',
        handler: handlePaste,
      },
    },
    {
      id: 'selectAll',
      shortcut: {
        key: 'a',
        metaKey: true,
        description: 'Select all objects',
        handler: () => {
          const canvas = getCanvasInstance();
          if (!canvas) return;

          const allObjects = canvas.getObjects();
          if (allObjects.length > 0) {
            canvas.setActiveObject(
              allObjects.length === 1
                ? allObjects[0]
                : new ActiveSelection(allObjects, { canvas }),
            );
            canvas.requestRenderAll();
          }
        },
      },
    },
  ];

  useKeyboardShortcuts(commands);

  return { commands };
};
