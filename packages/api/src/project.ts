import { ProjectBrief } from '@cm/types/project'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export async function getProjectBrief(projectId: string, accessToken: string): Promise<ProjectBrief> {
  const response = await fetch(`${API_BASE_URL}/project/${projectId}/brief`, {
    headers: {
      Accept: '*/*',
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error('프로젝트 요약 정보 불러오기 실패')
  }

  return response.json()
}