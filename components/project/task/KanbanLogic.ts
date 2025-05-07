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

    console.log(user.accessToken)

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

  const updateTask = async (
    taskId: string,
    taskData: {
      title: string
      description: string
      status: 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'DONE'
      assigneeEmail: string
      startDate: string
      endDate: string
      priority: 'LOW' | 'MEDIUM' | 'HIGH'
      epicId: string
    }
  ): Promise<void> => {
    if (!user?.accessToken) {
      throw new Error('인증 토큰이 없습니다.')
    }

    try {
      console.log('태스크 수정 요청 데이터:', { taskId, ...taskData })
      const response = await fetch(`${API_ENDPOINTS.TASKS}/${taskId}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.accessToken}`,
        },
        credentials: 'include',
        body: JSON.stringify(taskData),
      })

      console.log('서버 응답 상태:', response.status)
      console.log(
        '서버 응답 헤더:',
        Object.fromEntries(response.headers.entries())
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(
          errorData?.message || `HTTP error! status: ${response.status}`
        )
      }

      console.log('태스크 수정 성공')
    } catch (error) {
      console.error('태스크 수정 실패:', error)
      throw error
    }
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

      // 태스크 상태 업데이트
      const newStatus =
        toColumn === 'todo'
          ? 'BACKLOG'
          : toColumn === 'inProgress'
            ? 'IN_PROGRESS'
            : 'DONE'

      updateTask(moved.taskId, {
        title: moved.title,
        description: moved.description,
        status: newStatus,
        assigneeEmail: user?.email || '',
        startDate: moved.startDate,
        endDate: moved.endDate,
        priority: moved.priority,
        epicId: '681b655c1706bf2324042897',
        // epicId: moved.epic.epicId, // 임시로 고정된 epicId 사용
      }).catch((error) => {
        console.error('태스크 상태 업데이트 실패:', error)
        // 실패 시 원래 상태로 되돌림
        setColumns((prev) => ({
          ...prev,
          [fromColumn]: [...fromTasks, moved],
          [toColumn]: toTasks.filter((task) => task.taskId !== moved.taskId),
        }))
      })
    }
  }

  const handleDragEnd = () => {
    setActiveTask(null)
  }

  const createTask = async (taskData: {
    title: string
    description: string
    status: 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'DONE'
    assigneeEmail: string
    startDate: string
    endDate: string
    priority: 'LOW' | 'MEDIUM' | 'HIGH'
    epicId: string
  }): Promise<Task> => {
    if (!user?.accessToken) {
      throw new Error('인증 토큰이 없습니다.')
    }

    try {
      console.log('태스크 생성 요청 데이터:', taskData)
      const response = await fetch(API_ENDPOINTS.TASKS, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.accessToken}`,
        },
        credentials: 'include',
        body: JSON.stringify(taskData),
      })
      console.log(user.accessToken)

      console.log('서버 응답 상태:', response.status)
      console.log(
        '서버 응답 헤더:',
        Object.fromEntries(response.headers.entries())
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(
          errorData?.message || `HTTP error! status: ${response.status}`
        )
      }

      // 서버 응답이 없는 경우 클라이언트에서 임시 태스크 생성
      const newTask: Task = {
        taskId: `task-${Date.now()}`,
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        assignee: {
          userId: '',
          name: '',
          email: taskData.assigneeEmail,
          profileImageUrl: '',
          profiles: [],
          role: '',
        },
        startDate: taskData.startDate,
        endDate: taskData.endDate,
        priority: taskData.priority,
        epic: {
          epicId: taskData.epicId,
          title: '',
          description: '',
          projectId: '',
        },
        completed: false,
      }

      console.log('새 태스크 생성 성공:', newTask)

      // 새 태스크를 적절한 컬럼에 추가
      setColumns((prev) => {
        const newColumns = { ...prev }
        const columnKey =
          newTask.status === 'IN_PROGRESS'
            ? 'inProgress'
            : newTask.status === 'DONE'
              ? 'done'
              : 'todo'
        newColumns[columnKey] = [...newColumns[columnKey], newTask]
        return newColumns
      })

      return newTask
    } catch (error) {
      console.error('태스크 생성 실패:', error)
      throw error
    }
  }

  useEffect(() => {
    const handleAddTask = async (e: Event) => {
      const { columnKey } = (e as CustomEvent).detail as {
        columnKey: ColumnType
      }

      try {
        const today = new Date().toISOString().split('T')[0]
        const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0]

        // columnKey에 따라 초기 상태 설정
        const initialStatus =
          columnKey === 'inProgress'
            ? 'IN_PROGRESS'
            : columnKey === 'done'
              ? 'DONE'
              : 'BACKLOG'

        await createTask({
          title: 'New Task',
          description: '',
          status: initialStatus,
          assigneeEmail: user?.email || '',
          startDate: today,
          endDate: nextWeek,
          priority: 'MEDIUM',
          epicId: '681b655c1706bf2324042897', // 임시로 고정된 epicId 사용
        })
      } catch (error) {
        console.error('태스크 생성 실패:', error)
      }
    }

    window.addEventListener('kanban:add-task', handleAddTask)
    return () => {
      window.removeEventListener('kanban:add-task', handleAddTask)
    }
  }, [user?.email, createTask])

  return {
    columns,
    activeTask,
    setActiveTask,
    sensors,
    handleDragOver,
    handleDragEnd,
    loading,
    error,
    setColumns,
  }
}
