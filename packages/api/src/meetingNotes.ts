import { Meeting } from '@cm/types/meeting'

interface LiveblocksRoom {
  type: string
  id: string
  lastConnectionAt: string
  createdAt: string
  metadata: {
    name: string[]
    type: string[]
  }
  defaultAccesses: string[]
  groupsAccesses: Record<string, string[]>
  usersAccesses: Record<string, string[]>
}

export const getMeetings = async (
  accessToken: string,
  projectId: string
): Promise<Meeting[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/meeting?projectId=${projectId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`회의 목록 조회 실패: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error('회의 목록 조회 에러:', error)
    throw error
  }
}

export const getCreateMeeting = async (
  accessToken: string,
  projectId: string
): Promise<Meeting> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/meeting/create?projectId=${projectId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`회의 생성 실패: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error('회의 생성 에러:', error)
    throw error
  }
}

export const getRoomDetails = async (
  roomId: string
): Promise<{ createdAt: Date; updatedAt: Date }> => {
  if (!roomId) {
    throw new Error('roomId가 필요합니다.')
  }

  try {
    const response = await fetch(`/api/rooms/${roomId}`)

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || '회의실 정보 조회 실패')
    }

    const room: LiveblocksRoom = await response.json()

    if (!room.createdAt || !room.lastConnectionAt) {
      throw new Error('회의실 정보가 올바르지 않습니다.')
    }

    return {
      createdAt: new Date(room.createdAt),
      updatedAt: new Date(room.lastConnectionAt),
    }
  } catch (error) {
    console.error('회의실 정보 조회 에러:', error)
    throw error
  }
}
