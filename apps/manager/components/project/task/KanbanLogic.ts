import { useAuthStore } from '@/stores/useAuthStore'
import { ColumnType, Task, TaskCreateRequest } from '@cm/types/userTask'
import {
  DragOverEvent,
  MouseSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { useCallback, useEffect, useRef, useState } from 'react'

import { showTaskCompletionToast } from './TaskCompletionToast'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

const EPICCUSTOM = '682c6163b1db4571f3c0490f' // 햄주트의 epicId

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
  projectId: string
  review: {
    learn: string
    hardest: string
    next: string
  }
}>

type TaskFilters = {
  priority: Task['priority'] | 'ALL'
  epicId: string
  sprintId: string
  assigneeEmails: string[]
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
  const isFetching = useRef(false)

  // tasks 데이터 가져오기
  const fetchTasks = useCallback(
    async (currentFilters: TaskFilters) => {
      if (!user?.accessToken) {
        console.log('인증 토큰이 없습니다.')
        setLoading(false)
        return
      }

      // 이미 요청 중이면 중복 요청 방지
      if (isFetching.current) return
      isFetching.current = true

      try {
        setError(null)
        setLoading(true)

        // 필터링 파라미터 구성
        const queryParams = new URLSearchParams({
          projectId,
          ...(currentFilters.sprintId && {
            sprintId: currentFilters.sprintId,
          }),
          ...(!currentFilters.sprintId &&
            currentFilters.priority !== 'ALL' && {
              priority: currentFilters.priority,
            }),
          ...(!currentFilters.sprintId &&
            currentFilters.epicId && {
              epicId: currentFilters.epicId,
            }),
          ...(!currentFilters.sprintId &&
            currentFilters.assigneeEmails?.length > 0 && {
              assigneeEmail: currentFilters.assigneeEmails.join(','),
            }),
        })

        // 프로젝트의 모든 태스크를 필터링과 함께 가져오기
        const response = await fetch(
          `${API_ENDPOINTS.TASKS}?${queryParams.toString()}`,
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

        // 태스크를 상태에 따라 분류
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
        isFetching.current = false
      }
    },
    [user?.accessToken, projectId]
  )

  useEffect(() => {
    const initialFilters: TaskFilters = {
      priority: 'ALL',
      epicId: '',
      sprintId: '',
      assigneeEmails: [],
    }
    fetchTasks(initialFilters)
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
      const requestData = {
        ...taskData,
        projectId: projectId,
      }
      console.log('태스크 수정 요청 데이터:', { taskId, ...requestData })

      const response = await fetch(`${API_ENDPOINTS.TASKS}/${taskId}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.accessToken}`,
        },
        credentials: 'include',
        body: JSON.stringify(requestData),
      })

      console.log('서버 응답 상태:', response.status)
      console.log(
        '서버 응답 헤더:',
        Object.fromEntries(response.headers.entries())
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        console.error('서버 에러 응답:', errorData)
        throw new Error(
          errorData?.message || `HTTP error! status: ${response.status}`
        )
      }

      // 응답이 있는 경우에만 JSON 파싱 시도
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const responseData = await response.json()
        console.log('태스크 수정 성공 응답:', responseData)
      } else {
        console.log('태스크 수정 성공 (응답 없음)')
      }

      // PUT 성공 후 전체 Task 목록을 다시 불러와서 setColumns 갱신
      await fetchTasks({
        priority: 'ALL',
        epicId: '',
        sprintId: '',
        assigneeEmails: [],
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

      // 필수 필드 확인
      if (!task.title || !task.status || !task.startDate || !task.endDate) {
        console.error('태스크에 필수 필드가 누락되었습니다:', task)
        return
      }

      // 현재 태스크의 정보를 가져와서 epicId 확인
      const currentTask = await getTaskById(taskId)
      const currentEpicId = currentTask.epic.epicId

      const updateData: TaskUpdateData = {
        title: data.title || task.title,
        description: data.description || task.description || '',
        status: data.status || task.status,
        assigneeEmail: data.assigneeEmail || user?.email || '',
        startDate: data.startDate
          ? formatDateToLocal(data.startDate)
          : formatDateToLocal(task.startDate),
        endDate: data.endDate
          ? formatDateToLocal(data.endDate)
          : formatDateToLocal(task.endDate),
        priority: data.priority || task.priority || 'MEDIUM',
        epicId: data.epicId || currentEpicId || EPICCUSTOM,
        projectId: projectId,
        review: data.review ||
          task.review || {
            learn: '',
            hardest: '',
            next: '',
          },
      }

      console.log('태스크 업데이트 데이터:', updateData)
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
      throw error
    }
  }

  const handleDragOver = async (event: DragOverEvent) => {
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

      // 현재 태스크의 정보를 가져와서 epicId 확인
      const currentTask = await getTaskById(moved.taskId)
      const currentEpicId = currentTask.epic.epicId

      const updateData: TaskUpdateData = {
        title: moved.title,
        description: moved.description,
        status: newStatus,
        assigneeEmail: user?.email || '',
        startDate: moved.startDate,
        endDate: moved.endDate,
        priority: moved.priority || 'MEDIUM',
        epicId: currentEpicId || EPICCUSTOM,
        projectId: projectId,
        review: moved.review || {
          learn: '',
          hardest: '',
          next: '',
        },
      }

      updateTask(moved.taskId, updateData).catch((error) => {
        console.error('태스크 상태 업데이트 실패:', error)
        // 실패 시 원래 상태로 되돌림
        setColumns((prev) => ({
          ...prev,
          [fromColumn]: [...fromTasks, moved],
          [toColumn]: toTasks.filter((task) => task.taskId !== moved.taskId),
        }))
      })

      // Done 열로 이동했을 때 토스트 메시지 표시
      if (toColumn === 'done') {
        showTaskCompletionToast({
          onWriteNow: () => {
            const event = new CustomEvent('kanban:task-completion', {
              detail: {
                taskId: moved.taskId,
              },
            })
            window.dispatchEvent(event)
          },
        })
      }
    }
  }

  const handleDragEnd = () => {
    setActiveTask(null)
  }

  const createTask = useCallback(
    async (taskData: TaskCreateRequest): Promise<Task> => {
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

        console.log('서버 응답 상태:', response.status)
        console.log(
          '서버 응답 헤더:',
          Object.fromEntries(response.headers.entries())
        )

        const responseText = await response.text()
        console.log('서버 응답 내용:', responseText)

        if (!response.ok) {
          let errorMessage = '요청을 처리하는 중 오류가 발생했습니다.'
          try {
            const errorData = JSON.parse(responseText)
            errorMessage = errorData.message || errorMessage
          } catch (e) {
            console.error('JSON 파싱 실패:', e)
          }
          throw new Error(errorMessage)
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
        console.log('서버에서 받은 전체 태스크 목록:', tasks)

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
    async (columnKey: ColumnType, taskData?: TaskCreateRequest) => {
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

        if (taskData) {
          await createTask(taskData)
        } else {
          // 에픽 선택 이벤트 발생
          const epicSelectionEvent = new CustomEvent('kanban:select-epic', {
            detail: {
              columnKey,
              initialData: {
                title: 'New Task',
                description: '',
                status: initialStatus,
                assigneeEmail: user?.email || '',
                startDate: today,
                endDate: nextWeek,
                priority: 'MEDIUM',
                projectId: projectId,
              },
            },
          })
          window.dispatchEvent(epicSelectionEvent)
        }
      } catch (error) {
        console.error('태스크 생성 실패:', error)
      }
    },
    [user?.email, projectId, createTask]
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
