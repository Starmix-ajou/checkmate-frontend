import { Project, ProjectBrief, ProjectListItem } from '@cm/types/project'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export async function getProjectBrief(
  projectId: string,
  accessToken: string
): Promise<ProjectBrief> {
  const response = await fetch(
    `${API_BASE_URL}/manager/project/${projectId}/brief`,
    {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error('프로젝트 요약 정보 불러오기 실패')
  }

  return response.json()
}

export async function approveProjectInvite(
  projectId: string,
  accessToken: string
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/manager/project/${projectId}/approve`,
    {
      method: 'POST',
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error('프로젝트 초대 수락 실패')
  }
}

export async function denyProjectInvite(
  projectId: string,
  accessToken: string
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/manager/project/${projectId}/deny`,
    {
      method: 'GET',
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error('프로젝트 초대 거절 실패')
  }
}

export async function getProject(
  projectId: string,
  accessToken: string
): Promise<Project> {
  const response = await fetch(`${API_BASE_URL}/manager/project/${projectId}`, {
    headers: {
      Accept: '*/*',
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error('프로젝트 정보 불러오기 실패')
  }

  return response.json()
}

export async function getProjects(
  accessToken: string,
  status?: string
): Promise<ProjectListItem[]> {
  const queryParams = new URLSearchParams()
  if (status) {
    queryParams.append('status', status)
  }

  const response = await fetch(
    `${API_BASE_URL}/manager/project?${queryParams.toString()}`,
    {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error('프로젝트 불러오기 실패')
  }

  return response.json()
}

export interface ProjectStatistics {
  taskStatistics: {
    todoCount: number
    inProgressCount: number
    doneCount: number
    totalCount: number
    doneRate: number
  }
  dailyScrumStatistics: {
    totalDays: number
    doneDays: number
    doneRate: number
  }
  reviewStatistics?: {
    totalCount: number
    doneCount: number
    doneRate: number
  } | null
}

export async function getProjectStatistics(
  projectId: string,
  accessToken: string
): Promise<ProjectStatistics> {
  const response = await fetch(
    `${API_BASE_URL}/manager/project/${projectId}/statistics`,
    {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error('프로젝트 통계 정보 불러오기 실패')
  }

  return response.json()
}
