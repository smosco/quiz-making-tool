import { usePreviewStore } from '../../store/usePreviewStore';

function SubmitBar() {
  const { selectedIds, submitted, retryCount, mode, submit, retry } =
    usePreviewStore();

  // 채점 가능 조건: 단일은 하나 선택, 다중은 하나 이상 선택
  const canSubmit =
    !submitted &&
    retryCount < 3 &&
    (mode === 'unit' ? selectedIds.length === 1 : selectedIds.length > 0);

  const canRetry = submitted && retryCount < 3;

  return (
    <div className='flex gap-4 mt-6 justify-center'>
      <button
        type='button'
        className='px-6 py-3 bg-blue-600 text-white rounded disabled:opacity-30'
        disabled={!canSubmit}
        onClick={submit}
      >
        채점하기
      </button>
      <button
        type='button'
        className='px-6 py-3 bg-amber-500 text-white rounded disabled:opacity-30'
        disabled={!canRetry}
        onClick={retry}
      >
        다시풀기 ({3 - retryCount}회 남음)
      </button>
    </div>
  );
}

export default SubmitBar;
