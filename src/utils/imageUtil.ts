const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const IMAGE_PATH = import.meta.env.VITE_IMAGE_PATH;

export const getImageUrl = (imageId: string, extension: string) =>
  `${API_BASE_URL}${IMAGE_PATH}/${imageId}.${extension}`;
