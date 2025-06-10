import { Check, Trash2 } from 'lucide-react';

interface OptionItemProps {
  option: { id: string; isAnswer: boolean; imageDataUrl: string };
  index: number;
  onToggleAnswer: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function OptionItem({
  option,
  index,
  onToggleAnswer,
  onRemove,
}: OptionItemProps) {
  return (
    <div className='bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors'>
      <div className='flex items-start gap-3'>
        {/* 선택지 이미지 */}
        <img
          src={option.imageDataUrl || '/placeholder.svg?height=64&width=64'}
          alt={`옵션 ${index + 1}`}
          className='w-16 h-16 object-contain'
        />

        {/* 선택지 콘텐츠 */}
        <div className='flex-1 min-w-0'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-sm font-medium text-gray-900 truncate'>
              선택지 {index + 1}
            </span>
            <button
              type='button'
              onClick={() => onRemove(option.id)}
              className='p-1 text-gray-400 hover:text-red-500 transition-colors'
            >
              <Trash2 className='w-4 h-4' />
            </button>
          </div>

          {/* 정답 여부 설정 */}
          <label className='flex items-center gap-2 cursor-pointer'>
            <input
              type='checkbox'
              checked={option.isAnswer}
              onChange={() => onToggleAnswer(option.id)}
              className='sr-only'
            />
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                option.isAnswer
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Check className='w-3 h-3' />
              {option.isAnswer ? '정답' : '정답 설정'}
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
