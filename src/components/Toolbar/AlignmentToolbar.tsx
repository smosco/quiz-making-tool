// components/AlignmentToolbar.tsx
import {
  AlignCenterHorizontal,
  AlignCenterVertical,
  AlignEndHorizontal,
  AlignEndVertical,
  AlignStartHorizontal,
  AlignStartVertical,
} from 'lucide-react';
import { type AlignType, alignObjects } from '../../utils/alignmentUtils';
import { getCanvasInstance } from '../Canvas/EditorCanvas';
import ToolbarButton from './ToolbarButton';

export const AlignmentToolbar = () => {
  const canvas = getCanvasInstance();

  const align = (type: AlignType) => {
    if (canvas) alignObjects(canvas, type);
  };

  return (
    <div className='flex items-center gap-1 p-1 bg-gray-100 rounded-lg'>
      <ToolbarButton
        icon={AlignStartVertical}
        onClick={() => align('left')}
        title='왼쪽 정렬'
      />
      <ToolbarButton
        icon={AlignCenterVertical}
        onClick={() => align('center')}
        title='가운데 정렬'
      />
      <ToolbarButton
        icon={AlignEndVertical}
        onClick={() => align('right')}
        title='오른쪽 정렬'
      />

      <div className='w-px bg-gray-200 mx-1 my-1' />

      <ToolbarButton
        icon={AlignStartHorizontal}
        onClick={() => align('top')}
        title='위쪽 정렬'
      />
      <ToolbarButton
        icon={AlignCenterHorizontal}
        onClick={() => align('middle')}
        title='중간 정렬'
      />
      <ToolbarButton
        icon={AlignEndHorizontal}
        onClick={() => align('bottom')}
        title='아래쪽 정렬'
      />
    </div>
  );
};
