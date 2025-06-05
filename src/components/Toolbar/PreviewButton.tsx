import { View } from 'lucide-react';
import { useState } from 'react';
import PreviewModal from '../Preview/PreviewModal';

export default function PreviewButton() {
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  return (
    <>
      <button type='button' onClick={() => setShowPreviewModal(true)}>
        <View size={32} />
      </button>
      <PreviewModal
        open={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
      />
    </>
  );
}
