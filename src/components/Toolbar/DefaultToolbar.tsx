"use client"

import { Save, Eye, Type, Square, ImageIcon, ArrowUp, ArrowDown } from "lucide-react"
import { useState } from "react"
import ToolbarButton from "./ToolbarButton"
import ImageModal from "../ImageModal"
import PreviewModal from "../Preview/PreviewModal"
import { saveEditorState } from "../../utils/sessionStorage"
import { getCanvasInstance } from "../Canvas/EditorCanvas"
import { addTextboxToCanvas, addRectToCanvas } from "../../utils/fabricUtils"

function DefaultToolbar() {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)

  const handleSave = () => {
    const canvas = getCanvasInstance()
    saveEditorState(canvas)
    alert("저장 완료")
  }

  const handleBringForward = () => {
    const canvas = getCanvasInstance()
    const activeObject = canvas.getActiveObject()
    if (activeObject) {
      // canvas.bringForward(activeObject)
      canvas.requestRenderAll()
    }
  }

  const handleSendBackward = () => {
    const canvas = getCanvasInstance()
    const activeObject = canvas.getActiveObject()
    if (activeObject) {
      // canvas.sendBackwards(activeObject)
      canvas.requestRenderAll()
    }
  }

  return (
    <>
      <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
        {/* File Operations */}
        <ToolbarButton icon={Save} onClick={handleSave} title="저장" />
        <ToolbarButton icon={Eye} onClick={() => setIsPreviewModalOpen(true)} title="미리보기" />

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Add Elements */}
        <ToolbarButton icon={Type} onClick={addTextboxToCanvas} title="텍스트 추가" />
        <ToolbarButton icon={Square} onClick={addRectToCanvas} title="사각형 추가" />
        <ToolbarButton icon={ImageIcon} onClick={() => setIsImageModalOpen(true)} title="이미지 추가" />

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Layer Operations */}
        <ToolbarButton icon={ArrowUp} onClick={handleBringForward} title="앞으로 가져오기" />
        <ToolbarButton icon={ArrowDown} onClick={handleSendBackward} title="뒤로 보내기" />
      </div>

      {/* Modals */}
      {isImageModalOpen && <ImageModal onClose={() => setIsImageModalOpen(false)} />}
      {isPreviewModalOpen && <PreviewModal onClose={() => setIsPreviewModalOpen(false)} />}
    </>
  )
}

export default DefaultToolbar
