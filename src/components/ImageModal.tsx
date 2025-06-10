import {
  Check,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Plus,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { getImage } from '../api/image';
import type { ImageItem } from '../types/image';
import { addImageToCanvas } from '../utils/fabricImageUtils';
import { getImageUrl } from '../utils/imageUtil';

interface Props {
  onClose: () => void;
}

const ITEMS_PER_PAGE = 12;

export default function ImageModal({ onClose }: Props) {
  const [allImages, setAllImages] = useState<ImageItem[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getImage().then((res) => {
      setAllImages(res.list);
      setPage(1);
      setLoading(false);
    });
  }, []);

  const totalPages = Math.ceil(allImages.length / ITEMS_PER_PAGE);
  const currentImages = allImages.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const handleAdd = () => {
    allImages
      .filter((img) => selected.has(img.imageId))
      .forEach((img) => {
        const url = getImageUrl(img.imageId, img.extension);
        // extension 정보를 함께 전달
        addImageToCanvas(url, img.extension);
      });
    setSelected(new Set());
    onClose();
  };

  // SVG 아이콘 표시 함수
  const isSVGImage = (extension: string) => {
    return extension.toLowerCase() === 'svg';
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    // 클릭된 요소가 backdrop(바깥쪽 div)인지 확인
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div
      className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4'
      onClick={handleBackdropClick}
    >
      <div className='bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col'>
        {/* 헤더 */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50 flex-shrink-0'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
              <ImageIcon className='w-5 h-5 text-blue-600' />
            </div>
            <div>
              <h2 className='text-xl font-semibold text-gray-900'>
                이미지 선택
              </h2>
              <p className='text-sm text-gray-500'>
                {selected.size > 0
                  ? `${selected.size}개 선택됨`
                  : '캔버스에 추가할 이미지를 선택하세요'}
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

        {/* 콘텐츠 - 스크롤 가능한 영역 */}
        <div className='flex-1 overflow-y-auto p-6'>
          {loading ? (
            <div className='flex items-center justify-center py-12'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600' />
              <span className='ml-3 text-gray-600'>
                이미지를 불러오는 중...
              </span>
            </div>
          ) : (
            <>
              {/* 이미지 그리드 */}
              <div className='grid grid-cols-4 gap-4 mb-6'>
                {currentImages.map((img) => {
                  const url = getImageUrl(img.imageId, img.extension);
                  const isSelected = selected.has(img.imageId);
                  const isSVG = isSVGImage(img.extension);

                  return (
                    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
                    <div
                      key={img.imageId}
                      onClick={() => toggleSelect(img.imageId)}
                      className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                        isSelected
                          ? 'border-blue-500 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className='aspect-square bg-gray-50 flex items-center justify-center p-2 relative h-28 w-28'>
                        <img
                          src={url || '/placeholder.svg'}
                          alt={img.tags}
                          className='max-w-full max-h-full object-contain'
                        />

                        {/* SVG 표시 뱃지 */}
                        {isSVG && (
                          <div className='absolute bottom-1 left-1 px-1 py-0.5 bg-green-500 text-white text-xs rounded-sm font-medium'>
                            SVG
                          </div>
                        )}
                      </div>

                      {/* 선택됐는지 표시 */}
                      {isSelected && (
                        <div className='absolute top-1 right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center'>
                          <Check className='w-3 h-3 text-white' />
                        </div>
                      )}

                      {/* 호버시 오버레이 */}
                      <div className='absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors' />
                    </div>
                  );
                })}
              </div>

              {/* 페이지네이션 */}
              <div className='flex items-center justify-between'>
                <button
                  type='button'
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className='inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                >
                  <ChevronLeft className='w-4 h-4' />
                  이전
                </button>

                <div className='flex items-center gap-2'>
                  <span className='text-sm text-gray-600'>
                    페이지 {page} / {totalPages}
                  </span>
                  <span className='text-xs text-gray-400'>
                    (총 {allImages.length}개 이미지)
                  </span>
                </div>

                <button
                  type='button'
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className='inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                >
                  다음
                  <ChevronRight className='w-4 h-4' />
                </button>
              </div>
            </>
          )}
        </div>

        {/* 푸터 */}
        <div className='flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0'>
          <button
            type='button'
            onClick={onClose}
            className='px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
          >
            취소
          </button>
          <button
            type='button'
            onClick={handleAdd}
            disabled={selected.size === 0}
            className={`inline-flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              selected.size > 0
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Plus className='w-4 h-4' />
            {selected.size > 0 ? `${selected.size}개 추가` : '이미지 추가'}
          </button>
        </div>
      </div>
    </div>
  );
}
