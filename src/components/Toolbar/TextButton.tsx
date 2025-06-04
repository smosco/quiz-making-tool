import { Type } from 'lucide-react';
import { addTextToCanvas } from '../../utils/fabricUtils';

function TextButton() {
  const handleAddText = () => {
    addTextToCanvas();
  };

  return (
    <button type='button' onClick={handleAddText}>
      <Type size={32} />
    </button>
  );
}

export default TextButton;
