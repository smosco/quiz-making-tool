import { useEffect, useState } from 'react';
import { getImage } from '../api/image';
import type { ImageItem } from '../types/image';
import { addImageToCanvas } from '../utils/fabricImageUtils';
import { getImageUrl } from '../utils/imageUtil';

interface Props {
  open: boolean;
  onClose: () => void;
}

const ITEMS_PER_PAGE = 12;

export default function ImageModal({ open, onClose }: Props) {
  const [allImages, setAllImages] = useState<ImageItem[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!open) return;
    getImage().then((res) => {
      setAllImages(res.list);
      setPage(1);
    });
  }, [open]);

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
        addImageToCanvas(url);
      });
    setSelected(new Set());
    onClose();
  };

  if (!open) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center'>
      <div className='bg-white p-4 rounded-lg w-[800px] max-h-[90vh] overflow-auto'>
        <h2 className='text-xl font-bold mb-2'>이미지 선택</h2>
        <div className='grid grid-cols-4 gap-4'>
          {currentImages.map((img) => {
            const url = getImageUrl(img.imageId, img.extension);
            return (
              // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
              <div
                key={img.imageId}
                onClick={() => toggleSelect(img.imageId)}
                className={`cursor-pointer border-2 p-1 ${
                  selected.has(img.imageId)
                    ? 'border-green-500'
                    : 'border-transparent'
                }`}
              >
                <img
                  src={url}
                  alt={img.tags}
                  className='w-full h-[80px] object-contain'
                />
              </div>
            );
          })}
        </div>

        <div className='flex justify-between items-center mt-4'>
          <button
            type='button'
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            ⟨ Prev
          </button>
          <span>
            Page {page} / {totalPages}
          </span>
          <button
            type='button'
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next ⟩
          </button>
        </div>

        <div className='flex justify-end gap-2 mt-4'>
          <button
            type='button'
            onClick={onClose}
            className='px-3 py-1 border rounded'
          >
            Cancel
          </button>
          <button
            type='button'
            onClick={handleAdd}
            disabled={selected.size === 0}
            className='px-3 py-1 bg-green-500 text-white rounded disabled:opacity-50'
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
