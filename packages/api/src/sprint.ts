import { Sprint } from '@cm/types/sprint'

export interface GetSprintsResponse {
  sprints: Sprint[]
}

export const getSprints = async (projectId: string, accessToken: string): Promise<GetSprintsResponse> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sprint?projectId=${projectId}`, {
    headers: {
      Accept: '*/*',
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error('스프린트 정보를 불러오는데 실패했습니다.')
  }

  const sprints = await response.json()
  return { sprints }
} 