import type { TGetImage } from '../types/image';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const IMAGE_PATH = import.meta.env.VITE_IMAGE_PATH;
const DEFAULT_TOKEN = import.meta.env.VITE_DEFAULT_ACCESS_TOKEN;

export const getConfigure = () => {
  const accessToken =
    window.sessionStorage.getItem('accessToken') || DEFAULT_TOKEN;
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
};

export const getImage = async (): Promise<TGetImage> => {
  const res = await fetch(`${API_BASE_URL}/${IMAGE_PATH}`, getConfigure());
  if (!res.ok) throw new Error('이미지 API 오류');
  return res.json();
};
