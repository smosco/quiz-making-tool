import EditorCanvas from './components/Canvas/EditorCanvas';
import OptionPanel from './components/OptionPanel/OptionPanel';
import SaveButton from './components/Toolbar/SaveButton';
import ToolbarButtons from './components/Toolbar/ToolbarButtons';

export default function App() {
  return (
    <div className='flex gap-6 p-6'>
      <div>
        <EditorCanvas />
        <div className='mt-2'>
          <ToolbarButtons />
          <SaveButton />
        </div>
      </div>
      <OptionPanel />
    </div>
  );
}
