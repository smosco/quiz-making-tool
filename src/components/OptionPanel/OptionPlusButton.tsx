import { Plus } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import { addOptionsFromSelectedObjects } from '../../utils/optionUtils';

function OptionPlusButton() {
  const { selectedObjects } = useEditorStore();
  const hasSelection = selectedObjects.length > 0;

  return (
    <button
      type='button'
      disabled={!hasSelection}
      onClick={addOptionsFromSelectedObjects}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200 ${
        hasSelection
          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-105'
          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
      }`}
      title={
        hasSelection
          ? '선택한 객체를 선택지로 추가'
          : '캔버스에서 객체를 선택하세요'
      }
    >
      <Plus className='w-4 h-4' />
    </button>
  );
}

export default OptionPlusButton;
