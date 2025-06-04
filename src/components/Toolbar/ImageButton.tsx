import { Image } from 'lucide-react';
import { useState } from 'react';
import ImageModal from '../ImageModal';

export default function ImageButton() {
  const [showImageModal, setShowImageModal] = useState(false);

  return (
    <>
      <button type='button' onClick={() => setShowImageModal(true)}>
        <Image size={32} />
      </button>
      <ImageModal
        open={showImageModal}
        onClose={() => setShowImageModal(false)}
      />
    </>
  );
}
