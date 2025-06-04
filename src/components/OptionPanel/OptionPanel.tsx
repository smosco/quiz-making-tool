import { useEditorStore } from '../../store/editorStore';
import OptionPlusButton from './OptionPlusButton';

export default function OptionPanel() {
  const { options, toggleAnswer, removeOption, mode, setMode } =
    useEditorStore();

  console.log(options);

  return (
    <div className='flex flex-col w-200 bg-gray-200 p-4 overflow-x-auto'>
      <div className='mb-3'>
        {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
        <label className='font-semibold mr-2'>선택 방식:</label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as 'unit' | 'multi')}
          className='border rounded px-2 py-1'
        >
          <option value='unit'>단일 선택</option>
          <option value='multi'>다중 선택</option>
        </select>
      </div>

      <div className='flex gap-4'>
        <OptionPlusButton />
        {options.map((opt) => (
          <div
            key={opt.id}
            className='flex flex-col h-60 p-4 rounded-xl bg-white'
          >
            <img
              src={opt.imageDataUrl || '/fallback.png'}
              alt={`옵션 이미지 - ${opt.id}`}
              className='w-24 h-24 object-contain border rounded mb-2 bg-white'
            />
            <span className='truncate'>{opt.id}</span>
            <div className='flex items-center gap-2'>
              <input
                type='checkbox'
                checked={opt.isAnswer}
                onChange={() => toggleAnswer(opt.id)}
              />
              <button
                type='button'
                onClick={() => removeOption(opt.id)}
                className='text-red-500 text-sm'
              >
                삭제
              </button>
            </div>
          </div>
        ))}
        {options.length === 0 && (
          <div className='text-gray-400 text-sm'>추가된 옵션이 없습니다.</div>
        )}
      </div>
    </div>
  );
}
