import { Save } from 'lucide-react';
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
    >
      <Save size={32} />
    </button>
  );
}
