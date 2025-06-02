import { useAuthStore } from '@/stores/useAuthStore'
import { getProjectMembers } from '@cm/api/sprintConfiguration'
import { Member } from '@cm/types/project'
import { TaskRow } from '@cm/types/sprint'
import { DetailTaskTable } from '@cm/ui/components/project/DetailTaskTable'
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
import { ArrowRight } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

interface ActionItem {
  id: string
  content: string
  selected: boolean
}

const mockSummarizeMeeting = async (meetingId: string) => {
  await new Promise((resolve) => setTimeout(resolve, 2000))
  return {
    summary:
      '회의 요약: 프로젝트 일정 조정에 대해 논의했습니다. 프론트엔드 개발 일정이 지연되어 백엔드 개발자들이 대기 상태에 있습니다. 다음 주까지 프론트엔드 개발을 완료하고, 이후 백엔드 개발자들이 API 연동을 시작할 예정입니다.',
    actionItems: [
      '프론트엔드 개발 일정 재조정하기',
      '백엔드 API 문서 업데이트하기',
      '다음 주 월요일까지 개발 환경 설정 완료하기',
      '팀 미팅 일정 조정하기',
    ],
  }
}

const mockUpdateActionItems = async (actionItems: string[]) => {
  await new Promise((resolve) => setTimeout(resolve, 1500))
  return { success: true }
}

const mockCreateTasks = async (tasks: TaskRow[]) => {
  await new Promise((resolve) => setTimeout(resolve, 1500))
  return { success: true }
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

export default function MeetingWizard() {
  const pathname = usePathname()
  const router = useRouter()
  const projectId = pathname?.split('/')[2]
  const meetingId = pathname?.split('/')[4]
  const user = useAuthStore((state) => state.user)
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(true)
  const [members, setMembers] = useState<Member[]>([])
  const [originalContent, setOriginalContent] = useState('')
  const [summary, setSummary] = useState('')
  const [actionItems, setActionItems] = useState<ActionItem[]>([])
  const [tasks, setTasks] = useState<TaskRow[]>([])

  const loadingMessages = [
    <>
      회의록을 요약하고
      <br />
      액션 아이템을 추출하고 있어요.
    </>,
    <>
      액션 아이템을
      <br />
      태스크로 변환하고 있어요.
    </>,
    <>
      태스크를
      <br />
      저장하고 있어요.
    </>,
  ]

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

  useEffect(() => {
    if (projectId && user?.accessToken) {
      loadProjectMembers()
      if (meetingId) {
        mockSummarizeMeeting(meetingId)
          .then((result) => {
            setSummary(result.summary)
            setActionItems(
              result.actionItems.map((item, index) => ({
                id: `action-${index}`,
                content: item,
                selected: true,
              }))
            )
            setLoading(false)
          })
          .catch((err) => {
            const errorMessage =
              err instanceof Error ? err.message : '알 수 없는 오류'
            toast.error(`회의록 요약 중 오류가 발생했습니다: ${errorMessage}`)
            setLoading(false)
          })
      }
    }
  }, [projectId, user?.accessToken, meetingId, loadProjectMembers])

  const goToNextStep = async () => {
    if (!meetingId) return

    setLoading(true)
    try {
      if (step === 0) {
        setStep(1)
        setLoading(false)
      } else if (step === 1) {
        const selectedItems = actionItems
          .filter((item) => item.selected)
          .map((item) => item.content)
        await mockUpdateActionItems(selectedItems)
        setTasks(
          selectedItems.map((item) => ({
            title: item,
            description: '',
            priority: 'MEDIUM',
            status: 'TODO',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split('T')[0],
            position: '',
            assignee: '',
          }))
        )
        setStep(2)
        setLoading(false)
      } else if (step === 2) {
        const validTasks = tasks.filter(
          (task) => task.assignee && task.priority
        )
        await mockCreateTasks(validTasks)
        router.push(`/projects/${projectId}/overview`)
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '알 수 없는 오류'
      toast.error(`처리 중 오류가 발생했습니다: ${errorMessage}`)
      setLoading(false)
    }
  }

  const actionItemsTable = useReactTable({
    data: actionItems,
    columns: actionItemColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  const handleTaskDataChange = (newTasks: TaskRow[]) => {
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
      return tasks.every((task) => task.assignee && task.priority)
    }
    return false
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl w-full mx-auto">
      <div className="w-full flex space-x-2 justify-center mb-16">
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
        <WizardLoadingScreen message={loadingMessages[step]} />
      ) : (
        <>
          {step === 0 && (
            <div className="flex gap-8">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">원본 회의록</h2>
                <div className="border rounded-lg p-4 h-[600px] overflow-y-auto bg-muted/50">
                  {originalContent || '회의록 내용을 불러오는 중...'}
                </div>
              </div>
              <div className="flex items-center">
                <ArrowRight className="w-8 h-8 text-cm" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">요약된 회의록</h2>
                <div className="border rounded-lg p-4 h-[600px] overflow-y-auto bg-muted/50">
                  {summary || '요약된 내용이 여기에 표시됩니다...'}
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
                <DetailTaskTable
                  data={tasks}
                  onDataChange={handleTaskDataChange}
                  projectId={projectId || ''}
                  members={members}
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
