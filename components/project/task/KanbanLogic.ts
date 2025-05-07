import { useAuthStore } from '@/stores/useAuthStore'
import { ColumnType, Task } from '@/types/userTask'
import {
  DragOverEvent,
  MouseSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { useEffect, useState } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

// API 엔드포인트 상수
const API_ENDPOINTS = {
  TASKS: `${API_BASE_URL}/task`,
} as const

export function KanbanLogic() {
  const user = useAuthStore((state) => state.user)
  const [columns, setColumns] = useState<Record<ColumnType, Task[]>>({
    todo: [],
    inProgress: [],
    done: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const sensors = useSensors(useSensor(MouseSensor))

  // tasks 데이터 가져오기
  useEffect(() => {
    if (!user?.accessToken) {
      console.log('인증 토큰이 없습니다.')
      setLoading(false)
      return
    }

    const fetchTasks = async () => {
      try {
        setError(null)

        const response = await fetch(API_ENDPOINTS.TASKS, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.accessToken}`,
          },
          credentials: 'include',
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => null)
          throw new Error(
            errorData?.message || `HTTP error! status: ${response.status}`
          )
        }

        const tasks: Task[] = await response.json()

        if (!Array.isArray(tasks)) {
          throw new Error('서버로부터 받은 데이터가 배열이 아닙니다.')
        }

        // 태스크를 상태에 따라 분류
        const newColumns: Record<ColumnType, Task[]> = {
          todo: [],
          inProgress: [],
          done: [],
        }

        tasks.forEach((task) => {
          if (!task.status) {
            console.warn('태스크에 status가 없습니다:', task)
            newColumns.todo.push(task)
            return
          }

          switch (task.status) {
            case 'BACKLOG':
            case 'TODO':
              newColumns.todo.push(task)
              break
            case 'IN_PROGRESS':
              newColumns.inProgress.push(task)
              break
            case 'DONE':
              newColumns.done.push(task)
              break
            default:
              console.warn('알 수 없는 태스크 상태:', task.status)
              newColumns.todo.push(task)
          }
        })

        setColumns(newColumns)
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : '알 수 없는 오류가 발생했습니다.'
        console.error('태스크 불러오기 실패:', error)
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [user?.accessToken])

  const findColumn = (taskId: string): ColumnType | null => {
    return (
      (Object.keys(columns) as ColumnType[]).find((key) =>
        columns[key].some((task) => task.taskId === taskId)
      ) || null
    )
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const activeId = active.id.toString()
    const overId = over.id.toString()

    const fromColumn = findColumn(activeId)
    const toColumn =
      findColumn(overId) ||
      (['todo', 'inProgress', 'done'].includes(overId)
        ? (overId as ColumnType)
        : null)

    if (!fromColumn || !toColumn) return

    const fromTasks = [...columns[fromColumn]]
    const toTasks = [...columns[toColumn]]

    const fromIndex = fromTasks.findIndex((task) => task.taskId === activeId)
    const toIndex = toTasks.findIndex((task) => task.taskId === overId)

    if (fromColumn === toColumn) {
      const updated = [...toTasks]
      const [moved] = updated.splice(fromIndex, 1)
      updated.splice(toIndex, 0, moved)

      setColumns((prev) => ({
        ...prev,
        [fromColumn]: updated,
      }))
    } else {
      const [moved] = fromTasks.splice(fromIndex, 1)
      toTasks.splice(toIndex === -1 ? toTasks.length : toIndex, 0, moved)

      setColumns((prev) => ({
        ...prev,
        [fromColumn]: fromTasks,
        [toColumn]: toTasks,
      }))

      // TODO: 상태 업데이트 API 엔드포인트가 준비되면 구현
      console.log('태스크 상태 업데이트 필요:', {
        taskId: moved.taskId,
        newStatus:
          toColumn === 'todo'
            ? 'TODO'
            : toColumn === 'inProgress'
              ? 'IN_PROGRESS'
              : 'DONE',
      })
    }
  }

  const handleDragEnd = () => {
    setActiveTask(null)
  }

  useEffect(() => {
    const handleAddTask = (e: Event) => {
      const { columnKey, newTask } = (e as CustomEvent).detail as {
        columnKey: ColumnType
        newTask: Task
      }
      setColumns((prev) => ({
        ...prev,
        [columnKey]: [...prev[columnKey], newTask],
      }))
    }

    window.addEventListener('kanban:add-task', handleAddTask)
    return () => {
      window.removeEventListener('kanban:add-task', handleAddTask)
    }
  }, [])

  return {
    columns,
    activeTask,
    setActiveTask,
    sensors,
    handleDragOver,
    handleDragEnd,
    loading,
    error,
  }
}
