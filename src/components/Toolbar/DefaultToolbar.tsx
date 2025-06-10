'use client';

import {
  ChevronDown,
  ChevronUp,
  ChevronsDown,
  ChevronsUp,
  Eye,
  ImageIcon,
  Save,
  Square,
  Trash2,
  Type,
} from 'lucide-react';
import { useState } from 'react';
import { useEditorStore } from '../../store/useEditorStore';
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
      canvas.bringObjectForward(activeObject);
      canvas.requestRenderAll();
    }
  };

  const handleSendBackward = () => {
    const canvas = getCanvasInstance();
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.sendObjectBackwards(activeObject);
      canvas.requestRenderAll();
    }
  };

  const handleBringFront = () => {
    const canvas = getCanvasInstance();
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.bringObjectToFront(activeObject);
      canvas.requestRenderAll();
    }
  };

  const handleSendBack = () => {
    const canvas = getCanvasInstance();
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.sendObjectToBack(activeObject);
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
      <div className='flex items-center gap-1 p-1'>
        {/* 저장, 프리뷰 */}
        <ToolbarButton icon={Save} onClick={handleSave} title='저장' />
        <ToolbarButton
          icon={Eye}
          onClick={() => setIsPreviewModalOpen(true)}
          title='미리보기'
        />

        <div className='w-px h-6 bg-gray-300 mx-1' />

        {/* 객체 추가 */}
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

        {/* 앞, 뒤 가져오기 */}
        <ToolbarButton
          icon={ChevronUp}
          onClick={handleBringForward}
          title='앞으로 가져오기'
        />
        <ToolbarButton
          icon={ChevronDown}
          onClick={handleSendBackward}
          title='뒤로 보내기'
        />
        <ToolbarButton
          icon={ChevronsUp}
          onClick={handleBringFront}
          title='맨앞으로 가져오기'
        />
        <ToolbarButton
          icon={ChevronsDown}
          onClick={handleSendBack}
          title='맨뒤로 보내기'
        />

        <div className='w-px h-6 bg-gray-300 mx-1' />

        {/* 객체 삭제 */}
        <ToolbarButton
          icon={Trash2}
          onClick={handleDelete}
          title='삭제'
          variant='danger'
        />
      </div>

      {/* 모달 */}
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
