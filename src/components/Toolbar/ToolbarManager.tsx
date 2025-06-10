import { useSelectedObjects } from '../../store/useEditorStore';
import useToolbarStore from '../../store/useToolbarStore';
import { AlignmentToolbar } from './AlignmentToolbar';
import DefaultToolbar from './DefaultToolbar';
import GroupToolbar from './GroupToolbar';
import TextToolbar from './TextToolbar';

export default function ToolbarManager() {
  const toolbarType = useToolbarStore((state) => state.toolbarType);
  const selectedObjects = useSelectedObjects();

  const showAlignmentToolbar =
    toolbarType === 'group' || selectedObjects.length >= 2;

  return (
    <div className='flex'>
      <DefaultToolbar />
      {toolbarType === 'text' && <TextToolbar />}
      {toolbarType === 'group' && <GroupToolbar />}
      {showAlignmentToolbar && <AlignmentToolbar />}
    </div>
  );
}
