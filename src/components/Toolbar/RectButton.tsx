import { Square } from 'lucide-react';
import { addRectToCanvas } from '../../utils/fabricUtils';

function RectButton() {
  const handleAddRect = () => {
    addRectToCanvas();
  };

  return (
    <button type='button' onClick={handleAddRect}>
      <Square size={32} />
    </button>
  );
}

export default RectButton;
