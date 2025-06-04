import { Ungroup } from 'lucide-react';
import { ungroup } from '../../utils/fabricUtils';

function UngroupButton() {
  const handleUngroup = () => {
    ungroup();
  };

  return (
    <button type='button' onClick={handleUngroup}>
      <Ungroup size={32} />
    </button>
  );
}

export default UngroupButton;
