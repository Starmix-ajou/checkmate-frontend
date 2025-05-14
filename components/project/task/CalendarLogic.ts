import { useAuthStore } from '@/stores/useAuthStore'
import { Task } from '@/types/userTask'
import { useCallback, useEffect, useRef, useState } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

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
          `${API_BASE_URL}/task?${queryParams.toString()}`,
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
  }
}
