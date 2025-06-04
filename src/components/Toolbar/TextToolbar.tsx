import type React from 'react';

interface TextToolbarProps {
  fontSize: number;
  setFontSize: (size: number) => void;
  isBold: boolean;
  toggleBold: () => void;
  fontFamily?: string;
  setFontFamily: (font: string) => void;
  fontColor: string;
  setFontColor: (color: string) => void;
}

const TextToolbar: React.FC<TextToolbarProps> = ({
  fontSize,
  setFontSize,
  isBold,
  toggleBold,
  fontFamily,
  setFontFamily,
  fontColor,
  setFontColor,
}) => {
  return (
    <div className='flex items-center gap-2 p-2 bg-white shadow-sm border rounded-md absolute top-16 left-4 z-50'>
      <select
        value={fontFamily}
        onChange={(e) => setFontFamily(e.target.value)}
      >
        <option value='Pretendard'>Pretendard</option>
        <option value='GmarketSans'>Gmarket Sans</option>
      </select>
      <input
        type='color'
        value={fontColor}
        onChange={(e) => setFontColor(e.target.value)}
      />
      <button
        type='button'
        onClick={toggleBold}
        className={isBold ? 'font-bold' : ''}
      >
        B
      </button>
      <input
        type='number'
        value={fontSize}
        onChange={(e) => setFontSize(Number(e.target.value))}
        className='w-16'
      />
    </div>
  );
};

export default TextToolbar;
