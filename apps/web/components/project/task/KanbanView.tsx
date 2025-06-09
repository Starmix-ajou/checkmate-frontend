'use client'

import { Member } from '@cm/types/project'
import { Task, TaskCreateRequest } from '@cm/types/userTask'
import { DndContext, DragEndEvent, DragOverlay } from '@dnd-kit/core'
import { Check, Pencil, Pickaxe, Trash2, X } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import EpicSelectionModal from './EpicSelectionModal'
// import LoadingScreen from '@cm/ui/components/common/LoadingScreen'
import KanbanColumn from './KanbanColumn'
import { KanbanLogic } from './KanbanLogic'
import MiniRetroDialog from './MiniRetroDialog'
import TaskModal from './TaskModal'

interface KanbanViewProps {
  projectId: string
  members: Member[]
  searchText: string
  filters: {
    priority: Task['priority'] | 'ALL'
    epicId: string
    sprintId: string
    assigneeEmails: string[]
  }
  onTaskChange?: () => void
}

export default function KanbanView({
  projectId,
  members,
  searchText,
  filters,
  onTaskChange,
}: KanbanViewProps) {
  const {
    columns,
    activeTask,
    setActiveTask,
    sensors,
    handleDragOver,
    handleDragEnd: originalHandleDragEnd,
    error,
    setColumns,
    deleteTask,
    handleTaskUpdate: updateTaskOnServer,
    getTaskById,
    fetchTasks,
    handleAddTask,
  } = KanbanLogic(projectId)

  const searchParams = useSearchParams()

  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set())
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedTaskForModal, setSelectedTaskForModal] = useState<Task | null>(
    null
  )
  const [forceUpdate, setForceUpdate] = useState(0)
  const [isEpicModalOpen, setIsEpicModalOpen] = useState(false)
  const [isMiniRetroOpen, setIsMiniRetroOpen] = useState(false)
  const [pendingTaskData, setPendingTaskData] = useState<{
    columnKey: string
    initialData: TaskCreateRequest
  } | null>(null)
  const [completedTaskId, setCompletedTaskId] = useState<string | null>(null)

  // 필터가 변경될 때마다 서버에서 데이터를 다시 가져옴
  useEffect(() => {
    fetchTasks(filters)
  }, [filters, fetchTasks])

  // columns가 변경될 때마다 강제로 리렌더링
  useEffect(() => {
    setForceUpdate((prev) => prev + 1)
  }, [columns])

  useEffect(() => {
    const handleEpicSelection = (e: Event) => {
      const { columnKey, initialData } = (e as CustomEvent).detail
      setPendingTaskData({ columnKey, initialData })
      setIsEpicModalOpen(true)
    }

    window.addEventListener('kanban:select-epic', handleEpicSelection)
    return () => {
      window.removeEventListener('kanban:select-epic', handleEpicSelection)
    }
  }, [])

  useEffect(() => {
    const handleTaskCompletion = (e: Event) => {
      const { taskId } = (e as CustomEvent).detail
      setCompletedTaskId(taskId)
      setIsMiniRetroOpen(true)
    }

    const handleOpenTaskModal = (e: Event) => {
      const { taskId } = (e as CustomEvent).detail
      for (const column of Object.values(columns)) {
        const task = column.find((t) => t.taskId === taskId)
        if (task) {
          setSelectedTaskForModal(task)
          break
        }
      }
    }

    window.addEventListener('kanban:task-completion', handleTaskCompletion)
    window.addEventListener('kanban:open-task-modal', handleOpenTaskModal)

    return () => {
      window.removeEventListener('kanban:task-completion', handleTaskCompletion)
      window.removeEventListener('kanban:open-task-modal', handleOpenTaskModal)
    }
  }, [columns])

  // URL 파라미터로부터 taskId를 가져와 모달 열기
  useEffect(() => {
    const taskId = searchParams.get('taskId')
    if (taskId) {
      // 모든 컬럼에서 해당 taskId를 가진 태스크 찾기
      for (const column of Object.values(columns)) {
        const task = column.find((t) => t.taskId === taskId)
        if (task) {
          setSelectedTaskForModal(task)
          break
        }
      }
    }
  }, [searchParams, columns])

  // 검색어에 따라 태스크를 필터링하는 함수
  const filterTasks = (tasks: Task[]) => {
    return tasks.filter((task) => {
      // 검색어 필터링만 클라이언트에서 수행
      return (
        !searchText ||
        task.title.toLowerCase().includes(searchText.toLowerCase())
      )
    })
  }

  // 필터링된 컬럼 데이터 생성
  const filteredColumns = {
    todo: filterTasks(columns.todo),
    inProgress: filterTasks(columns.inProgress),
    done: filterTasks(columns.done),
  }

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
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.delete('taskId')
    window.history.replaceState({}, '', newUrl.toString())
  }

  const handleTaskDelete = async (taskId: string) => {
    try {
      await deleteTask(taskId)

      // 삭제된 태스크를 모든 컬럼에서 제거
      Object.entries(columns).forEach(([columnKey, columnTasks]) => {
        const remainingTasks = columnTasks.filter(
          (task) => task.taskId !== taskId
        )
        setColumns((prev) => ({
          ...prev,
          [columnKey]: remainingTasks,
        }))
      })

      handleModalClose()
    } catch (error) {
      console.error('태스크 삭제 실패:', error)
      alert('태스크 삭제에 실패했습니다.')
    }
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
      review: {
        learn: string
        hardest: string
        next: string
      }
    }>
  ) => {
    try {
      // 서버에 업데이트 요청만 하고, 로컬 상태 업데이트는 하지 않음
      await updateTaskOnServer(taskId, data)

      // 모달에 표시된 태스크만 업데이트
      if (selectedTaskForModal?.taskId === taskId) {
        setSelectedTaskForModal((prev) => (prev ? { ...prev, ...data } : null))
      }
    } catch (error) {
      console.error('태스크 업데이트 실패:', error)
    }
  }

  const handleEpicSelect = async (epicId: string) => {
    if (!pendingTaskData) return

    const taskData: TaskCreateRequest = {
      ...pendingTaskData.initialData,
      epicId,
      projectId,
    }

    try {
      await handleAddTask(pendingTaskData.columnKey as any, taskData)
      setPendingTaskData(null)
      onTaskChange?.()
    } catch (error) {
      console.error('태스크 생성 실패:', error)
      alert('태스크 생성에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const handleMiniRetroClose = () => {
    setIsMiniRetroOpen(false)
    setCompletedTaskId(null)
  }

  const handleMiniRetroSave = () => {
    fetchTasks(filters)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    if (!event.over) return

    const { active, over } = event

    if (active.id === over.id) {
      return
    }

    try {
      await originalHandleDragEnd()
      onTaskChange?.()
    } catch (error) {
      console.error('태스크 상태 업데이트 실패:', error)
      alert('태스크 상태 업데이트에 실패했습니다. 다시 시도해주세요.')
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
  //       <LoadingScreen size={64} loading={loading} />
  //     </div>
  //   )
  // }

  return (
    <>
      <div className="text-[#121212]" key={forceUpdate}>
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
                    ({filteredColumns.todo.length})
                  </span>
                </div>
              }
              columnKey="todo"
              bg="bg-cm-gray-light rounded-none"
              tasks={filteredColumns.todo}
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
                    ({filteredColumns.inProgress.length})
                  </span>
                </div>
              }
              columnKey="inProgress"
              bg="bg-[#F3F9FC] rounded-none"
              tasks={filteredColumns.inProgress}
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
                    ({filteredColumns.done.length})
                  </span>
                </div>
              }
              columnKey="done"
              bg="bg-cm-green-light rounded-none"
              tasks={filteredColumns.done}
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
            task={selectedTaskForModal}
            isOpen={!!selectedTaskForModal}
            onClose={handleModalClose}
            members={members}
            onUpdate={updateTaskAndState}
            getTaskById={getTaskById}
            deleteTask={handleTaskDelete}
          />
        )}
      </div>

      {/* 에픽 선택 모달 */}
      <EpicSelectionModal
        isOpen={isEpicModalOpen}
        onClose={() => {
          setIsEpicModalOpen(false)
          setPendingTaskData(null)
        }}
        onSelect={handleEpicSelect}
        projectId={projectId}
        initialData={
          pendingTaskData?.initialData || {
            title: '',
            description: '',
            status: 'TODO',
            assigneeEmail: '',
            startDate: '',
            endDate: '',
            priority: 'MEDIUM',
            projectId: projectId,
            epicId: '',
          }
        }
      />

      {/* 미니 회고 Dialog */}
      <MiniRetroDialog
        isOpen={isMiniRetroOpen}
        onClose={handleMiniRetroClose}
        taskId={completedTaskId || ''}
        onSave={handleMiniRetroSave}
        getTaskById={getTaskById}
      />
    </>
  )
}
