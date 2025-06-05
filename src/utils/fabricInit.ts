import { FabricObject } from 'fabric';

// FabricObject 프로토타입 확장하는 함수 -> 불필요함
export const extendFabricSerialization = () => {
  const props = ['jeiId', 'jeiRole'];
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const proto = FabricObject.prototype as any;

  proto.toObjectProperties = [
    ...(proto.toObjectProperties ?? []),
    ...props.filter((p) => !(proto.toObjectProperties ?? []).includes(p)),
  ];
};
