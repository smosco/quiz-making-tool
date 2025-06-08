import EditorCanvas from "./components/Canvas/EditorCanvas"
import OptionPanel from "./components/OptionPanel/OptionPanel"
import ToolbarManager from "./components/Toolbar/ToolbarManager"
import "./utils/setupFabric"

export default function App() {
  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Header with Toolbar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-3">
          <ToolbarManager />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          {/* <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4"> */}
            <EditorCanvas />
          {/* </div> */}
        </div>

        {/* Right Panel */}
        <div className="w-80 bg-white border-l border-gray-200 shadow-sm">
          <OptionPanel />
        </div>
      </div>
    </div>
  )
}
