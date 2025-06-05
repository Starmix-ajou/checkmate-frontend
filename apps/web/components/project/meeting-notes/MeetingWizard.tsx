import { useMeetingSSE } from '@/hooks/useMeetingSSE'
import { useAuthStore } from '@/stores/useAuthStore'
import { useMeetingStore } from '@/stores/useMeetingStore'
import { EventSourcePolyfill } from 'event-source-polyfill'
import {
  getMeeting,
  sendActionItems,
  sendMeetingContent,
  updateActionItems,
} from '@cm/api/meetingNotes'
import { getProjectMembers } from '@cm/api/sprintConfiguration'
import { Member, Project } from '@cm/types/project'
import { Epic, ActionItemRow } from '@cm/types/sprint'
import { ActionItemsTable } from '@cm/ui/components/project/ActionItemsTable'
import { EditableTable } from '@cm/ui/components/project/EditableTable'
import WizardLoadingScreen from '@cm/ui/components/project/WizardLoadingScreen'
import { Button } from '@cm/ui/components/ui/button'
import { Checkbox } from '@cm/ui/components/ui/checkbox'
import { Input } from '@cm/ui/components/ui/input'
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowRight, ChevronsRight } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { toast } from 'react-toastify'

interface ActionItem {
  id: string
  content: string
  selected: boolean
}

const DEFAULT_ACTION_ITEM: ActionItem = {
  id: '',
  content: '',
  selected: true,
}

const actionItemColumns: ColumnDef<ActionItem>[] = [
  {
    id: 'select',
    header: () => <input type="checkbox" />,
    cell: ({ row, table }) => {
      const meta = table.options.meta as {
        updateData: (rowIndex: number, columnId: string, value: unknown) => void
      }
      return (
        <Checkbox
          checked={row.original.selected}
          onCheckedChange={(checked) =>
            meta.updateData(row.index, 'selected', checked)
          }
        />
      )
    },
  },
  {
    accessorKey: 'content',
    header: '액션 아이템',
    cell: ({ row, table }) => {
      const meta = table.options.meta as {
        updateData: (rowIndex: number, columnId: string, value: unknown) => void
      }
      return (
        <Input
          value={row.original.content}
          onChange={(e) =>
            meta.updateData(row.index, 'content', e.target.value)
          }
          className="w-full border-none shadow-none"
          placeholder="액션 아이템을 입력하세요"
        />
      )
    },
  },
]

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

interface TaskResponse {
  taskId: string | null
  title: string
  description: string
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
  assigneeEmail: string
  startDate: string
  endDate: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  epicId: string
  review: string | null
}

export default function MeetingWizard() {
  const pathname = usePathname()
  const router = useRouter()
  const projectId = pathname?.split('/')[2]
  const meetingId = pathname?.split('/')[4]
  const user = useAuthStore((state) => state.user)
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [members, setMembers] = useState<Member[]>([])
  const [originalContent, setOriginalContent] = useState('')
  const [summary, setSummary] = useState('')
  const [actionItems, setActionItems] = useState<ActionItem[]>([])
  const [tasks, setTasks] = useState<ActionItemRow[]>([])
  const [epics, setEpics] = useState<Epic[]>([])
  const [project, setProject] = useState<Project | null>(null)

  const meetingContent = useMeetingStore((state) => state.meetingContent)
  const clearMeetingContent = useMeetingStore(
    (state) => state.clearMeetingContent
  )
  const [eventSource, setEventSource] = useState<EventSourcePolyfill | null>(null) as [
    EventSourcePolyfill | null,
    React.Dispatch<React.SetStateAction<EventSourcePolyfill | null>>
  ]
  const [sseConnected, setSseConnected] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  const { startSSE } = useMeetingSSE({
    onMessage: (message) => {
      console.log('SSE 메시지 수신:', message)
    },
    onSaveMeeting: (data) => {
      console.log('SSE 회의록 요약 수신:', data)
      if (!data || (!data.summary && !data.actionItems)) {
        console.log('데이터 없음')
        setLoading(false)
        return
      }

      setSummary(data.summary || '')
      setActionItems(
        (data.actionItems || []).map((item: string, index: number) => ({
          id: `action-${index}`,
          content: item,
          selected: true,
        }))
      )
      setLoading(false)
    },
    onCreateActionItems: (data: any) => {
      console.log('SSE 액션 아이템 처리 완료:', data)
      if (!data) {
        console.log('데이터 없음')
        setLoading(false)
        return
      }

      try {
        // data가 문자열 배열인 경우 JSON 파싱 시도
        const tasks = Array.isArray(data) 
          ? data.map(item => typeof item === 'string' ? JSON.parse(item) : item)
          : data

        console.log('파싱된 태스크:', tasks)

        const newTasks = tasks.map((task: TaskResponse) => ({
          title: task.title,
          description: task.description || '',
          priority: task.priority,
          status: task.status,
          startDate: task.startDate,
          endDate: task.endDate,
          assigneeEmail: task.assigneeEmail,
          epicId: task.epicId,
        }))

        console.log('변환된 태스크:', newTasks)
        setTasks(newTasks)
        setStep(2)
      } catch (error) {
        console.error('태스크 데이터 처리 중 오류:', error)
        toast.error('태스크 데이터 처리 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    },
    onError: (error) => {
      console.error('SSE 에러:', error)
      toast.error('회의록 처리 중 오류가 발생했습니다.')
      setSseConnected(false)
      setLoading(false)
    },
  })

  // SSE 연결 초기화 및 관리
  const initializeSSE = useCallback(async () => {
    if (
      !meetingId ||
      !user?.accessToken ||
      !meetingContent ||
      step !== 0 ||
      eventSource ||
      isInitialized
    ) {
      return
    }

    try {
      setLoading(true)
      setIsInitialized(true)

      // 새로운 SSE 연결 생성
      const newEventSource = startSSE()
      if (!newEventSource) {
        throw new Error('SSE 연결에 실패했습니다.')
      }

      // SSE 연결 상태 모니터링
      newEventSource.onopen = () => {
        console.log('SSE 연결 성공')
        setSseConnected(true)
      }

      newEventSource.onerror = () => {
        console.log('SSE 연결 오류')
        setSseConnected(false)
      }

      setEventSource(newEventSource)

      // 회의록 내용 전송
      const meetingData = await getMeeting(user.accessToken, meetingId)
      setOriginalContent(meetingContent)

      await sendMeetingContent(user.accessToken, {
        meetingId,
        title: meetingData.title,
        content: meetingContent,
        masterId: meetingData.master.userId,
      })

      // SSE 연결이 성공적으로 설정된 후에만 meetingContent 클리어
      clearMeetingContent()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류'
      console.error('회의록 처리 중 오류:', errorMessage)
      toast.error(`회의록 처리 중 오류가 발생했습니다: ${errorMessage}`)

      if (eventSource) {
        eventSource.close()
        setEventSource(null)
      }
      setIsInitialized(false)
      setLoading(false)
    }
  }, [
    meetingId,
    user?.accessToken,
    step,
    meetingContent,
    eventSource,
    startSSE,
    clearMeetingContent,
    isInitialized,
  ])

  // SSE 연결 초기화
  useEffect(() => {
    initializeSSE()

    return () => {
      if (eventSource) {
        eventSource.close()
        setEventSource(null)
      }
      setSseConnected(false)
      setIsInitialized(false)
    }
  }, [initializeSSE, eventSource])

  // SSE 연결 상태 모니터링
  useEffect(() => {
    if (!sseConnected && isInitialized && step === 0) {
      console.log('SSE 재연결 시도')
      initializeSSE()
    }
  }, [sseConnected, isInitialized, step, initializeSSE])

  const loadProjectMembers = useCallback(async () => {
    if (!projectId || !user?.accessToken) return

    try {
      const memberData = await getProjectMembers(projectId, user?.accessToken)
      if (Array.isArray(memberData)) {
        setMembers(memberData)
      } else {
        console.error('멤버 데이터가 배열이 아닙니다:', memberData)
        toast.error('멤버 데이터 형식이 올바르지 않습니다.')
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '알 수 없는 오류'
      toast.error(`멤버 정보를 불러오는데 실패했습니다: ${errorMessage}`)
    }
  }, [projectId, user?.accessToken])

  const loadProjectDetails = useCallback(async () => {
    if (!projectId || !user?.accessToken) return
    try {
      // 프로젝트 상세 정보 가져오기
      const projectResponse = await fetch(
        `${API_BASE_URL}/project/${projectId}`,
        {
          headers: {
            Accept: '*/*',
            Authorization: `Bearer ${user?.accessToken}`,
          },
        }
      )

      if (!projectResponse.ok) {
        throw new Error('프로젝트 상세 정보 불러오기 실패')
      }

      const projectData = await projectResponse.json()
      setProject(projectData)

      // 에픽 목록 가져오기
      const epicsResponse = await fetch(
        `${API_BASE_URL}/epic?projectId=${projectId}`,
        {
          headers: {
            Accept: '*/*',
            Authorization: `Bearer ${user?.accessToken}`,
          },
        }
      )

      if (!epicsResponse.ok) {
        throw new Error('에픽 목록 불러오기 실패')
      }

      const epicsData = await epicsResponse.json()
      setEpics(epicsData)

      // 멤버 정보 로드
      await loadProjectMembers()
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '알 수 없는 오류'
      toast.error(`프로젝트 정보를 불러오는데 실패했습니다: ${errorMessage}`)
    }
  }, [projectId, user?.accessToken, loadProjectMembers])

  // 프로젝트 정보 로드
  useEffect(() => {
    if (!projectId || !user?.accessToken) return
    loadProjectDetails()
  }, [projectId, user?.accessToken, loadProjectDetails])

  const goToNextStep = async () => {
    if (!meetingId || !user?.accessToken) return

    setLoading(true)
    try {
      if (step === 0) {
        // SSE는 이미 연결되어 있으므로 step만 변경
        setStep(1)
        setLoading(false)
      } else if (step === 1) {

        const selectedItems = actionItems
          .filter((item) => item.selected)
          .map((item) => item.content)

        await sendActionItems(user.accessToken, meetingId, selectedItems)
        // step 변경은 onCreateActionItems 이벤트에서 처리
      } else if (step === 2) {
        if (!sseConnected) {
          throw new Error('SSE 연결이 끊어졌습니다. 페이지를 새로고침해주세요.')
        }

        const validTasks = tasks.filter((task) => task.assigneeEmail && task.epicId)
        await updateActionItems(user.accessToken, meetingId, validTasks)
        router.push(`/projects/${projectId}/overview`)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류'
      toast.error(`처리 중 오류가 발생했습니다: ${errorMessage}`)
      setLoading(false)
    }
  }

  const actionItemsTable = useReactTable({
    data: actionItems,
    columns: actionItemColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  const handleTaskDataChange = (newTasks: ActionItemRow[]) => {
    setTasks(newTasks)
  }

  const canProceedToNextStep = () => {
    if (step === 0) return true
    if (step === 1) {
      return (
        actionItems.some((item) => item.selected) &&
        actionItems
          .filter((item) => item.selected)
          .every((item) => item.content.trim() !== '')
      )
    }
    if (step === 2) {
      return tasks.every((task) => task.assigneeEmail && task.epicId)
    }
    return false
  }

  return (
    <div className="p-4 space-y-6 max-w-6xl w-full mx-auto">
      <div className="w-full flex space-x-2 justify-center mb-8">
        {[0, 1, 2].map((s) => (
          <div
            key={s}
            className={`w-2 h-2 rounded-full ${
              s <= step ? 'bg-cm' : 'bg-cm-100/50'
            }`}
          />
        ))}
      </div>

      {loading ? (
        <WizardLoadingScreen message="회의록을 요약하고 액션 아이템을 추출하고 있어요." />
      ) : (
        <>
          {step === 0 && (
            <div className="flex gap-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">원본 회의록</h2>
                <div className="border rounded-lg p-4 h-[600px] overflow-y-auto bg-muted/50 prose prose-sm max-w-none">
                  {originalContent ? (
                    <ReactMarkdown>{originalContent}</ReactMarkdown>
                  ) : (
                    '회의록 내용을 불러오는 중...'
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <ChevronsRight className="w-8 h-8 text-cm" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">요약된 회의록</h2>
                <div className="border rounded-lg p-4 h-[600px] overflow-y-auto bg-muted/50 prose prose-sm max-w-none">
                  {summary ? (
                    <ReactMarkdown>{summary}</ReactMarkdown>
                  ) : (
                    '요약된 내용이 여기에 표시됩니다...'
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">
                액션 아이템을 검토해주세요
              </h2>
              <div className="text-lg text-gray-700 mb-8">
                회의록에서 추출한 액션 아이템이에요.
              </div>
              <EditableTable
                data={actionItems}
                columns={actionItemColumns}
                onDataChange={setActionItems}
                addButtonText="+ 액션 아이템 추가"
                defaultRow={DEFAULT_ACTION_ITEM}
                showHeader={false}
                meta={{
                  updateData: (
                    rowIndex: number,
                    columnId: string,
                    value: unknown
                  ) => {
                    setActionItems((prev) =>
                      prev.map((row, index) =>
                        index === rowIndex ? { ...row, [columnId]: value } : row
                      )
                    )
                  },
                }}
              />
            </div>
          )}

          {step === 2 && (
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-8">
                새로운 Task를 확인해주세요
              </h2>
              <div className="space-y-8">
                <ActionItemsTable
                  data={tasks}
                  onDataChange={handleTaskDataChange}
                  projectId={projectId || ''}
                  members={members}
                  epics={epics}
                  canAdd={false}
                />
              </div>
            </div>
          )}

          <div className="text-center mt-8">
            <Button
              variant="cm"
              onClick={goToNextStep}
              disabled={!canProceedToNextStep()}
            >
              {step === 2 ? '완료' : '다음'}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
