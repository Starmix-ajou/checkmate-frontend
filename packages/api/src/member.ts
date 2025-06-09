import { Position } from '@cm/types/NewProjectTeamMember'
import { Member } from '@cm/types/project'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export async function getProjectMembers(
  projectId: string,
  accessToken: string
): Promise<{
  members: Member[]
  leader: Member
  productManager: Member
}> {
  const response = await fetch(`${API_BASE_URL}/project/${projectId}/member`, {
    headers: {
      Accept: '*/*',
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error('프로젝트 멤버 정보 불러오기 실패')
  }

  return response.json()
}

export async function updateMemberPositions(
  projectId: string,
  memberId: string,
  positions: string[],
  accessToken: string
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/project/${projectId}/member/${memberId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ positions }),
    }
  )

  if (!response.ok) {
    throw new Error('멤버 포지션 수정 실패')
  }
}

export async function removeMember(
  projectId: string,
  memberId: string,
  accessToken: string
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/project/${projectId}/member/${memberId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error('멤버 삭제 실패')
  }
}

export async function addMember(
  projectId: string,
  email: string,
  positions: Position[],
  role: string,
  accessToken: string
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/project/${projectId}/member`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      email,
      profile: {
        positions,
      },
      role: role,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    switch (response.status) {
      case 400:
        throw new Error('이미 프로젝트에 참여중인 사용자입니다.')
      case 401:
        throw new Error('권한이 없습니다. 다시 로그인해주세요.')
      case 403:
        throw new Error('프로젝트 멤버를 추가할 권한이 없습니다.')
      case 404:
        throw new Error('해당 이메일의 사용자를 찾을 수 없습니다.')
      case 409:
        throw new Error('이미 프로젝트에 참여 중인 멤버입니다.')
      default:
        throw new Error(errorData.message || '멤버 추가에 실패했습니다.')
    }
  }
}
