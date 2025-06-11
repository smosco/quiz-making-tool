import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Minus,
  Plus,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
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

  // 텍스트 속성 업데이트 함수
  const updateTextProperty = useCallback(
    (property: string, value: string | number) => {
      const canvas = getCanvasInstance();
      const activeObject = canvas?.getActiveObject();

      if (activeObject && activeObject.type === 'textbox') {
        activeObject.set(property, value);
        canvas.requestRenderAll();

        canvas.fire('object:modified');
      }
    },
    [],
  );

  // 선택된 텍스트의 현재 속성을 UI에 반영
  const syncTextProperties = useCallback(() => {
    const canvas = getCanvasInstance();
    const activeObject = canvas?.getActiveObject();

    if (activeObject && activeObject.type === 'textbox') {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const textObject = activeObject as any;

      setFontSize(textObject.fontSize || 40);
      setFontFamily(textObject.fontFamily || 'Times New Roman');
      setIsBold(textObject.fontWeight === 'bold');
      setIsItalic(textObject.fontStyle === 'italic');
      setAlignment(
        (textObject.textAlign as 'left' | 'center' | 'right') || 'left',
      );
    }
  }, []);

  // 텍스트 객체 선택 시 속성 동기화
  useEffect(() => {
    const canvas = getCanvasInstance();
    if (!canvas) return;

    // 선택 변경 시 속성 동기화
    const handleSelectionChange = () => {
      syncTextProperties();
    };

    canvas.on('selection:created', handleSelectionChange);
    canvas.on('selection:updated', handleSelectionChange);
    canvas.on('selection:cleared', () => {
      // 선택 해제 시 기본값으로 리셋
      setFontSize(40);
      setFontFamily('Times New Roman');
      setIsBold(false);
      setIsItalic(false);
      setAlignment('left');
    });

    // 초기 동기화
    syncTextProperties();

    return () => {
      canvas.off('selection:created', handleSelectionChange);
      canvas.off('selection:updated', handleSelectionChange);
      canvas.off('selection:cleared');
    };
  }, [syncTextProperties]);

  // 폰트 크기 변경
  const handleFontSizeChange = useCallback(
    (delta: number) => {
      const newSize = Math.max(8, Math.min(200, fontSize + delta)); // 최대 200
      setFontSize(newSize);
      updateTextProperty('fontSize', newSize);
    },
    [fontSize, updateTextProperty],
  );

  // 굵기 토글
  const handleBoldToggle = useCallback(() => {
    const newBold = !isBold;
    setIsBold(newBold);
    updateTextProperty('fontWeight', newBold ? 'bold' : 'normal');
  }, [isBold, updateTextProperty]);

  // 기울임 토글
  const handleItalicToggle = useCallback(() => {
    const newItalic = !isItalic;
    setIsItalic(newItalic);
    updateTextProperty('fontStyle', newItalic ? 'italic' : 'normal');
  }, [isItalic, updateTextProperty]);

  // 정렬 변경
  const handleAlignmentChange = useCallback(
    (newAlignment: 'left' | 'center' | 'right') => {
      setAlignment(newAlignment);
      updateTextProperty('textAlign', newAlignment);
    },
    [updateTextProperty],
  );

  // 폰트 패밀리 변경
  const handleFontFamilyChange = useCallback(
    (newFont: string) => {
      setFontFamily(newFont);
      updateTextProperty('fontFamily', newFont);
    },
    [updateTextProperty],
  );

  return (
    <div className='flex items-center gap-1 p-1'>
      {/* 폰트 패밀리 */}
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
          <svg
            className='w-4 h-4 text-gray-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            aria-hidden='true'
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
