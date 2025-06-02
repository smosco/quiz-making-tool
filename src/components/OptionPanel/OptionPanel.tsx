import { useEditorStore } from '../../store/editorStore';

export default function OptionPanel() {
  const { options, toggleAnswer, removeOption, mode, setMode } =
    useEditorStore();

  return (
    <div className='p-4 border rounded w-[300px]'>
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

      <div className='space-y-2'>
        {options.map((opt) => (
          <div
            key={opt.id}
            className='flex justify-between items-center border p-2 rounded'
          >
            <span className='truncate'>{opt.id}</span>
            <div className='flex items-center gap-2'>
              <input
                type={mode === 'unit' ? 'radio' : 'checkbox'}
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
