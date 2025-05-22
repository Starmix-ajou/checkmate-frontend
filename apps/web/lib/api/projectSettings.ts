import { API_BASE_URL } from '@/lib/constants'

interface UpdateProjectSettingsParams {
  projectId: string
  title: string
  description: string
  imageUrl: string
  endDate: string
  accessToken: string
}

export const putProjectSettings = async ({
  projectId,
  title,
  description,
  imageUrl,
  endDate,
  accessToken,
}: UpdateProjectSettingsParams) => {
  const response = await fetch(`${API_BASE_URL}/project/${projectId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      title,
      description,
      imageUrl,
      endDate,
    }),
  })

  if (!response.ok) {
    throw new Error('프로젝트 설정 업데이트에 실패했습니다')
  }
}

interface deleteProjectParams {
  projectId: string
  accessToken: string
}

export const deleteProject = async ({
  projectId,
  accessToken,
}: deleteProjectParams) => {
  const response = await fetch(`${API_BASE_URL}/project/${projectId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error('프로젝트 삭제에 실패했습니다')
  }

  return response.json()
}
