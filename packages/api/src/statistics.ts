import { Project } from '@cm/types/project'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export interface ProjectStatistics {
  project: Project
  statistics: {
    todoCount: number
    inProgressCount: number
    doneCount: number
    totalCount: number
    doneRate: number
  }
}

export interface DailyScrumStatistics {
  project: Project
  statistics: {
    totalDays: number
    doneDays: number
    doneRate: number
  }
}

export interface ReviewStatistics {
  project: Project
  statistics: {
    totalCount: number
    doneCount: number
    doneRate: number
  }
}

export interface ProjectStatisticsResponse {
  taskStatistics: ProjectStatistics[]
  dailyScrumStatistics: DailyScrumStatistics[]
  reviewStatistics: ReviewStatistics[]
}

export const getProjectStatistics = async (
  accessToken: string,
  timestamp?: string
) => {
  const queryParams = timestamp ? `?timestamp=${timestamp}` : ''
  const response = await fetch(
    `${API_BASE_URL}/project/statistics${queryParams}`,
    {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error('프로젝트 통계 정보를 가져오는데 실패했습니다.')
  }

  return response.json() as Promise<ProjectStatisticsResponse>
}
