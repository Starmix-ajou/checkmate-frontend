import { useAuthStore } from '@/stores/useAuthStore'
import { EventSourcePolyfill } from 'event-source-polyfill'

interface UseNotificationSSEProps {
  onGetNotifications: (notifications: Notification[]) => void
  onError: (error: Error | MessageEvent) => void
  onOpen?: () => void
}

interface Notification {
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

export const UseNotificationSSE = ({
  onGetNotifications,
  onError,
  onOpen,
}: UseNotificationSSEProps) => {
  const user = useAuthStore((state) => state.user)

  const startSSE = () => {
    const token = user?.accessToken
    if (!token) {
      console.warn('JWT 토큰이 존재하지 않습니다.')
      return null
    }

    const eventSource = new EventSourcePolyfill(
      `${process.env.NEXT_PUBLIC_API_URL}/sse/subscribe`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'text/event-stream',
        },
      }
    )

    eventSource.onopen = () => {
      console.log('SSE 연결 성공')
      onOpen?.()
    }

    eventSource.addEventListener('get-notifications', (event) => {
      if ('data' in event) {
        const message = event as MessageEvent
        try {
          const data = JSON.parse(message.data)
          console.log('SSE 알림 수신:', data)
          onGetNotifications(data)
        } catch (error) {
          console.error('SSE 데이터 처리 오류:', error)
          onError(error instanceof Error ? error : new Error(String(error)))
        }
      }
    })

    eventSource.onerror = (err) => {
      console.error('SSE 연결 오류:', err)
      eventSource.close()
      onError(err instanceof Error ? err : new Error(String(err)))
    }

    return eventSource
  }

  return { startSSE }
}
