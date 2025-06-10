'use client';

import { Play, X } from 'lucide-react';
import PreviewCanvas from './PreviewCanvas';
import SubmitBar from './Submitbar';

interface PreviewModalProps {
  onClose: () => void;
}

export default function PreviewModal({ onClose }: PreviewModalProps) {
  const handleBackdropClick = (e: React.MouseEvent) => {
    // 클릭된 요소가 backdrop(바깥쪽 div)인지 확인
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div
      className='fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4'
      onClick={handleBackdropClick}
    >
      <div className='bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden'>
        {/* 헤더 */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
              <Play className='w-5 h-5 text-blue-600' />
            </div>
            <div>
              <h2 className='text-xl font-semibold text-gray-900'>
                문제 미리보기
              </h2>
              <p className='text-sm text-gray-500'>
                작성한 문제를 확인하고 테스트해보세요
              </p>
            </div>
          </div>
          <button
            type='button'
            onClick={onClose}
            className='w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors'
            title='닫기'
          >
            <X className='w-5 h-5 text-gray-600' />
          </button>
        </div>

        {/* 프리뷰 캔버스 */}
        <PreviewCanvas />
        <SubmitBar />
      </div>
    </div>
  );
}
