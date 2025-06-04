import useToolbarStore from '../../store/useToolbarStore';
import DefaultToolbar from './DefaultToolbar';
import GroupToolbar from './GroupToolbar';
import TextToolbar from './TextToolbar';

export default function ToolbarManager() {
  const { showTextToolbar, showGroupToolbar } = useToolbarStore();

  return (
    <>
      <DefaultToolbar
        onAddText={() => {}}
        onAddRect={() => {}}
        onAddCircle={() => {}}
        onAddImage={() => {}}
      />
      {showTextToolbar && (
        <TextToolbar
          fontSize={16}
          setFontSize={() => {}}
          isBold={false}
          toggleBold={() => {}}
          setFontFamily={() => {}}
          fontColor='black'
          setFontColor={() => {}}
        />
      )}
      {showGroupToolbar && (
        <GroupToolbar
          onGroup={() => {}}
          onUngroup={() => {}}
          onAlign={() => {}}
        />
      )}
    </>
  );
}
