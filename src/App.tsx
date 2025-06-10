import EditorCanvas from './components/Canvas/EditorCanvas';
import OptionPanel from './components/OptionPanel/OptionPanel';
import ToolbarManager from './components/Toolbar/ToolbarManager';
import { KeyboardShortcutsProvider } from './components/providers/KeyboardShortcutsProvider';
import './utils/setupFabric';

export default function App() {
  return (
    <div className='h-screen bg-white flex flex-col'>
      {/* 툴바 헤더 */}
      <div className='bg-gray-100 border-b border-gray-200 shadow-sm px-6 py-3'>
        <ToolbarManager />
      </div>

      {/* 콘텐츠 */}
      <div className='flex-1 flex overflow-hidden'>
        {/* 캔버스 */}
        <div className='flex-1 flex flex-col items-center justify-center p-6'>
          <KeyboardShortcutsProvider>
            <EditorCanvas />
          </KeyboardShortcutsProvider>
        </div>

        {/* 옵션 패널 */}
        <div className='w-80 bg-gray-100 border-l border-gray-200 shadow-sm'>
          <OptionPanel />
        </div>
      </div>
    </div>
  );
}
