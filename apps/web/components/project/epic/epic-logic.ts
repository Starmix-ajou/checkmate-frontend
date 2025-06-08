import { useEpicProgress } from '@/hooks/useEpicProgress'
import { useAuthStore } from '@/stores/useAuthStore'
import { Epic } from '@cm/types/epic'
import { useCallback, useEffect, useState } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
const API_ENDPOINTS = {
  EPICS: `${API_BASE_URL}/epic`,
} as const

export function useEpicLogic(projectId: string, sprintId?: string) {
  const user = useAuthStore((state) => state.user)
  const [epics, setEpics] = useState<Epic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEpics = useCallback(async () => {
    if (!user?.accessToken) {
      console.log('인증 토큰이 없습니다.')
      setLoading(false)
      return
    }

    try {
      setError(null)
      setLoading(true)

      const queryParams = new URLSearchParams({
        projectId,
        ...(sprintId && { sprintId }),
      })

      const response = await fetch(
        `${API_ENDPOINTS.EPICS}?${queryParams.toString()}`,
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

      const data: Epic[] = await response.json()
      setEpics(data)
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : '알 수 없는 오류가 발생했습니다.'
      console.error('Epic 불러오기 실패:', error)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [user?.accessToken, projectId, sprintId])

  useEffect(() => {
    fetchEpics()
  }, [fetchEpics])

  return {
    epics,
    loading,
    error,
    refetch: fetchEpics,
  }
}

export const calculateEpicProgress = (epic: Epic) => {
  const { progress } = useEpicProgress(epic)
  return progress
}

export const formatProgress = (progress: number) => {
  return `${progress}%`
}
