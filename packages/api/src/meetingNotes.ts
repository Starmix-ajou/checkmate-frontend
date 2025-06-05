import { Meeting } from '@cm/types/meeting'
import { ActionItemRow } from '@cm/types/sprint'

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

interface MeetingResponse {
  meetingId: string
  title: string
  content: string
  master: {
    userId: string
    name: string
    email: string
    profileImageUrl: string
    profiles: Array<{
      positions: string[]
      projectId: string
      role: string
      isActive: boolean
    }>
  }
  projectId: string
  timestamp: string
  summary: string
}

interface SendMeetingContentRequest {
  meetingId: string
  title: string
  content: string
  masterId: string
}

interface ActionItemRequest {
  actionItems: string[]
}

interface TaskAssignee {
  userId: string
  name: string
  email: string
  profileImageUrl: string
  profile: {
    positions: string[]
    projectId: string
    role: string
    isActive: boolean
  }
}

interface TaskEpic {
  epicId: string
  title: string
  description: string
  projectId: string
  featureId: string
  startDate: string
  endDate: string
}

interface TaskSprint {
  sprintId: string
  title: string
  description: string
  sequence: number
  projectId: string
  startDate: string
  endDate: string
  epics: TaskEpic[]
}

interface Task {
  taskId: string
  title: string
  description: string
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
  assignee: TaskAssignee
  startDate: string
  endDate: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  epic: TaskEpic
  review: string
}

interface UpdateActionItemsRequest {
  tasks: Task[]
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

export const getMeeting = async (
  accessToken: string,
  meetingId: string
): Promise<MeetingResponse> => {
  if (!accessToken) {
    throw new Error('인증 토큰이 없습니다.')
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/meeting/${meetingId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`회의록 조회 실패: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error('회의록 조회 에러:', error)
    throw error
  }
}

export const sendMeetingContent = async (
  accessToken: string,
  data: SendMeetingContentRequest
): Promise<void> => {
  if (!accessToken) {
    throw new Error('인증 토큰이 없습니다.')
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/sse/meeting`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      }
    )

    if (!response.ok) {
      throw new Error(`회의록 내용 전송 실패: ${response.status}`)
    }
  } catch (error) {
    console.error('회의록 내용 전송 에러:', error)
    throw error
  }
}

export const sendActionItems = async (
  accessToken: string,
  meetingId: string,
  actionItems: string[]
): Promise<void> => {
  if (!accessToken) {
    throw new Error('인증 토큰이 없습니다.')
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/sse/meeting/${meetingId}/action-items`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ actionItems }),
      }
    )

    if (!response.ok) {
      throw new Error(`액션 아이템 전송 실패: ${response.status}`)
    }
  } catch (error) {
    console.error('액션 아이템 전송 에러:', error)
    throw error
  }
}

export const updateActionItems = async (
  accessToken: string,
  meetingId: string,
  tasks: ActionItemRow[]
): Promise<void> => {
  if (!accessToken) {
    throw new Error('인증 토큰이 없습니다.')
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/sse/meeting/${meetingId}/action-items`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ tasks }),
      }
    )

    if (!response.ok) {
      throw new Error(`액션 아이템 업데이트 실패: ${response.status}`)
    }
  } catch (error) {
    console.error('액션 아이템 업데이트 에러:', error)
    throw error
  }
}
