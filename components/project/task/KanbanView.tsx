'use client'

import { DndContext, DragOverlay } from '@dnd-kit/core'
import { KanbanLogic } from './KanbanLogic'
import KanbanColumn from './KanbanColumn'
import { Pencil, Pickaxe, Check } from 'lucide-react'

export default function KanbanView() {
  const {
    columns,
    activeTask,
    setActiveTask,
    sensors,
    handleDragOver,
    handleDragEnd,
  } = KanbanLogic()

  return (
    <div className="text-[#121212]">
      <DndContext
        sensors={sensors}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragStart={({ active }) => {
          const activeId = active.id.toString()
          for (const column of Object.values(columns)) {
            const task = column.find((t) => t.id === activeId)
            if (task) {
              setActiveTask(task)
              break
            }
          }
        }}
      >
        <div className="flex gap-3">
          <KanbanColumn
            title={
              <div className="flex items-center">
                <Pencil size={14} color="#858380" />
                <span className="ml-1 text-black-01 text-sm">To Do</span>
                <span className="ml-1 mt-[1px] text-[#737373] text-[11px]">
                  ({columns.todo.length})
                </span>
              </div>
            }
            columnKey="todo"
            bg="bg-[#F8F8F7] rounded-none"
            tasks={columns.todo}
          />
          <KanbanColumn
            title={
              <div className="flex items-center">
                <Pickaxe size={14} color="#5093BC" />
                <span className="ml-1 text-black-01 text-sm">In Progress</span>
                <span className="ml-1 mt-[1px] text-[#737373] text-[11px]">
                  ({columns.inProgress.length})
                </span>
              </div>
            }
            columnKey="inProgress"
            bg="bg-[#F3F9FC] rounded-none"
            tasks={columns.inProgress}
          />
          <KanbanColumn
            title={
              <div className="flex items-center">
                <Check size={14} color="#5C9771" />
                <span className="ml-1 text-black-01 text-sm">Done</span>
                <span className="ml-1 mt-[1px] text-[#737373] text-[11px]">
                  ({columns.done.length})
                </span>
              </div>
            }
            columnKey="done"
            bg="bg-[#F6FAF6] rounded-none"
            tasks={columns.done}
          />
        </div>

        <DragOverlay>
          {activeTask && (
            <div className="bg-white text-black shadow-md p-3 select-none cursor-pointer">
              {activeTask.content}
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
