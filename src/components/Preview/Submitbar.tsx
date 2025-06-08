"use client"

import { CheckCircle, RotateCcw, AlertCircle } from "lucide-react"
import { usePreviewStore } from "../../store/usePreviewStore"

function SubmitBar() {
  const { selectedIds, submitted, retryCount, mode, submit, retry } = usePreviewStore()

  const canSubmit =
    !submitted && retryCount < 3 && (mode === "unit" ? selectedIds.length === 1 : selectedIds.length > 0)

  const canRetry = submitted && retryCount < 3

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Status Message */}
      {selectedIds.length === 0 && !submitted && (
        <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-lg border border-amber-200">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm font-medium">
            {mode === "unit" ? "선택지를 하나 선택해주세요" : "선택지를 하나 이상 선택해주세요"}
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            canSubmit
              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-105"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
          disabled={!canSubmit}
          onClick={submit}
        >
          <CheckCircle className="w-5 h-5" />
          채점하기
        </button>

        <button
          type="button"
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            canRetry
              ? "bg-amber-500 hover:bg-amber-600 text-white shadow-md hover:shadow-lg transform hover:scale-105"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
          disabled={!canRetry}
          onClick={retry}
        >
          <RotateCcw className="w-5 h-5" />
          다시풀기 ({3 - retryCount}회 남음)
        </button>
      </div>

      {/* Retry Counter */}
      {retryCount > 0 && <div className="text-xs text-gray-500">시도 횟수: {retryCount}/3</div>}
    </div>
  )
}

export default SubmitBar
