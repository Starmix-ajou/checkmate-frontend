export interface Notification {
  notificationId: string
  userId: string
  title: string
  description: string
  targetId: string
  isRead: boolean
  project: {
    projectId: string
    title: string
    description: string
    startDate: string
    endDate: string
    members: Array<{
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
    }>
    leader: {
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
    productManager: {
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
    imageUrl: string | null
    archived: boolean
  }
}

interface NotificationResponse {
  totalPages: number
  totalElements: number
  size: number
  content: Notification[]
  number: number
  sort: {
    empty: boolean
    unsorted: boolean
    sorted: boolean
  }
  pageable: {
    offset: number
    sort: {
      empty: boolean
      unsorted: boolean
      sorted: boolean
    }
    pageNumber: number
    paged: boolean
    pageSize: number
    unpaged: boolean
  }
  numberOfElements: number
  first: boolean
  last: boolean
  empty: boolean
}

export const getNotifications = async (
  accessToken: string,
  projectId: string,
  page: number,
  size: number
): Promise<NotificationResponse> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/notification?projectId=${projectId}&page=${page}&size=${size}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!res.ok) throw new Error(`알림 조회 실패: ${res.status}`)
    return await res.json()
  } catch (error) {
    console.error('알림 조회 에러:', error)
    throw error
  }
}

export const getNotification = async (
  accessToken: string,
  projectId: string
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/sse/notification`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!res.ok) throw new Error(`알림 수신 실패: ${res.status}`)
  } catch (error) {
    console.error('알림 수신 에러:', error)
    throw error
  }
}

export const markNotificationAsRead = async (
  accessToken: string,
  notificationId: string
): Promise<void> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/notification/${notificationId}/read`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!res.ok) throw new Error(`알림 읽음 처리 실패: ${res.status}`)
  } catch (error) {
    console.error('알림 읽음 처리 에러:', error)
    throw error
  }
}

export const deleteNotification = async (
  accessToken: string,
  notificationId: string
): Promise<void> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/notification/${notificationId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!res.ok) throw new Error(`알림 삭제 실패: ${res.status}`)
  } catch (error) {
    console.error('알림 삭제 에러:', error)
    throw error
  }
}
