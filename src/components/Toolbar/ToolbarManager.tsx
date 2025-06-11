import { useSelectedObjects } from '../../store/useEditorStore';
import useToolbarStore from '../../store/useToolbarStore';
import { AlignmentToolbar } from './AlignmentToolbar';
import DefaultToolbar from './DefaultToolbar';
import GroupToolbar from './GroupToolbar';
import TextToolbar from './TextToolbar';

export default function ToolbarManager() {
  const toolbarType = useToolbarStore((state) => state.toolbarType);
  const selectedObjects = useSelectedObjects();

  // 2개 이상 객체가 선택되었을 때만 정렬 툴바 표시
  const showAlignmentToolbar = selectedObjects.length >= 2;

  return (
    <div className='flex items-center'>
      <DefaultToolbar />

      {toolbarType === 'text' && (
        <>
          <div className='w-px h-6 bg-gray-300 mx-1' />
          <TextToolbar />
        </>
      )}
      {toolbarType === 'group' && (
        <>
          <div className='w-px h-6 bg-gray-300 mx-1' />
          <GroupToolbar />
        </>
      )}
      {showAlignmentToolbar && (
        <>
          <div className='w-px h-6 bg-gray-300 mx-1' />
          <AlignmentToolbar />
        </>
      )}
    </div>
  );
}
