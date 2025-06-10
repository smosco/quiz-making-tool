'use client';

import { Settings } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import {
  useEditorMode,
  useEditorStore,
  useOptions,
} from '../../store/useEditorStore';
import OptionItem from './OptionItem';
import OptionPlusButton from './OptionPlusButton';

export default function OptionPanel() {
  // 선택적 구독 - 필요한 상태만 구독
  const options = useOptions();
  const mode = useEditorMode();

  // useShallow로 액션들만 선택적으로 가져오기
  const { toggleAnswer, removeOption, setMode } = useEditorStore(
    useShallow((state) => ({
      toggleAnswer: state.toggleAnswer,
      removeOption: state.removeOption,
      setMode: state.setMode,
    })),
  );

  return (
    <div className='h-full flex flex-col'>
      {/* 헤더 */}
      <div className='p-6 border-b border-gray-200'>
        <div className='flex items-center gap-2 mb-4'>
          <Settings className='w-5 h-5 text-gray-600' />
          <h2 className='text-lg font-semibold text-gray-900'>문제 설정</h2>
        </div>

        {/* 모드 선택 */}
        <div>
          {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            선택 방식
          </label>
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

      {/* 선택지 리스트 */}
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
                <OptionItem
                  key={opt.id}
                  option={opt}
                  index={index}
                  onToggleAnswer={toggleAnswer}
                  onRemove={removeOption}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
