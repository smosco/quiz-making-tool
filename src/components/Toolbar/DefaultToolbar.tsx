'use client';

import {
  ArrowDown,
  ArrowUp,
  Eye,
  ImageIcon,
  Save,
  Square,
  Trash2,
  Type,
} from 'lucide-react';
import { useState } from 'react';
import { useEditorStore } from '../../store/editorStore';
import { addRectToCanvas, addTextboxToCanvas } from '../../utils/fabricUtils';
import { saveEditorState } from '../../utils/sessionStorage';
import { getCanvasInstance } from '../Canvas/EditorCanvas';
import ImageModal from '../ImageModal';
import PreviewModal from '../Preview/PreviewModal';
import ToolbarButton from './ToolbarButton';

function DefaultToolbar() {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const { removeOptionsByIds } = useEditorStore();

  const handleSave = () => {
    const canvas = getCanvasInstance();
    saveEditorState(canvas);
    alert('저장 완료');
  };

  const handleBringForward = () => {
    const canvas = getCanvasInstance();
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      // canvas.bringForward(activeObject)
      canvas.requestRenderAll();
    }
  };

  const handleSendBackward = () => {
    const canvas = getCanvasInstance();
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      // canvas.sendBackwards(activeObject)
      canvas.requestRenderAll();
    }
  };

  const handleDelete = () => {
    const canvas = getCanvasInstance();
    const activeObjects = canvas.getActiveObjects();

    const objectIds = activeObjects
      .map((obj) => obj.jeiId)
      .filter((id): id is string => id !== undefined);

    activeObjects.forEach((obj) => {
      canvas.remove(obj);
    });

    if (objectIds.length > 0) {
      removeOptionsByIds(objectIds); // 한 번의 상태 업데이트
    }
  };

  return (
    <>
      <div className='flex items-center gap-1 p-1 bg-gray-100 rounded-lg'>
        {/* File Operations */}
        <ToolbarButton icon={Save} onClick={handleSave} title='저장' />
        <ToolbarButton
          icon={Eye}
          onClick={() => setIsPreviewModalOpen(true)}
          title='미리보기'
        />

        <div className='w-px h-6 bg-gray-300 mx-1' />

        {/* Add Elements */}
        <ToolbarButton
          icon={Type}
          onClick={addTextboxToCanvas}
          title='텍스트 추가'
        />
        <ToolbarButton
          icon={Square}
          onClick={addRectToCanvas}
          title='사각형 추가'
        />
        <ToolbarButton
          icon={ImageIcon}
          onClick={() => setIsImageModalOpen(true)}
          title='이미지 추가'
        />

        <div className='w-px h-6 bg-gray-300 mx-1' />

        {/* Layer Operations */}
        <ToolbarButton
          icon={ArrowUp}
          onClick={handleBringForward}
          title='앞으로 가져오기'
        />
        <ToolbarButton
          icon={ArrowDown}
          onClick={handleSendBackward}
          title='뒤로 보내기'
        />

        <div className='w-px h-6 bg-gray-300 mx-1' />

        {/* Delete Elements */}
        <ToolbarButton
          icon={Trash2}
          onClick={handleDelete}
          title='삭제'
          variant='danger'
        />
      </div>

      {/* Modals */}
      {isImageModalOpen && (
        <ImageModal onClose={() => setIsImageModalOpen(false)} />
      )}
      {isPreviewModalOpen && (
        <PreviewModal onClose={() => setIsPreviewModalOpen(false)} />
      )}
    </>
  );
}

export default DefaultToolbar;
