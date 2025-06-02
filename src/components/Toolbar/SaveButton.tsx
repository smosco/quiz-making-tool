import { saveEditorState } from '../../utils/sessionStorage';
import { getCanvasInstance } from '../Canvas/EditorCanvas';

export default function SaveButton() {
  return (
    <button
      type='button'
      onClick={() => {
        const canvas = getCanvasInstance();
        saveEditorState(canvas);
        alert('저장 완료');
      }}
      className='px-3 py-1 bg-blue-500 text-white rounded'
    >
      저장
    </button>
  );
}
