import type React from 'react';

interface DefaultToolbarProps {
  onAddText: () => void;
  onAddRect: () => void;
  onAddCircle: () => void;
  onAddImage: () => void;
}

const DefaultToolbar: React.FC<DefaultToolbarProps> = ({
  onAddText,
  onAddRect,
  onAddCircle,
  onAddImage,
}) => {
  return (
    <div className='flex items-center gap-2 p-2 bg-white shadow-sm border-b'>
      <button type='button' onClick={onAddText}>
        T
      </button>
      <button type='button' onClick={onAddRect}>
        □
      </button>
      <button type='button' onClick={onAddCircle}>
        ◯
      </button>
      <button type='button' onClick={onAddImage}>
        🖼
      </button>
    </div>
  );
};

export default DefaultToolbar;
