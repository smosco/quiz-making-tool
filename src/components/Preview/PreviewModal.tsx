import PreviewCanvas from './PreviewCanvas';
import Submitbar from './Submitbar';

interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
}

export default function PreviewModal({ open, onClose }: PreviewModalProps) {
  if (!open) return null;

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div
      className='fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center'
      onClick={onClose}
    >
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <div
        className='bg-white p-6 rounded-xl shadow-xl'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-bold'>문제 프리뷰</h2>
          <button
            type='button'
            onClick={onClose}
            className='text-gray-500 hover:text-black'
          >
            close
          </button>
        </div>
        <PreviewCanvas />
        <Submitbar />
      </div>
    </div>
  );
}
