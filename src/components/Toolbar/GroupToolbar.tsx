import type React from 'react';

type AlignType = 'left' | 'center' | 'right';

interface GroupToolbarProps {
  onGroup: () => void;
  onUngroup: () => void;
  onAlign: (type: AlignType) => void;
}

const GroupToolbar: React.FC<GroupToolbarProps> = ({
  onGroup,
  onUngroup,
  onAlign,
}) => {
  return (
    <div className='flex items-center gap-2 p-2 bg-white shadow-sm border rounded-md absolute top-16 left-4 z-50'>
      <button type='button' onClick={onGroup}>
        Group
      </button>
      <button type='button' onClick={onUngroup}>
        Ungroup
      </button>
      <button type='button' onClick={() => onAlign('left')}>
        ⬅
      </button>
      <button type='button' onClick={() => onAlign('center')}>
        ↔
      </button>
      <button type='button' onClick={() => onAlign('right')}>
        ➡
      </button>
    </div>
  );
};

export default GroupToolbar;
