'use client'

import { Task } from '@/types/userTask'
import { DndContext, DragOverlay } from '@dnd-kit/core'
import { Check, Pencil, Pickaxe, Trash2, X } from 'lucide-react'
import { useState } from 'react'

// import LoadingCheckMate from '@/components/LoadingCheckMate'

import KanbanColumn from './KanbanColumn'
import { KanbanLogic } from './KanbanLogic'
import TaskModal from './TaskModal'

export default function KanbanView({ projectId }: { projectId: string }) {
  const {
    columns,
    activeTask,
    setActiveTask,
    sensors,
    handleDragOver,
    handleDragEnd,
    error,
    setColumns,
    deleteTask,
    handleTaskUpdate: updateTaskOnServer,
  } = KanbanLogic(projectId)

  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set())
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedTaskForModal, setSelectedTaskForModal] = useState<Task | null>(
    null
  )

  const handleTaskSelect = (taskId: string, isSelected: boolean) => {
    setSelectedTasks((prev) => {
      const newSelected = new Set(prev)
      if (isSelected) {
        newSelected.add(taskId)
      } else {
        newSelected.delete(taskId)
      }
      return newSelected
    })
  }

  const handleClearSelection = () => {
    // 모든 컬럼의 태스크를 순회하면서 체크박스 해제
    Object.values(columns).forEach((columnTasks) => {
      columnTasks.forEach((task) => {
        if (selectedTasks.has(task.taskId)) {
          const event = new CustomEvent('kanban:uncheck-task', {
            detail: { taskId: task.taskId },
          })
          window.dispatchEvent(event)
        }
      })
    })
    setSelectedTasks(new Set())
  }

  const handleDeleteSelectedTasks = async () => {
    try {
      setIsDeleting(true)
      // 선택된 모든 태스크에 대해 삭제 API 호출
      const deletePromises = Array.from(selectedTasks).map((taskId) =>
        deleteTask(taskId)
      )
      await Promise.all(deletePromises)

      // 모든 컬럼의 태스크를 순회하면서 선택된 태스크 삭제
      Object.entries(columns).forEach(([columnKey, columnTasks]) => {
        const remainingTasks = columnTasks.filter(
          (task) => !selectedTasks.has(task.taskId)
        )
        setColumns((prev) => ({
          ...prev,
          [columnKey]: remainingTasks,
        }))
      })
      setSelectedTasks(new Set())
    } catch (error) {
      console.error('태스크 삭제 중 오류 발생:', error)
      // TODO: 에러 처리 UI 추가
    } finally {
      setIsDeleting(false)
    }
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTaskForModal(task)
  }

  const handleModalClose = () => {
    setSelectedTaskForModal(null)
  }

  const updateTaskAndState = async (
    taskId: string,
    data: Partial<{
      title: string
      description: string
      status: 'TODO' | 'IN_PROGRESS' | 'DONE'
      assigneeEmail: string
      startDate: string
      endDate: string
      priority: 'LOW' | 'MEDIUM' | 'HIGH'
      epicId: string
    }>
  ) => {
    try {
      // 서버에 업데이트 요청
      await updateTaskOnServer(taskId, data)

      // 로컬 상태 업데이트
      setColumns((prev) => {
        const newColumns = { ...prev }
        Object.keys(newColumns).forEach((key) => {
          const columnKey = key as keyof typeof newColumns
          newColumns[columnKey] = newColumns[columnKey].map((task) =>
            task.taskId === taskId ? { ...task, ...data } : task
          )
        })
        return newColumns
      })

      // 모달에 표시된 태스크도 업데이트
      if (selectedTaskForModal?.taskId === taskId) {
        setSelectedTaskForModal((prev) => (prev ? { ...prev, ...data } : null))
      }
    } catch (error) {
      console.error('태스크 업데이트 실패:', error)
    }
  }

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
        <div className="flex gap-3 relative">
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
            onTaskSelect={handleTaskSelect}
            onTaskUpdate={updateTaskAndState}
            onTaskClick={handleTaskClick}
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
            onTaskSelect={handleTaskSelect}
            onTaskUpdate={updateTaskAndState}
            onTaskClick={handleTaskClick}
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
            onTaskSelect={handleTaskSelect}
            onTaskUpdate={updateTaskAndState}
            onTaskClick={handleTaskClick}
          />

          {selectedTasks.size > 0 && (
            <div className="fixed bottom-6 right-6 w-[240px] h-[40px] bg-[#FFE5E3] border border-[#FFE5E3] rounded-full flex items-center justify-between px-4 py-2">
              <span className="text-[#D91F11] text-base font-medium">
                {selectedTasks.size}개 선택됨
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDeleteSelectedTasks}
                  disabled={isDeleting}
                  className="w-5 h-5 flex items-center justify-center text-[#D91F11] disabled:opacity-50"
                >
                  <Trash2 size={20} />
                </button>
                <button
                  onClick={handleClearSelection}
                  className="w-5 h-5 flex items-center justify-center text-[#D91F11]"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          )}
        </div>

        <DragOverlay>
          {activeTask && (
            <div className="bg-white text-base font-medium text-black-01 rounded-md px-3 py-3.5 select-none cursor-pointer mb-2 border border-[#DCDCDC]">
              {activeTask.title}
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {selectedTaskForModal && (
        <TaskModal
          isOpen={true}
          onClose={handleModalClose}
          task={selectedTaskForModal}
          onUpdate={updateTaskAndState}
        />
      )}
    </div>
  )
}
