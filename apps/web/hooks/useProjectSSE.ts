import { useAuthStore } from '@/stores/useAuthStore'
import { Feature } from '@cm/types/project-creation'
import { EventSourcePolyfill } from 'event-source-polyfill'

interface Suggestion {
  question: string
  answers: string[]
}

interface UseProjectSSEProps {
  onMessage: (message: string) => void
  onCreateFeatureDefinition: (
    features: Feature[],
    suggestions: Suggestion[]
  ) => void
  onFeedbackFeatureDefinition: (
    features: Feature[],
    isNextStep: boolean
  ) => void
  onCreateFeatureSpecification: (features: Feature[]) => void
  onFeedbackFeatureSpecification: (
    features: Feature[],
    isNextStep: boolean,
    projectId: string
  ) => void
  onError: (error: Error | MessageEvent) => void
}

export const useProjectSSE = ({
  onMessage,
  onCreateFeatureDefinition,
  onFeedbackFeatureDefinition,
  onFeedbackFeatureSpecification,
  onCreateFeatureSpecification,
  onError,
}: UseProjectSSEProps) => {
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
      console.log(event)
      if (event.data) {
        onMessage(event.data)
      }
    }

    eventSource.addEventListener('create-feature-definition', (event) => {
      if ('data' in event) {
        const message = event as MessageEvent
        try {
          const parsed = JSON.parse(message.data)
          console.log('SSE 수신 (create-feature-definition):', parsed)

          const features: Feature[] = parsed?.suggestion?.features ?? []
          const suggestions: Suggestion[] =
            parsed?.suggestion?.suggestions ?? []

          if (features.length > 0 || suggestions.length > 0) {
            onCreateFeatureDefinition(features, suggestions)
          }
        } catch (error) {
          console.error('SSE 데이터 파싱 오류:', error)
          onError(error instanceof Error ? error : new Error(String(error)))
        }
      }
    })

    eventSource.addEventListener(
      'feedback-feature-definition',
      async (event) => {
        if ('data' in event) {
          const message = event as MessageEvent
          try {
            const parsed = JSON.parse(message.data)
            console.log('SSE 수신 (feedback-feature-definition):', parsed)

            const features: Feature[] = parsed?.features ?? []
            const isNextStep = parsed?.isNextStep ?? false

            if (features.length > 0) {
              onFeedbackFeatureDefinition(features, isNextStep)
            }
          } catch (error) {
            console.error('SSE 데이터 파싱 오류:', error)
            onError(error instanceof Error ? error : new Error(String(error)))
          }
        }
      }
    )

    eventSource.addEventListener('feedback-feature-specification', (event) => {
      if ('data' in event) {
        const message = event as MessageEvent
        try {
          const parsed = JSON.parse(message.data)
          console.log('SSE 수신 (feedback-feature-specification):', parsed)

          const features = parsed?.features ?? []
          const isNextStep = parsed?.isNextStep ?? false
          const projectId = parsed?.projectId ?? ''

          if (features.length > 0 || isNextStep) {
            onFeedbackFeatureSpecification(features, isNextStep, projectId)
          }
        } catch (error) {
          console.error('SSE 데이터 파싱 오류:', error)
          onError(error instanceof Error ? error : new Error(String(error)))
        }
      }
    })

    eventSource.addEventListener('create-feature-specification', (event) => {
      if ('data' in event) {
        const message = event as MessageEvent
        try {
          const parsed = JSON.parse(message.data)
          console.log('SSE 수신 (create-feature-specification):', parsed)

          const features = parsed?.features ?? []

          if (features.length > 0) {
            onCreateFeatureSpecification(features)
          }
        } catch (error) {
          console.error('SSE 데이터 파싱 오류:', error)
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
