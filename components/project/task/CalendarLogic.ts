import { useAuthStore } from '@/stores/useAuthStore'
import { Task } from '@/types/userTask'
import { useCallback, useEffect, useRef, useState } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

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
  epicId: string
  sprintId: string
  assigneeEmails: string[]
}

export function CalendarLogic(projectId: string) {
  const user = useAuthStore((state) => state.user)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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
          ...(currentFilters.priority !== 'ALL' && {
            priority: currentFilters.priority,
          }),
          ...(currentFilters.epicId && {
            epicId: currentFilters.epicId,
          }),
          ...(currentFilters.sprintId && {
            sprintId: currentFilters.sprintId,
          }),
          ...(currentFilters.assigneeEmails?.length > 0 && {
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
        setTasks(tasks)
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

  const handleTaskUpdate = async (taskId: string, data: TaskUpdateData) => {
    if (!user?.accessToken) {
      throw new Error('인증 토큰이 없습니다.')
    }

    try {
      setLoading(true)
      console.log('태스크 수정 요청 데이터:', data)
      const response = await fetch(`${API_ENDPOINTS.TASKS}/${taskId}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.accessToken}`,
        },
        credentials: 'include',
        body: JSON.stringify(data),
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
      // PUT 성공 후 전체 Task 목록을 다시 불러와서 setTasks 갱신
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
      setLoading(false)
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

  // 초기 데이터 로딩
  useEffect(() => {
    const initialFilters: TaskFilters = {
      priority: 'ALL',
      epicId: '',
      sprintId: '',
      assigneeEmails: [],
    }
    fetchTasks(initialFilters)
  }, [fetchTasks])

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    handleTaskUpdate,
    getTaskById,
  }
}
