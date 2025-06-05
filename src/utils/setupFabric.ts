import { FabricObject, Group } from 'fabric';
// **ADDED: This should be executed at runtime so can go in a plugin file.**
// to actually have the properties added to the serialized object
FabricObject.customProperties = ['jeiId', 'jeiRole'];
Group.customProperties = ['jeiId', 'jeiRole'];
