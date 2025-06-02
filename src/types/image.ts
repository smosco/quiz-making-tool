export interface ImageItem {
  imageId: string;
  width: string;
  height: string;
  extension: string;
  tags: string;
}

export interface TGetImage {
  list: ImageItem[];
}
