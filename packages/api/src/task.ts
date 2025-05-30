import { Task } from '@cm/types/project'
import { API_BASE_URL } from './constants'

export const getProjectTasks = async (
  projectId: string,
  accessToken: string
): Promise<Task[]> => {
  if (!accessToken) {
    throw new Error('인증 토큰이 없습니다.')
  }

  const queryParams = new URLSearchParams({
    projectId,
  })

  const response = await fetch(
    `${API_BASE_URL}/task?${queryParams.toString()}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
} 