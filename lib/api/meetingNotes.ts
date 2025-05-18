import { Meeting } from "@/types/meeting"


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
