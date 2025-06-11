import { util, ActiveSelection, Point } from 'fabric';
import type { FabricObject } from 'fabric';
import { useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getCanvasInstance } from '../components/Canvas/EditorCanvas';
import { useEditorStore } from '../store/useEditorStore';
import type { KeyboardCommand } from '../types/keyboard';
import { group, ungroup } from '../utils/fabricUtils';
import { saveEditorState } from '../utils/sessionStorage';
import { useKeyboardShortcuts } from './useKeyboardShotcuts';

export const useEditorKeyboardShortcuts = () => {
  const { removeOptionsByIds } = useEditorStore();

  // 클립보드 ref 추가
  const clipboardRef = useRef<FabricObject | null>(null);

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

    // 객체를 클론하여 클립보드에 저장
    activeObject.clone().then((cloned: FabricObject) => {
      clipboardRef.current = cloned;
      console.log('Object copied to clipboard');
    });
  }, []);

  // 붙여넣기 핸들러
  const handlePaste = useCallback(() => {
    const canvas = getCanvasInstance();
    if (!canvas || !clipboardRef.current) return;

    // 클립보드의 객체를 다시 클론
    clipboardRef.current.clone().then((cloned: FabricObject) => {
      // 그룹 객체나 ActiveSelection 처리
      if (cloned.type === 'activeselection') {
        // ActiveSelection의 객체들을 개별적으로 처리
        // @ts-ignore
        const objects = cloned.getObjects();
        const clonedObjects: FabricObject[] = [];

        // 모든 객체를 비동기적으로 클론
        Promise.all(
          objects.map(
            (obj: FabricObject) =>
              new Promise<FabricObject>((resolve) => {
                obj.clone().then((clonedObj: FabricObject) => {
                  // ActiveSelection에서 각 객체의 절대 위치를 계산
                  // ActiveSelection의 변환 행렬을 사용하여 올바른 절대 좌표 계산
                  const matrix = cloned.calcTransformMatrix();
                  const point = util.transformPoint(
                    new Point(clonedObj.left || 0, clonedObj.top || 0),
                    matrix,
                  );

                  clonedObj.set({
                    left: point.x + 10, // 붙여넣을 때 위치를 약간 오프셋
                    top: point.y + 10,
                    evented: true,
                    jeiId: uuidv4(),
                    // 클론시 jeiRole이 choicebox인 경우만 유지, choice 또는 없던 경우는 속성 제거
                    jeiRole:
                      clonedObj.jeiRole === 'choicebox'
                        ? 'choicebox'
                        : undefined,
                  });

                  resolve(clonedObj);
                });
              }),
          ),
        ).then((resolvedObjects) => {
          // 모든 객체를 캔버스에 추가
          resolvedObjects.forEach((obj: FabricObject) => {
            canvas.add(obj);
            clonedObjects.push(obj);
          });

          // 새로 붙여넣은 모든 객체를 선택
          if (clonedObjects.length > 1) {
            const activeSelection = new ActiveSelection(clonedObjects, {
              canvas: canvas,
            });
            canvas.setActiveObject(activeSelection);
          } else if (clonedObjects.length === 1) {
            canvas.setActiveObject(clonedObjects[0]);
          }

          canvas.requestRenderAll();
        });
      } else {
        // 붙여넣을 때 위치를 약간 오프셋
        cloned.set({
          left: (cloned.left || 0) + 10,
          top: (cloned.top || 0) + 10,
          evented: true,
          jeiId: uuidv4(),
          // 클론시 jeiRole이 choicebox인 경우만 유지, choice 또는 없던 경우는 속성 제거
          jeiRole: cloned.jeiRole === 'choicebox' ? 'choicebox' : undefined,
        });

        // 일반 객체 추가
        canvas.add(cloned);

        // 새로 붙여넣은 객체를 선택
        canvas.setActiveObject(cloned);
        canvas.requestRenderAll();
      }
    });
  }, []);

  const handleSave = useCallback(() => {
    const canvas = getCanvasInstance();
    saveEditorState(canvas);
    alert('저장 완료');
  }, []);

  // 클립보드에 데이터가 있는지 확인하는 조건 함수 추가
  const hasClipboard = useCallback(() => {
    return clipboardRef.current !== null;
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
      condition: hasClipboard, // 클립보드에 데이터가 있을 때만 실행
    },
    {
      id: 'save',
      shortcut: {
        key: 's',
        metaKey: true,
        description: 'Save Editor State',
        handler: handleSave,
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

  return {
    commands,
    // 클립보드 상태를 외부에서 확인할 수 있도록 반환
    hasClipboard: hasClipboard(),
    // 수동으로 복사/붙여넣기를 호출할 수 있도록 함수들도 반환
    handleCopy,
    handlePaste,
  };
};
