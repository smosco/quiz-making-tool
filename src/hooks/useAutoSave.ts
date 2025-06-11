import type { Canvas } from 'fabric';
import { useEffect, useRef } from 'react';
import { saveEditorState } from '../utils/sessionStorage';

export const useAutosave = (canvas: Canvas | null, delay = 10000) => {
  const savedCallback = useRef<() => void>(undefined);

  // 콜백 참조를 최신으로 유지
  useEffect(() => {
    savedCallback.current = () => {
      if (canvas) {
        saveEditorState(canvas);
      }
    };
  }, [canvas]);

  // 자동저장 간격 설정
  useEffect(() => {
    if (!canvas) return;

    const interval = setInterval(() => {
      savedCallback.current?.();
    }, delay);

    return () => clearInterval(interval);
  }, [canvas, delay]);
};
