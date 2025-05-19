import { API_BASE_URL } from '@/lib/constants'

interface UpdateProjectSettingsParams {
  projectId: string
  title: string
  description: string
  imageUrl: string
  endDate: string
}

export const putProjectSettings = async ({
  projectId,
  title,
  description,
  imageUrl,
  endDate,
}: UpdateProjectSettingsParams) => {
  const response = await fetch(`${API_BASE_URL}/project/${projectId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
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

  return response.json()
}

interface deleteProjectParams {
  projectId: string
}

export const deleteProject = async ({
  projectId,
}: deleteProjectParams) => {
  const response = await fetch(`${API_BASE_URL}/project/${projectId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('프로젝트 삭제에 실패했습니다')
  }

  return response.json()
}
