import { Type } from 'lucide-react';
import { addTextboxToCanvas } from '../../utils/fabricUtils';

function TextButton() {
  const handleAddText = () => {
    addTextboxToCanvas();
  };

  return (
    <button type='button' onClick={handleAddText}>
      <Type size={32} />
    </button>
  );
}

export default TextButton;
