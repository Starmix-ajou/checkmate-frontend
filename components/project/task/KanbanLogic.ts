import { useAuthStore } from '@/stores/useAuthStore'
import { ColumnType, Task } from '@/types/userTask'
import {
  DragOverEvent,
  MouseSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { useCallback, useEffect, useState } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

const EPICCUSTOM = '6821df1f4f10381b51dd11b1' //제발에픽의 Id

// API 엔드포인트 상수
const API_ENDPOINTS = {
  TASKS: `${API_BASE_URL}/task`,
  TASK_BY_ID: `${API_BASE_URL}/task`,
} as const

type TaskUpdateData = Partial<{
  title: string
  description: string
  status: Task['status']
  assigneeEmail: string
  startDate: string
  endDate: string
  priority: Task['priority']
  epicId: string
}>

type TaskFilters = {
  priority: Task['priority'] | 'ALL'
  epicTitle: string
  assigneeId: string[]
}

export function KanbanLogic(projectId: string) {
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
  const fetchTasks = useCallback(
    async (currentFilters: TaskFilters) => {
      if (!user?.accessToken) {
        console.log('인증 토큰이 없습니다.')
        setLoading(false)
        return
      }
      try {
        setError(null)
        setLoading(true)

        // 프로젝트의 모든 태스크 ID 가져오기
        const response = await fetch(
          `${API_ENDPOINTS.TASKS}?projectId=${projectId}`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${user.accessToken}`,
            },
            credentials: 'include',
          }
        )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const tasks: Task[] = await response.json()

        // 각 태스크의 상세 정보를 가져와서 필터링
        const filteredTasks = await Promise.all(
          tasks.map(async (task) => {
            const taskResponse = await fetch(
              `${API_ENDPOINTS.TASK_BY_ID}/${task.taskId}`,
              {
                method: 'GET',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${user.accessToken}`,
                },
                credentials: 'include',
              }
            )

            if (!taskResponse.ok) {
              throw new Error(`HTTP error! status: ${taskResponse.status}`)
            }

            const taskDetail: Task = await taskResponse.json()

            // 필터링 조건 확인
            const matchesPriority =
              currentFilters.priority === 'ALL' ||
              taskDetail.priority === currentFilters.priority

            const matchesEpic =
              !currentFilters.epicTitle ||
              taskDetail.epic.title === currentFilters.epicTitle

            const matchesAssignee =
              currentFilters.assigneeId.length === 0 ||
              currentFilters.assigneeId.includes(taskDetail.assignee.userId)

            return matchesPriority && matchesEpic && matchesAssignee
              ? taskDetail
              : null
          })
        )

        // null이 아닌 태스크만 필터링
        const validTasks = filteredTasks.filter(
          (task): task is Task => task !== null
        )

        // 태스크를 상태에 따라 분류
        const newColumns: Record<ColumnType, Task[]> = {
          todo: [],
          inProgress: [],
          done: [],
        }

        validTasks.forEach((task) => {
          if (!task.status) {
            console.warn('태스크에 status가 없습니다:', task)
            newColumns.todo.push({
              ...task,
              status: 'TODO',
            })
            return
          }

          const taskWithStatus = {
            ...task,
            status: task.status,
          }

          switch (task.status) {
            case 'TODO':
              newColumns.todo.push(taskWithStatus)
              break
            case 'IN_PROGRESS':
              newColumns.inProgress.push(taskWithStatus)
              break
            case 'DONE':
              newColumns.done.push(taskWithStatus)
              break
            default:
              console.warn('알 수 없는 태스크 상태:', task.status)
              newColumns.todo.push({
                ...task,
                status: 'TODO',
              })
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
    },
    [user?.accessToken, projectId]
  )

  useEffect(() => {
    fetchTasks({
      priority: 'ALL',
      epicTitle: '',
      assigneeId: [],
    })
  }, [fetchTasks])

  const findColumn = (taskId: string): ColumnType | null => {
    return (
      (Object.keys(columns) as ColumnType[]).find((key) =>
        columns[key].some((task) => task.taskId === taskId)
      ) || null
    )
  }

  const updateTask = async (
    taskId: string,
    taskData: TaskUpdateData
  ): Promise<void> => {
    if (!user?.accessToken) {
      throw new Error('인증 토큰이 없습니다.')
    }

    try {
      setLoading(true) // 로딩 시작
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
      // PUT 성공 후 전체 Task 목록을 다시 불러와서 setColumns 갱신
      await fetchTasks({
        priority: 'ALL',
        epicTitle: '',
        assigneeId: [],
      })
    } catch (error) {
      console.error('태스크 수정 실패:', error)
      setError(
        error instanceof Error
          ? error.message
          : '태스크 수정 중 오류가 발생했습니다.'
      )
      throw error
    } finally {
      setLoading(false) // 로딩 종료
    }
  }

  const handleTaskUpdate = async (taskId: string, data: TaskUpdateData) => {
    const task = Object.values(columns)
      .flat()
      .find((t) => t.taskId === taskId)

    if (!task) {
      console.error('태스크를 찾을 수 없습니다:', taskId)
      return
    }

    try {
      // 날짜를 로컬 시간대로 처리
      const formatDateToLocal = (dateStr: string) => {
        const date = new Date(dateStr)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      }

      const updateData: TaskUpdateData = {
        title: data.title || task.title,
        description: data.description || task.description,
        status: data.status || task.status,
        assigneeEmail: data.assigneeEmail || user?.email || '',
        startDate: data.startDate
          ? formatDateToLocal(data.startDate)
          : formatDateToLocal(task.startDate),
        endDate: data.endDate
          ? formatDateToLocal(data.endDate)
          : formatDateToLocal(task.endDate),
        priority: data.priority || task.priority || 'MEDIUM',
        epicId: data.epicId || EPICCUSTOM,
      }

      await updateTask(taskId, updateData)

      // 성공적으로 업데이트된 후 로컬 상태도 업데이트
      setColumns((prev) => {
        const newColumns = { ...prev }
        Object.keys(newColumns).forEach((key) => {
          const columnKey = key as ColumnType
          newColumns[columnKey] = newColumns[columnKey].map((t) =>
            t.taskId === taskId ? { ...t, ...updateData } : t
          )
        })
        return newColumns
      })
    } catch (error) {
      console.error('태스크 업데이트 실패:', error)
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
          ? 'TODO'
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
        priority: moved.priority || 'MEDIUM',
        epicId: EPICCUSTOM,
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

  const createTask = useCallback(
    async (
      taskData: TaskUpdateData & {
        title: string
        description: string
        status: Task['status']
        assigneeEmail: string
        startDate: string
        endDate: string
        priority: Task['priority']
        epicId: string
      }
    ): Promise<Task> => {
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
          body: JSON.stringify({
            ...taskData,
            priority: taskData.priority || 'MEDIUM', // 기본값 설정
          }),
        })

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

        // POST가 성공하면 전체 Task 목록을 가져옴
        const tasksResponse = await fetch(
          `${API_ENDPOINTS.TASKS}?projectId=${projectId}`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${user.accessToken}`,
            },
            credentials: 'include',
          }
        )

        if (!tasksResponse.ok) {
          throw new Error(`Task 목록 조회 실패: ${tasksResponse.status}`)
        }

        const tasks: Task[] = await tasksResponse.json()
        if (!Array.isArray(tasks)) {
          throw new Error('서버로부터 받은 Task 목록이 올바른 형식이 아닙니다.')
        }

        // Task 목록을 상태에 따라 분류
        const newColumns: Record<ColumnType, Task[]> = {
          todo: [],
          inProgress: [],
          done: [],
        }

        tasks.forEach((task) => {
          if (!task.status) {
            console.warn('태스크에 status가 없습니다:', task)
            newColumns.todo.push({
              ...task,
              status: 'TODO',
            })
            return
          }

          const taskWithStatus = {
            ...task,
            status: task.status,
          }

          switch (task.status) {
            case 'TODO':
              newColumns.todo.push(taskWithStatus)
              break
            case 'IN_PROGRESS':
              newColumns.inProgress.push(taskWithStatus)
              break
            case 'DONE':
              newColumns.done.push(taskWithStatus)
              break
            default:
              console.warn('알 수 없는 태스크 상태:', task.status)
              newColumns.todo.push({
                ...task,
                status: 'TODO',
              })
          }
        })

        // 상태 업데이트
        setColumns(newColumns)

        // 새로 생성된 Task 찾기 (제목과 상태로 찾음)
        const newTask = tasks.find(
          (task) =>
            task.title === taskData.title && task.status === taskData.status
        )

        if (!newTask) {
          console.error('생성된 Task를 찾을 수 없습니다:', {
            taskData,
            allTasks: tasks,
          })
          throw new Error('생성된 Task를 찾을 수 없습니다.')
        }

        return newTask
      } catch (error) {
        console.error('태스크 생성 실패:', error)
        throw error
      }
    },
    [user?.accessToken, projectId, setColumns]
  )

  const handleAddTask = useCallback(
    async (columnKey: ColumnType) => {
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
              : 'TODO'

        await createTask({
          title: 'New Task',
          description: '',
          status: initialStatus,
          assigneeEmail: user?.email || '',
          startDate: today,
          endDate: nextWeek,
          priority: 'MEDIUM',
          epicId: EPICCUSTOM,
        })
      } catch (error) {
        console.error('태스크 생성 실패:', error)
      }
    },
    [user?.email, createTask]
  )

  useEffect(() => {
    const handleAddTaskEvent = (e: Event) => {
      const { columnKey } = (e as CustomEvent).detail as {
        columnKey: ColumnType
      }
      handleAddTask(columnKey)
    }

    window.addEventListener('kanban:add-task', handleAddTaskEvent)
    return () => {
      window.removeEventListener('kanban:add-task', handleAddTaskEvent)
    }
  }, [user?.email, handleAddTask])

  const deleteTask = async (taskId: string): Promise<void> => {
    if (!user?.accessToken) {
      throw new Error('인증 토큰이 없습니다.')
    }

    try {
      console.log('태스크 삭제 요청:', taskId)
      const response = await fetch(`${API_ENDPOINTS.TASKS}/${taskId}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.accessToken}`,
        },
        credentials: 'include',
      })

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

      console.log('태스크 삭제 성공:', taskId)
    } catch (error) {
      console.error('태스크 삭제 실패:', error)
      throw error
    }
  }

  const getTaskById = async (taskId: string): Promise<Task> => {
    if (!user?.accessToken) {
      throw new Error('인증 토큰이 없습니다.')
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.TASK_BY_ID}/${taskId}`, {
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

      const task: Task = await response.json()
      return task
    } catch (error) {
      console.error('태스크 조회 실패:', error)
      throw error
    }
  }

  return {
    columns,
    loading,
    error,
    activeTask,
    setActiveTask,
    sensors,
    handleDragOver,
    handleDragEnd,
    handleAddTask,
    handleTaskUpdate,
    setColumns,
    deleteTask,
    getTaskById,
    fetchTasks,
  }
}
