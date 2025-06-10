'use client';

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Minus,
  Plus,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCanvasInstance } from '../Canvas/EditorCanvas';
import ToolbarButton from './ToolbarButton';

function TextToolbar() {
  const [fontSize, setFontSize] = useState(22);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>(
    'left',
  );

  const fontOptions = [
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Georgia',
    'Verdana',
    'Tahoma',
    'Trebuchet MS',
    'Impact',
    'Comic Sans MS',
  ];

  // 선택된 텍스트의 속성을 가져와서 UI에 반영
  useEffect(() => {
    const canvas = getCanvasInstance();
    const activeObject = canvas?.getActiveObject();

    if (activeObject && activeObject.type === 'textbox') {
      // setFontSize(activeObject.fontSize || 22)
      // setFontFamily(activeObject.fontFamily || "Arial")
      // setIsBold(activeObject.fontWeight === "bold")
      // setIsItalic(activeObject.fontStyle === "italic")
      // setAlignment((activeObject.textAlign as "left" | "center" | "right") || "left")
    }
  }, []);

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const updateTextProperty = (property: string, value: any) => {
    const canvas = getCanvasInstance();
    const activeObject = canvas?.getActiveObject();

    if (activeObject && activeObject.type === 'textbox') {
      activeObject.set(property, value);
      canvas.requestRenderAll();
    }
  };

  const handleFontSizeChange = (delta: number) => {
    const newSize = Math.max(8, Math.min(72, fontSize + delta));
    setFontSize(newSize);
    updateTextProperty('fontSize', newSize);
  };

  const handleBoldToggle = () => {
    const newBold = !isBold;
    setIsBold(newBold);
    updateTextProperty('fontWeight', newBold ? 'bold' : 'normal');
  };

  const handleItalicToggle = () => {
    const newItalic = !isItalic;
    setIsItalic(newItalic);
    updateTextProperty('fontStyle', newItalic ? 'italic' : 'normal');
  };

  const handleAlignmentChange = (newAlignment: 'left' | 'center' | 'right') => {
    setAlignment(newAlignment);
    updateTextProperty('textAlign', newAlignment);
  };

  const handleFontFamilyChange = (newFont: string) => {
    setFontFamily(newFont);
    updateTextProperty('fontFamily', newFont);
  };

  return (
    <div className='flex items-center gap-1 p-1'>
      {/* Font Family Selector */}
      <div className='relative'>
        <select
          value={fontFamily}
          onChange={(e) => handleFontFamilyChange(e.target.value)}
          className='appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
        >
          {fontOptions.map((font) => (
            <option key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </option>
          ))}
        </select>
        <div className='absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none'>
          {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
          <svg
            className='w-4 h-4 text-gray-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M19 9l-7 7-7-7'
            />
          </svg>
        </div>
      </div>

      <div className='w-px h-6 bg-gray-300 mx-1' />

      {/* 텍스트 스타일 */}
      <ToolbarButton
        icon={Bold}
        onClick={handleBoldToggle}
        active={isBold}
        title='굵게'
      />
      <ToolbarButton
        icon={Italic}
        onClick={handleItalicToggle}
        active={isItalic}
        title='기울임'
      />

      <div className='w-px h-6 bg-gray-300 mx-1' />

      {/* 텍스트 정렬 */}
      <ToolbarButton
        icon={AlignLeft}
        onClick={() => handleAlignmentChange('left')}
        active={alignment === 'left'}
        title='왼쪽 정렬'
      />
      <ToolbarButton
        icon={AlignCenter}
        onClick={() => handleAlignmentChange('center')}
        active={alignment === 'center'}
        title='가운데 정렬'
      />
      <ToolbarButton
        icon={AlignRight}
        onClick={() => handleAlignmentChange('right')}
        active={alignment === 'right'}
        title='오른쪽 정렬'
      />

      <div className='w-px h-6 bg-gray-300 mx-1' />

      {/* 폰트 사이즈 */}
      <div className='flex items-center bg-white border border-gray-300 rounded-md'>
        <ToolbarButton
          icon={Minus}
          onClick={() => handleFontSizeChange(-1)}
          title='폰트 크기 줄이기'
          className='w-8 h-8 hover:bg-gray-50'
        />

        <div className='px-3 py-2 text-sm font-medium text-gray-700 min-w-[3rem] text-center border-x border-gray-300'>
          {fontSize}
        </div>

        <ToolbarButton
          icon={Plus}
          onClick={() => handleFontSizeChange(1)}
          title='폰트 크기 늘리기'
          className='w-8 h-8 hover:bg-gray-50'
        />
      </div>
    </div>
  );
}

export default TextToolbar;
