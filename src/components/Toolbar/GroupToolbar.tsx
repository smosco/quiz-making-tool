"use client"

import { Group, Ungroup, Trash2 } from "lucide-react"
import ToolbarButton from "./ToolbarButton"
import { getCanvasInstance } from "../Canvas/EditorCanvas"
import { group, ungroup } from "../../utils/fabricUtils"

function GroupToolbar() {
  const handleGroup = () => {
    group();
  }

  const handleUngroup = () => {
    ungroup();
  }

  const handleDelete = () => {
    const canvas = getCanvasInstance()
    const activeObjects = canvas.getActiveObjects()
    if (activeObjects.length > 0) {
      activeObjects.forEach((obj) => canvas.remove(obj))
      canvas.discardActiveObject()
      canvas.requestRenderAll()
    }
  }

  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
      <ToolbarButton icon={Trash2} onClick={handleDelete} title="삭제" variant="danger" />

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <ToolbarButton icon={Group} onClick={handleGroup} title="그룹 만들기" />
      <ToolbarButton icon={Ungroup} onClick={handleUngroup} title="그룹 해제" />
    </div>
  )
}

export default GroupToolbar
