'use client';

import { Check, Settings, Trash2 } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import OptionPlusButton from './OptionPlusButton';

export default function OptionPanel() {
  const { options, toggleAnswer, removeOption, mode, setMode } =
    useEditorStore();

  console.log(options);

  return (
    <div className='h-full flex flex-col bg-white'>
      {/* Header */}
      <div className='p-6 border-b border-gray-200'>
        <div className='flex items-center gap-2 mb-4'>
          <Settings className='w-5 h-5 text-gray-600' />
          <h2 className='text-lg font-semibold text-gray-900'>문제 설정</h2>
        </div>

        {/* Mode Selection */}
        <div className='space-y-2'>
          {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
          <label className='text-sm font-medium text-gray-700'>선택 방식</label>
          <div className='flex gap-2'>
            <button
              type='button'
              onClick={() => setMode('unit')}
              className={`px-3 py-2 text-sm rounded-md font-medium transition-colors ${
                mode === 'unit'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              단일 선택
            </button>
            <button
              type='button'
              onClick={() => setMode('multi')}
              className={`px-3 py-2 text-sm rounded-md font-medium transition-colors ${
                mode === 'multi'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              다중 선택
            </button>
          </div>
        </div>
      </div>

      {/* Options List */}
      <div className='flex-1 p-6 overflow-y-auto'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h3 className='text-sm font-medium text-gray-700'>선택지 관리</h3>
            <OptionPlusButton />
          </div>

          {options.length === 0 ? (
            <div className='text-center py-12'>
              <div className='w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center'>
                <Settings className='w-8 h-8 text-gray-400' />
              </div>
              <p className='text-gray-500 text-sm'>
                캔버스에서 객체를 선택한 후<br />+ 버튼을 클릭하여 선택지를
                추가하세요
              </p>
            </div>
          ) : (
            <div className='space-y-3'>
              {options.map((opt, index) => (
                <div
                  key={opt.id}
                  className='bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors'
                >
                  <div className='flex items-start gap-3'>
                    {/* Option Image */}
                    <div className='w-16 h-16 bg-white rounded-md border border-gray-200 flex items-center justify-center overflow-hidden'>
                      <img
                        src={
                          opt.imageDataUrl ||
                          '/placeholder.svg?height=64&width=64'
                        }
                        alt={`옵션 ${index + 1}`}
                        className='w-full h-full object-contain'
                      />
                    </div>

                    {/* Option Content */}
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center justify-between mb-2'>
                        <span className='text-sm font-medium text-gray-900 truncate'>
                          선택지 {index + 1}
                        </span>
                        <button
                          type='button'
                          onClick={() => removeOption(opt.id)}
                          className='p-1 text-gray-400 hover:text-red-500 transition-colors'
                        >
                          <Trash2 className='w-4 h-4' />
                        </button>
                      </div>

                      {/* Answer Toggle */}
                      <label className='flex items-center gap-2 cursor-pointer'>
                        <input
                          type='checkbox'
                          checked={opt.isAnswer}
                          onChange={() => toggleAnswer(opt.id)}
                          className='sr-only'
                        />
                        <div
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                            opt.isAnswer
                              ? 'bg-green-100 text-green-700 border border-green-200'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <Check className='w-3 h-3' />
                          {opt.isAnswer ? '정답' : '정답 설정'}
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
