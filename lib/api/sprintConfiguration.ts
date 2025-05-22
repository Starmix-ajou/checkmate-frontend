import { useAuthStore } from '@/stores/useAuthStore'
import { Member } from '@/types/project'
import {
  IncompletedTask,
  SprintUpdateRequest,
  TaskResponse,
} from '@/types/sprint'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
const API_ENDPOINTS = {
  TASKS: `${API_BASE_URL}/task`,
  SPRINT: `${API_BASE_URL}/sprint`,
} as const

export const getIncompletedTasks = async (
  projectId: string
): Promise<IncompletedTask[]> => {
  const user = useAuthStore.getState().user

  if (!user?.accessToken) {
    throw new Error('인증 토큰이 없습니다.')
  }

  const queryParams = new URLSearchParams({
    projectId,
  })

  const response = await fetch(
    `${API_ENDPOINTS.TASKS}?${queryParams.toString()}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.accessToken}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const tasks = await response.json()

  return tasks.map((task: TaskResponse, index: number) => ({
    id: index + 1,
    taskId: task.taskId,
    title: task.title,
    position: task.assignee?.profiles?.[0]?.positions?.[0] || '미지정',
    selected: false,
  }))
}

export const createSprint = async (
  projectId: string,
  pendingTaskIds: string[]
): Promise<void> => {
  const user = useAuthStore.getState().user

  if (!user?.accessToken) {
    throw new Error('인증 토큰이 없습니다.')
  }

  const queryParams = new URLSearchParams({
    projectId,
  })

  const response = await fetch(
    `${API_ENDPOINTS.SPRINT}?${queryParams.toString()}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.accessToken}`,
      },
      body: JSON.stringify({
        pendingTaskIds,
      }),
    }
  )

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
}

export async function getProjectMembers(projectId: string): Promise<Member[]> {
  const user = useAuthStore.getState().user

  if (!user?.accessToken) {
    throw new Error('인증 토큰이 없습니다.')
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/project/${projectId}`,
    {
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error('프로젝트 멤버 정보를 가져오는데 실패했습니다.')
  }

  const data = await response.json()
  return data.members || []
}
export async function updateSprint(
  projectId: string,
  data: SprintUpdateRequest[]
): Promise<void> {
  const user = useAuthStore.getState().user

  if (!user?.accessToken) {
    throw new Error('인증 토큰이 없습니다.')
  }

  console.log(data)

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/sprint?projectId=${projectId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.accessToken}`,
      },
      body: JSON.stringify(data),
    }
  )

  if (!response.ok) {
    throw new Error('스프린트 수정에 실패했습니다.')
  }
}
