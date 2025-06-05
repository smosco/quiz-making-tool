import useToolbarStore from '../../store/useToolbarStore';
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
    </div>
  );
}
