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

  const alignmentButtons = [
    // 수직 정렬
    {
      id: 'left',
      icon: AlignStartVertical,
      onClick: () => align('left'),
      title: '왼쪽 정렬',
    },
    {
      id: 'center',
      icon: AlignCenterVertical,
      onClick: () => align('center'),
      title: '가운데 정렬',
    },
    {
      id: 'right',
      icon: AlignEndVertical,
      onClick: () => align('right'),
      title: '오른쪽 정렬',
    },

    // 수평 정렬
    {
      id: 'top',
      icon: AlignStartHorizontal,
      onClick: () => align('top'),
      title: '위쪽 정렬',
    },
    {
      id: 'middle',
      icon: AlignCenterHorizontal,
      onClick: () => align('middle'),
      title: '중간 정렬',
    },
    {
      id: 'bottom',
      icon: AlignEndHorizontal,
      onClick: () => align('bottom'),
      title: '아래쪽 정렬',
    },
  ];

  return (
    <>
      {alignmentButtons.map((button) => (
        <ToolbarButton
          key={button.id}
          icon={button.icon}
          onClick={button.onClick}
          title={button.title}
        />
      ))}
    </>
  );
};
