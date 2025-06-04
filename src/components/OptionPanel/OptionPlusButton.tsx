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
      className={hasSelection ? 'text-2xl bg-blue-500' : 'text-2xl bg-gray-300'}
    >
      +
    </button>
  );
}

export default OptionPlusButton;
