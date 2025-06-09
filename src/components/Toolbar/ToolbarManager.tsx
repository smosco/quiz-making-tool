import useToolbarStore from '../../store/useToolbarStore';
import { AlignmentToolbar } from './AlignmentToolbar';
import DefaultToolbar from './DefaultToolbar';
import GroupToolbar from './GroupToolbar';
import TextToolbar from './TextToolbar';

export default function ToolbarManager() {
  const { toolbarType } = useToolbarStore();

  return (
    <div className='flex'>
      <DefaultToolbar />
      {toolbarType === 'text' && <TextToolbar />}
      {toolbarType === 'group' && <GroupToolbar />}
      {/* TODO(@smosco): 정렬 툴바는 언제 등장해야하는가 */}
      <AlignmentToolbar />
    </div>
  );
}
