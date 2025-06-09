'use client';

import { Group, Trash2, Ungroup } from 'lucide-react';
import { group, ungroup } from '../../utils/fabricUtils';
import ToolbarButton from './ToolbarButton';

function GroupToolbar() {
  const handleGroup = () => {
    group();
  };

  const handleUngroup = () => {
    ungroup();
  };

  return (
    <div className='flex items-center gap-1 p-1 bg-gray-100 rounded-lg'>
      <ToolbarButton icon={Group} onClick={handleGroup} title='그룹 만들기' />
      <ToolbarButton icon={Ungroup} onClick={handleUngroup} title='그룹 해제' />
    </div>
  );
}

export default GroupToolbar;
