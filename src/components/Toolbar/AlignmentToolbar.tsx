import {
  AlignCenterHorizontal,
  AlignCenterVertical,
  AlignEndHorizontal,
  AlignEndVertical,
  AlignStartHorizontal,
  AlignStartVertical,
} from 'lucide-react';
import { useAlignment } from '../../hooks/useAlignment';
import { getCanvasInstance } from '../Canvas/EditorCanvas';
import ToolbarButton from './ToolbarButton';

export const AlignmentToolbar = () => {
  const canvas = getCanvasInstance();
  const { align, canAlign } = useAlignment(canvas);

  return (
    <div className='flex items-center gap-1 p-1 bg-gray-100 rounded-lg'>
      {/* 수평 정렬 */}
      <ToolbarButton
        icon={AlignStartVertical}
        onClick={() => align('left')}
        title='수직 왼쪽 정렬'
      />
      <ToolbarButton
        icon={AlignCenterVertical}
        onClick={() => align('center')}
        title='수직 가운데 정렬'
      />
      <ToolbarButton
        icon={AlignEndVertical}
        onClick={() => align('right')}
        title='수직 오른쪽 정렬'
      />

      {/* 구분선 */}
      <div className='w-px bg-gray-200 mx-1 my-1' />

      {/* 수직 정렬 */}
      <ToolbarButton
        icon={AlignStartHorizontal}
        onClick={() => align('top')}
        title='수직 왼쪽 정렬'
      />
      <ToolbarButton
        icon={AlignCenterHorizontal}
        onClick={() => align('middle')}
        title='수직 가운데 정렬'
      />
      <ToolbarButton
        icon={AlignEndHorizontal}
        onClick={() => align('bottom')}
        title='수직 오른쪽 정렬'
      />
    </div>
  );
};
