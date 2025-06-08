const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

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
