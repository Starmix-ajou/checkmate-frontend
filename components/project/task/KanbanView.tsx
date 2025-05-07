'use client'

import { DndContext, DragOverlay } from '@dnd-kit/core'
import { Check, Pencil, Pickaxe } from 'lucide-react'

// import LoadingCheckMate from '@/components/LoadingCheckMate'

import KanbanColumn from './KanbanColumn'
import { KanbanLogic } from './KanbanLogic'

export default function KanbanView() {
  const {
    columns,
    activeTask,
    setActiveTask,
    sensors,
    handleDragOver,
    handleDragEnd,
    error,
  } = KanbanLogic()

  if (error) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="text-red-500 text-center">
          <p className="text-lg font-medium mb-2">오류가 발생했습니다</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-[calc(100vh-200px)]">
  //       <LoadingCheckMate size={64} loading={loading} />
  //     </div>
  //   )
  // }

  return (
    <div className="text-[#121212]">
      <DndContext
        sensors={sensors}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragStart={({ active }) => {
          const activeId = active.id.toString()
          for (const column of Object.values(columns)) {
            const task = column.find((t) => t.taskId === activeId)
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
                <span className="ml-1 text-black-01 text-sm font-medium">
                  To Do
                </span>
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
                <span className="ml-1 text-black-01 text-sm font-medium">
                  In Progress
                </span>
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
                <span className="ml-1 text-black-01 text-sm font-medium">
                  Done
                </span>
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
            <div className="bg-white text-base font-medium text-black-01 rounded-md px-3 py-3.5 select-none cursor-pointer mb-2 border border-[#DCDCDC]">
              {activeTask.title}
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
