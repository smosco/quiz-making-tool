import { Group } from 'lucide-react';
import { group } from '../../utils/fabricUtils';

function GroupButton() {
  const handleGroup = () => {
    group();
  };

  return (
    <button type='button' onClick={handleGroup}>
      <Group size={32} />
    </button>
  );
}

export default GroupButton;
