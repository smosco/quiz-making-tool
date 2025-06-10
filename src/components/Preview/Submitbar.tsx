'use client';

import { AlertCircle, CheckCircle, RotateCcw } from 'lucide-react';
import {
  usePreviewMode,
  usePreviewStore,
  useRetryCount,
  useSelectedIds,
  useSubmitted,
} from '../../store/usePreviewStore';

function SubmitBar() {
  // 선택적 구독 - 필요한 상태만 개별적으로 구독
  const selectedIds = useSelectedIds();
  const submitted = useSubmitted();
  const retryCount = useRetryCount();
  const mode = usePreviewMode();

  const canSubmit =
    !submitted &&
    retryCount < 3 &&
    (mode === 'unit' ? selectedIds.length === 1 : selectedIds.length > 0);

  const canRetry = submitted && retryCount < 3;

  // 액션은 필요할 때 getState()로 가져오기
  const handleSubmit = () => {
    usePreviewStore.getState().submit();
  };

  const handleRetry = () => {
    usePreviewStore.getState().retry();
  };

  return (
    <div className='flex flex-col items-center gap-4 p-5'>
      {/* 액션 버튼들 */}
      <div className='flex gap-3'>
        <button
          type='button'
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            canSubmit
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-105'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          <CheckCircle className='w-5 h-5' />
          채점하기
        </button>

        <button
          type='button'
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            canRetry
              ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md hover:shadow-lg transform hover:scale-105'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          disabled={!canRetry}
          onClick={handleRetry}
        >
          <RotateCcw className='w-5 h-5' />
          다시풀기 ({3 - retryCount}회 남음)
        </button>
      </div>
      {/* 재시도 횟수 표시 */}
      {retryCount > 0 && (
        <div className='text-xs text-gray-500'>시도 횟수: {retryCount}/3</div>
      )}
    </div>
  );
}

export default SubmitBar;
