import { useAuthStore } from '@/stores/useAuthStore'
import { Notification } from '@cm/api/notifications'
import { EventSourcePolyfill } from 'event-source-polyfill'

interface UseNotificationSSEProps {
  onNewNotification: (notification: Notification) => void
  onError: (error: Error | MessageEvent) => void
  onOpen?: () => void
}

export const UseNotificationSSE = ({
  onNewNotification,
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

    eventSource.addEventListener('new-notification', (event) => {
      if ('data' in event) {
        const message = event as MessageEvent
        try {
          const data = JSON.parse(message.data)
          console.log('새 알림 수신:', data)
          onNewNotification(data)
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
