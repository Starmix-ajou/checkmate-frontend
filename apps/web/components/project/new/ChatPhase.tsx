'use client'

import { phases } from '@/components/project/new/phases'
import { useProjectSSE } from '@/hooks/useProjectSSE'
import { useAuthStore } from '@/stores/useAuthStore'
import {
  getPresignedUrl,
  uploadFileToPresignedUrl,
} from '@cm/api/objectStorage'
import {
  getSpecification,
  postProjectDefinition,
  putDefinitionFeedback,
  putSpecificationFeedback,
} from '@cm/api/projectCreation'
import { TeamMember } from '@cm/types/NewProjectTeamMember'
import { Feature, Message, Phase } from '@cm/types/project-creation'
import { ProjectDefinitionBody } from '@cm/types/project-definition'
import CheckmateSpinner from '@cm/ui/components/common/CheckmateSpinner'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useEffect, useRef, useState } from 'react'
import { DateRange } from 'react-day-picker'

import { ChatInput } from './ChatInput'
import { ChatMessage } from './ChatMessage'

type ChatPhaseProps = {
  phase: Phase
  onNext: () => void
  formPhaseInput: string
  onSpecificationsComplete?: (
    specifications: Feature[],
    projectId: string
  ) => void
}

function getInitialMemberData(userEmail: string): TeamMember[] {
  return [
    {
      email: userEmail,
      positions: [],
    },
  ]
}

export default function ChatPhase({
  phase,
  onNext,
  formPhaseInput,
  onSpecificationsComplete,
}: ChatPhaseProps) {
  const lastMessageRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: phase.question },
  ])
  const [input, setInput] = useState<string>('')
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [file, setFile] = useState<File | null>(null)
  const [skipFile, setSkipFile] = useState(false)
  const user = useAuthStore((state) => state.user)
  const [tableData, setTableData] = useState<TeamMember[]>(
    user?.email ? getInitialMemberData(user.email) : []
  )
  const [isLoading, setIsLoading] = useState(false)
  const [modifiedFeatures, setModifiedFeatures] = useState<Feature[]>([])
  const [originalFeatures, setOriginalFeatures] = useState<Feature[]>([])
  const [projectTitle, setProjectTitle] = useState('')
  const [projectDescription, setProjectDescription] = useState(formPhaseInput)
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([])

  const { startSSE } = useProjectSSE({
    onMessage: (message) => {
      addMessage('ai', message)
      setIsLoading(false)
      onNext()
    },
    onCreateFeatureDefinition: (features, suggestions) => {
      addMessage('ai', '생성된 기능 정의를 확인해주세요.')
      addMessage('ai', '', {
        features,
        suggestions,
      })
      setIsLoading(false)
      onNext()
    },
    onFeedbackFeatureDefinition: async (features, isNextStep) => {
      if (features.length > 0) {
        addMessage('ai', '요청하신 기능 정의를 생성했습니다.')
        addMessage('ai', '', {
          features,
        })
        setIsLoading(false)
      }

      if (isNextStep) {
        addMessage('ai', '위와 같은 기능 정의에 따라 기능 명세를 작성중입니다.')
        setIsLoading(true)
        if (!user?.accessToken) return console.warn('JWT 토큰이 없습니다.')

        try {
          await getSpecification(user.accessToken)
          setIsLoading(false)
          onNext()
        } catch (error) {
          console.error('명세 단계 전환 에러:', error)
          setIsLoading(false)
        }
      }
    },
    onCreateFeatureSpecification: (features) => {
      if (features.length > 0) {
        setOriginalFeatures(features)
        setModifiedFeatures(features)
        addMessage('ai', '생성된 기능 명세를 확인해주세요.')
        addMessage('ai', '', {
          specifications: features,
        })
      }
    },
    onError: (error) => {
      console.error('SSE 에러:', error)
      setIsLoading(false)
    },
    onFeedbackFeatureSpecification: (features, isNextStep, projectId) => {
      console.log('onSpecificationFeedback 호출됨:', {
        features,
        isNextStep,
        projectId,
      })
      setIsLoading(false)

      if (features.length > 0) {
        console.log('features 처리 중:', features)
        addMessage('ai', '요청하신 기능 명세를 생성했습니다.')
        addMessage('ai', '', {
          specifications: features,
        })
      }

      if (isNextStep) {
        console.log('최종 명세서 검토 단계로 전환')
        setIsLoading(false)
        onSpecificationsComplete?.(features, projectId)
        onNext()
      }
    },
  })

  const handleSuggestionChange = (suggestion: string, checked: boolean) => {
    setSelectedSuggestions((prev) =>
      checked ? [...prev, suggestion] : prev.filter((s) => s !== suggestion)
    )
  }

  const handleFeatureChange = (features: Feature[], msg: Message) => {
    console.log('handleFeatureChange 호출됨:', {
      features,
      currentModifiedFeatures: modifiedFeatures,
      messageId: msg.text,
    })
    setModifiedFeatures(features)
    setMessages((prev) => {
      const updated = prev.map((m) =>
        m === msg
          ? {
              ...m,
              tableData: {
                ...m.tableData!,
                specifications: features,
              },
            }
          : m
      )
      console.log('메시지 업데이트 후:', updated)
      return updated
    })
  }

  const uploadFile = async (file: File): Promise<string> => {
    if (!user?.accessToken) {
      console.warn('JWT 토큰이 없습니다.')
      return ''
    }

    try {
      const { presignedUrl, url } = await getPresignedUrl(user.accessToken, {
        bucket: 'DEFINITION',
        fileName: file.name,
      })

      await uploadFileToPresignedUrl(presignedUrl, file)
      return url
    } catch (error) {
      console.error('파일 업로드 에러:', error)
      throw error
    }
  }

  const sendProjectDefinition = async (definitionUrl: string) => {
    if (!user?.accessToken) return console.warn('JWT 토큰이 없습니다.')
    if (!dateRange?.from) return console.warn('시작 날짜가 없습니다.')

    const members = tableData.map((member) => ({
      email: member.email,
      profile: {
        positions: member.positions,
        projectId: 'temp',
        role: 'DEVELOPER',
        isActive: false,
      },
    }))

    const body: ProjectDefinitionBody = {
      title: projectTitle,
      description: projectDescription,
      startDate: dateRange.from.toISOString().split('T')[0],
      endDate:
        dateRange.to?.toISOString().split('T')[0] ??
        dateRange.from.toISOString().split('T')[0],
      members,
      definitionUrl,
    }

    try {
      await postProjectDefinition(user.accessToken, body)
    } catch (error) {
      console.error('정의서 전송 에러:', error)
    }
  }

  const sendDefinitionFeedback = async (feedback: string) => {
    if (!user?.accessToken) return console.warn('JWT 토큰이 없습니다.')

    try {
      await putDefinitionFeedback(
        user.accessToken,
        feedback,
        selectedSuggestions
      )
      setSelectedSuggestions([])
    } catch (error) {
      console.error('피드백 전송 에러:', error)
    }
  }

  const analyzeFeatureChanges = (original: Feature[], modified: Feature[]) => {
    console.log('analyzeFeatureChanges 호출됨:', { original, modified })
    const addedFeatures: Feature[] = []
    const modifiedFeatures: Feature[] = []
    const deletedFeatureIds: string[] = []

    original.forEach((origFeature) => {
      const exists = modified.some(
        (modFeature) => modFeature.featureId === origFeature.featureId
      )
      if (!exists) {
        deletedFeatureIds.push(origFeature.featureId)
      }
    })

    modified.forEach((modFeature) => {
      const origFeature = original.find(
        (orig) => orig.featureId === modFeature.featureId
      )

      if (!origFeature) {
        addedFeatures.push(modFeature)
      } else {
        modifiedFeatures.push(modFeature)
      }
    })

    return {
      added: addedFeatures,
      modified: modifiedFeatures,
      deleted: deletedFeatureIds,
    }
  }

  const sendSpecificationFeedback = async (feedback: string) => {
    if (!user?.accessToken) return console.warn('JWT 토큰이 없습니다.')

    try {
      const changes = analyzeFeatureChanges(originalFeatures, modifiedFeatures)

      await putSpecificationFeedback(user.accessToken, feedback, {
        feedback: feedback,
        createdFeatures: changes.added,
        modifiedFeatures: changes.modified,
        deletedFeatures: changes.deleted,
      })
      setModifiedFeatures([])
    } catch (error) {
      console.error('피드백 전송 에러:', error)
    }
  }

  const addMessage = (
    sender: 'user' | 'ai',
    text: string,
    tableData?: Message['tableData']
  ) => {
    setMessages((prev) => [
      ...prev,
      {
        sender,
        text,
        tableData,
      },
    ])
  }

  const handleSendMessage = async () => {
    if (!input.trim() && !dateRange && !file && !skipFile && !tableData) return

    let messageText = input
    let uploadedUrl: string = ''

    if (phase.inputType === 'dateRange' && dateRange) {
      if (dateRange.to) {
        messageText = `${format(dateRange.from!, 'PPP', { locale: ko })} ~ ${format(dateRange.to, 'PPP', { locale: ko })}`
      } else {
        messageText = format(dateRange.from!, 'PPP', { locale: ko })
      }
    } else if (phase.inputType === 'file') {
      if (file) {
        try {
          uploadedUrl = await uploadFile(file)
          messageText = `파일 업로드: ${file.name}`
        } catch (error) {
          console.error('파일 업로드 실패:', error)
          return
        }
      } else {
        messageText = skipFile ? '파일 업로드를 건너뜁니다.' : ''
      }
    }

    if (phase.id === 1) setProjectDescription(input)
    if (phase.id === 2) setProjectTitle(input)

    if (phase.inputType === 'table') {
      addMessage('user', messageText, { teamMembers: tableData })
    } else {
      addMessage('user', messageText)
    }

    setInput('')
    setFile(null)
    setSkipFile(false)

    setIsLoading(true)

    switch (phase.id) {
      case 5:
        const eventSource = startSSE()
        if (eventSource) {
          await sendProjectDefinition(uploadedUrl)
        }
        break
      case 6:
        await sendDefinitionFeedback(messageText)
        break
      case 7:
        await sendSpecificationFeedback(messageText)
        break
      default:
        const currentIndex = phases.findIndex((p) => p.id === phase.id)
        const nextPhase = phases[currentIndex + 1]
        if (nextPhase) {
          onNext()
          setTimeout(() => {
            addMessage('ai', nextPhase.question)
            setIsLoading(false)
          }, 1000)
        }
    }
  }

  const scrollToTop = () => {
    const element = lastMessageRef.current
    if (element) {
      const offset = 50
      const rect = element.getBoundingClientRect()
      const scrollTop = window.scrollY + rect.top - offset
      window.scrollTo({ top: scrollTop, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    scrollToTop()
  }, [messages])

  return (
    <div className="flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-4 pb-60">
        {messages.map((msg, index) => {
          const isLast = index === messages.length - 1
          return (
            <div
              key={index}
              ref={isLast ? lastMessageRef : null}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <ChatMessage
                message={msg}
                selectedSuggestions={selectedSuggestions}
                onSuggestionChange={handleSuggestionChange}
                onFeatureChange={handleFeatureChange}
              />
            </div>
          )
        })}
        {isLoading && (
          <div className="flex justify-start">
            <CheckmateSpinner size={24} />
          </div>
        )}
        <div ref={lastMessageRef} />
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white p-4 flex items-center gap-2">
        <div className="w-full max-w-4xl mx-auto flex gap-2">
          <ChatInput
            phase={phase}
            input={input}
            setInput={setInput}
            dateRange={dateRange}
            setDateRange={setDateRange}
            file={file}
            setFile={setFile}
            skipFile={skipFile}
            setSkipFile={setSkipFile}
            tableData={tableData}
            setTableData={setTableData}
            onSend={handleSendMessage}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}
