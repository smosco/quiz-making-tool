import type { Canvas } from 'fabric';
import { debounce } from 'lodash';
import { useCallback, useEffect, useRef } from 'react';
import { saveEditorState } from '../utils/sessionStorage';

type FabricCanvasEvent =
  | 'object:added'
  | 'object:removed'
  | 'object:modified'
  | 'text:changed';

export const useAutosave = (canvas: Canvas | null, delay = 3000) => {
  const isInitializedRef = useRef(false);
  const hasChangesRef = useRef(false);

  const performSave = useCallback(async () => {
    if (!canvas || !hasChangesRef.current) return;

    try {
      saveEditorState(canvas);
      hasChangesRef.current = false;
      console.log('자동저장 완료');
    } catch (error) {
      console.error('자동저장 실패:', error);
    }
  }, [canvas]);

  const debouncedSave = useCallback(debounce(performSave, delay), [
    performSave,
    delay,
  ]);

  /**
   * 외부에서 자동저장을 트리거할 수 있는 함수
   */
  const triggerSave = useCallback(
    (reason?: string) => {
      if (!isInitializedRef.current) {
        isInitializedRef.current = true;
        return;
      }

      hasChangesRef.current = true;
      debouncedSave();

      if (reason) {
        console.log(`자동저장 트리거: ${reason}`);
      }
    },
    [debouncedSave],
  );

  useEffect(() => {
    if (!canvas) return;

    const handleCanvasChange = () => {
      triggerSave('canvas-change');
    };

    const events: FabricCanvasEvent[] = [
      // 객체 생성/삭제
      'object:added',
      'object:removed',

      // 객체 수정
      'object:modified',

      // 콘텐츠 변경
      'text:changed',
    ];

    // 모든 이벤트에 동일한 핸들러 적용
    events.forEach((event) => {
      canvas.on(event, handleCanvasChange);
    });

    // 페이지 이탈 시 즉시 저장
    const handleBeforeUnload = () => {
      if (hasChangesRef.current) {
        debouncedSave.flush();
      }
    };

    // 탭 전환 시 저장
    const handleVisibilityChange = () => {
      if (document.hidden && hasChangesRef.current) {
        debouncedSave.flush();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      // 이벤트 정리
      events.forEach((event) => {
        canvas.off(event, handleCanvasChange);
      });

      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      debouncedSave.cancel();
    };
  }, [canvas, triggerSave]);

  return {
    save: () => debouncedSave.flush(),
    triggerSave,
    hasUnsavedChanges: hasChangesRef.current,
  };
};
