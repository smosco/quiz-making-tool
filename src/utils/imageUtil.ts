const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const IMAGE_RENDERING_PATH = import.meta.env.VITE_IMAGE_RENDERING_PATH;

export const getImageUrl = (imageId: string, extension: string) =>
  `${API_BASE_URL}/${IMAGE_RENDERING_PATH}/${imageId}.${extension}`;
