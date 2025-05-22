import { useAuthStore } from '@/stores/useAuthStore'
import { EventSourcePolyfill } from 'event-source-polyfill'

interface UseSprintSSEProps {
  onMessage: (message: string) => void
  onSprintCreation: (sprintId: string) => void
  onFeedback: (message: string) => void
  onError: (error: Error | MessageEvent) => void
}

export const useSprintSSE = ({
  onMessage,
  onSprintCreation,
  onFeedback,
  onError,
}: UseSprintSSEProps) => {
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
    }

    eventSource.onmessage = (event) => {
      if (event.data) {
        onMessage(event.data)
      }
    }

    eventSource.addEventListener('create-sprint', (event) => {
      if ('data' in event) {
        const message = event as MessageEvent
        try {
          // 이미 객체인 경우를 처리
          const data =
            typeof message.data === 'string'
              ? JSON.parse(message.data)
              : message.data

          console.log('SSE 수신 (create-sprint):', data)

          // 스프린트 생성 완료 이벤트 발생
          onSprintCreation(data)
        } catch (error) {
          console.error('SSE 데이터 처리 오류:', error)
          onError(error instanceof Error ? error : new Error(String(error)))
        }
      }
    })

    eventSource.addEventListener('feedback-sprint', (event) => {
      if ('data' in event) {
        const message = event as MessageEvent
        try {
          const data =
            typeof message.data === 'string'
              ? JSON.parse(message.data)
              : message.data

          console.log('SSE 수신 (feedback-sprint):', data)
          onFeedback(data)
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
