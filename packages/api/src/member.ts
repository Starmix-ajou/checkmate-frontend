import { Member } from "@cm/types/project"
import { Position } from "@cm/types/NewProjectTeamMember"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export async function getProjectMembers(projectId: string, accessToken: string): Promise<{
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
  const response = await fetch(`${API_BASE_URL}/project/${projectId}/member/${memberId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ positions }),
  })

  if (!response.ok) {
    throw new Error('멤버 포지션 수정 실패')
  }
}

export async function removeMember(
  projectId: string,
  memberId: string,
  accessToken: string
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/project/${projectId}/member/${memberId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error('멤버 삭제 실패')
  }
}

export async function addMember(
  projectId: string,
  email: string,
  positions: Position[],
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
      role: 'DEVELOPER', // 기본값으로 DEVELOPER 설정
    }),
  })

  if (!response.ok) {
    throw new Error('멤버 추가 실패')
  }
} 