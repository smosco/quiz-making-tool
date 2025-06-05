import EditorCanvas from './components/Canvas/EditorCanvas';
import OptionPanel from './components/OptionPanel/OptionPanel';
import ToolbarManager from './components/Toolbar/ToolbarManager';

export default function App() {
  return (
    <div className='flex flex-col gap-6 p-6'>
      <div>
        <EditorCanvas />
        <div className='mt-2'>
          <ToolbarManager />
        </div>
      </div>
      <OptionPanel />
    </div>
  );
}
