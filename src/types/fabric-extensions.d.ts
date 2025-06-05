// 사용자 정의 속성 추가

// ** ADDED: This should go in a type definition file & is done at compilation **
import { FabricImage } from 'fabric';

declare module 'fabric' {
  // to have the properties recognized on the instance and in the constructor
  interface FabricObject {
    jeiId?: string;
    jeiRole?: string;
  }
  // to have the properties typed in the exported object
  interface SerializedObjectProps {
    jeiId?: string;
    jeiRole?: string;
  }
  interface Group {
    jeiId?: string;
    jeiRole?: string;
  }
}
