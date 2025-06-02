import EditorCanvas from './components/Canvas/EditorCanvas';
import ToolbarButtons from './components/Toolbar/ToolbarButtons';

function App() {
  return (
    <>
      <h1 className='text-4xl'>Quiz Making Tool</h1>
      <EditorCanvas />
      <ToolbarButtons />
    </>
  );
}

export default App;
