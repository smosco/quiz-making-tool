import { useState } from 'react';
import ImageModal from '../ImageModal';

export default function ToolbarButtons() {
  const [showImageModal, setShowImageModal] = useState(false);

  return (
    <>
      <div className='flex gap-2 mb-2'>
        <button
          type='button'
          onClick={() => setShowImageModal(true)}
          className='px-3 py-1 bg-gray-200 rounded hover:bg-gray-300'
        >
          이미지 아이콘
        </button>
      </div>
      <ImageModal
        open={showImageModal}
        onClose={() => setShowImageModal(false)}
      />
    </>
  );
}
