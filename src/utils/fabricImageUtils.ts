import { FabricImage, Group, loadSVGFromURL } from 'fabric';
import { v4 as uuidv4 } from 'uuid';
import { getCanvasInstance } from '../components/Canvas/EditorCanvas';

// SVG 파일 확장자 목록
const SVG_EXTENSIONS = ['svg'];

// 확장자가 SVG인지 확인
const isSVGExtension = (extension: string): boolean => {
  return SVG_EXTENSIONS.includes(extension.toLowerCase());
};

// SVG를 캔버스에 추가
const addSVGToCanvas = async (url: string) => {
  const canvas = getCanvasInstance();
  if (!canvas) return;

  try {
    const { objects, options } = await loadSVGFromURL(url);

    if (!objects || objects.length === 0) {
      console.warn('SVG가 비어있거나 로드할 수 없습니다:', url);
      return;
    }

    // SVG 그룹 생성 (null 값 필터링)
    const filteredObjects = objects.filter(
      (obj): obj is NonNullable<typeof obj> => obj !== null,
    );
    const svgGroup = new Group(filteredObjects, {
      left: 100,
      top: 100,
      jeiId: uuidv4(),
    });

    // 원본 크기 정보 가져오기
    const svgWidth = svgGroup.width || options?.width || 100;
    const svgHeight = svgGroup.height || options?.height || 100;

    // 캔버스에 맞게 스케일 조정
    const maxWidth = canvas.getWidth() * 0.8;
    const maxHeight = canvas.getHeight() * 0.8;

    const scaleX = maxWidth / svgWidth;
    const scaleY = maxHeight / svgHeight;
    const scale = Math.min(1, scaleX, scaleY);

    svgGroup.set({
      scaleX: scale,
      scaleY: scale,
    });

    canvas.add(svgGroup);
    canvas.setActiveObject(svgGroup);
    canvas.requestRenderAll();

    // console.log('SVG 추가 완료:', {
    //   originalSize: { width: svgWidth, height: svgHeight },
    //   scale: scale,
    // });
  } catch (error) {
    console.error('SVG 로드 실패:', error);
    // SVG 로드 실패 시 일반 이미지로 fallback
    await addRasterImageToCanvas(url);
  }
};

// 일반 이미지(PNG, JPG 등)를 캔버스에 추가
const addRasterImageToCanvas = async (url: string) => {
  const canvas = getCanvasInstance();
  if (!canvas) return;

  try {
    // HTML Image로 먼저 로드하여 정확한 크기 확보
    const htmlImg = new Image();
    htmlImg.crossOrigin = 'anonymous';

    await new Promise<void>((resolve, reject) => {
      htmlImg.onload = () => resolve();
      htmlImg.onerror = reject;
      htmlImg.src = url;
    });

    // 실제 이미지 크기 확보
    const originalWidth = htmlImg.naturalWidth;
    const originalHeight = htmlImg.naturalHeight;

    // Fabric 이미지 생성
    const img = new FabricImage(htmlImg);

    // 캔버스 크기 기준 스케일 계산
    const maxWidth = canvas.getWidth() * 0.8;
    const maxHeight = canvas.getHeight() * 0.8;

    const scaleX = maxWidth / originalWidth;
    const scaleY = maxHeight / originalHeight;
    const scale = Math.min(1, scaleX, scaleY);

    // 스케일 적용
    img.set({
      scaleX: scale,
      scaleY: scale,
      left: 100,
      top: 100,
      jeiId: uuidv4(),
    });

    canvas.add(img);
    canvas.setActiveObject(img);
    canvas.requestRenderAll();
  } catch (error) {
    console.error('이미지 로드 실패:', error);
  }
};

// 메인 함수: 확장자에 따라 적절한 방식으로 이미지 추가
export const addImageToCanvas = async (url: string, extension?: string) => {
  let fileExtension = extension;
  if (!fileExtension) {
    // 확장자가 없으면 URL에서 추출 시도
    const urlParts = url.split('.');
    fileExtension = urlParts[urlParts.length - 1];
  }

  if (fileExtension && isSVGExtension(fileExtension)) {
    // console.log('SVG 파일 감지, 벡터로 로드합니다:', url);
    await addSVGToCanvas(url);
  } else {
    // console.log('래스터 이미지로 로드합니다:', url);
    await addRasterImageToCanvas(url);
  }
};

// 기존 호환성을 위한 함수 (deprecated)
export const addImageToCanvasLegacy = async (url: string) => {
  await addRasterImageToCanvas(url);
};
