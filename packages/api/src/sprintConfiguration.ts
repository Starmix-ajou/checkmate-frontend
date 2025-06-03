import { Member } from '@cm/types/project'
import {
  IncompletedTask,
  SprintUpdateRequest,
  TaskResponse,
} from '@cm/types/sprint'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
const API_ENDPOINTS = {
  TASKS: `${API_BASE_URL}/task`,
  SPRINT: `${API_BASE_URL}/sse/sprint`,
} as const

export const getIncompletedTasks = async (
  projectId: string,
  accessToken: string
): Promise<IncompletedTask[]> => {
  if (!accessToken) {
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
        Authorization: `Bearer ${accessToken}`,
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
  pendingTaskIds: string[],
  accessToken: string
): Promise<void> => {
  if (!accessToken) {
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
        Authorization: `Bearer ${accessToken}`,
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

export async function getProjectMembers(
  projectId: string,
  accessToken: string
): Promise<Member[]> {
  if (!accessToken) {
    throw new Error('인증 토큰이 없습니다.')
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/project/${projectId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
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
  data: SprintUpdateRequest[],
  accessToken: string
): Promise<void> {
  if (!accessToken) {
    throw new Error('인증 토큰이 없습니다.')
  }

  console.log(data)
  const queryParams = new URLSearchParams({
    projectId,
  })

  const response = await fetch(
    `${API_ENDPOINTS.SPRINT}?${queryParams.toString()}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    }
  )

  if (!response.ok) {
    throw new Error('스프린트 수정에 실패했습니다.')
  }
}
