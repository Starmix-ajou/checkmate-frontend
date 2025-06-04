import { useSprintSSE } from '@/hooks/useSprintSSE'
import { useAuthStore } from '@/stores/useAuthStore'
import {
  createSprint,
  getIncompletedTasks,
  getProjectMembers,
  updateSprint,
} from '@cm/api/sprintConfiguration'
import { Member } from '@cm/types/project'
import {
  Epic,
  IncompletedTask,
  SprintResponse,
  SprintUpdateRequest,
  TaskRow,
} from '@cm/types/sprintConfiguration'
import { DetailTaskTable } from '@cm/ui/components/project/DetailTaskTable'
import WizardLoadingScreen from '@cm/ui/components/project/WizardLoadingScreen'
import { Badge } from '@cm/ui/components/ui/badge'
import { Button } from '@cm/ui/components/ui/button'
import { Checkbox } from '@cm/ui/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@cm/ui/components/ui/table'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { EventSourcePolyfill } from 'event-source-polyfill'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { SprintReviewTable } from './SprintReviewTable'

export default function SprintWizard() {
  const pathname = usePathname()
  const router = useRouter()
  const projectId = pathname?.split('/')[2]
  const user = useAuthStore((state) => state.user)
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [members, setMembers] = useState<Member[]>([])
  const [incompletedTasks, setIncompletedTasks] = useState<IncompletedTask[]>(
    []
  )
  const [epics, setEpics] = useState<Epic[]>([])
  const [eventSource, setEventSource] = useState<EventSourcePolyfill | null>(
    null
  )
  const [feedbackData, setFeedbackData] = useState<Epic[]>([])

  const { startSSE } = useSprintSSE({
    onMessage: () => {},
    onSprintCreation: (data: string) => {
      setLoading(false)
      const messageData = typeof data === 'string' ? JSON.parse(data) : data

      try {
        const formattedEpics: Epic[] = messageData.map(
          (item: SprintResponse, index: number) => ({
            id: index + 1,
            epicId: item.epic.epicId,
            title: item.epic.title,
            description: item.epic.description,
            startDate: item.epic.startDate,
            endDate: item.epic.endDate,
            task: item.tasks.map((task) => ({
              title: task.title,
              position:
                task.assignee.profiles.find((p) => p.projectId === projectId)
                  ?.positions[0] || 'Unknown',
              assignee: task.assignee.email,
              startDate: task.startDate,
              endDate: task.endDate,
              description: task.description,
              priority: task.priority,
              status: task.status,
            })),
          })
        )

        setEpics(formattedEpics)
        setStep(1)
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : '알 수 없는 오류'
        toast.error(`에픽 데이터 처리 중 오류가 발생했습니다: ${errorMessage}`)
      }
    },
    onFeedback: (data: string) => {
      setLoading(false)
      const messageData = typeof data === 'string' ? JSON.parse(data) : data

      try {
        const formattedData: Epic[] = messageData.map(
          (item: SprintResponse, index: number) => ({
            id: index + 1,
            epicId: item.epic.epicId,
            title: item.epic.title,
            description: item.epic.description,
            startDate: item.epic.startDate,
            endDate: item.epic.endDate,
            task: item.tasks.map((task) => ({
              title: task.title,
              position:
                task.assignee.profiles.find((p) => p.projectId === projectId)
                  ?.positions[0] || 'Unknown',
              assignee: task.assignee.email,
              startDate: task.startDate,
              endDate: task.endDate,
              description: task.description,
              priority: task.priority,
              status: task.status,
            })),
          })
        )

        setFeedbackData(formattedData)
        setStep(2)
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : '알 수 없는 오류'
        toast.error(
          `피드백 데이터 처리 중 오류가 발생했습니다: ${errorMessage}`
        )
      }
    },
    onError: (err: Error | MessageEvent) => {
      const errorMessage =
        err instanceof Error
          ? err.message
          : '서버와의 연결에 문제가 발생했습니다'
      toast.error(errorMessage)
      setLoading(false)
    },
  })

  useEffect(() => {
    return () => {
      if (eventSource) {
        eventSource.close()
      }
    }
  }, [eventSource])

  const loadIncompletedTasks = useCallback(async () => {
    if (!projectId || !user?.accessToken) return

    try {
      setLoading(true)
      const tasks = await getIncompletedTasks(projectId, user?.accessToken)
      setIncompletedTasks(tasks)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '알 수 없는 오류'
      toast.error(
        `완료되지 않은 태스크를 불러오는데 실패했습니다: ${errorMessage}`
      )
    } finally {
      setLoading(false)
    }
  }, [projectId, user?.accessToken])

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
      loadIncompletedTasks()
      loadProjectMembers()
    }
  }, [projectId, user?.accessToken, loadIncompletedTasks, loadProjectMembers])

  const loadingMessages = [
    <>
      프로젝트에 적합한
      <br />
      스프린트를 구성하고 있어요.
    </>,
    <>
      피드백을 반영해서
      <br />
      스프린트를 구성하고 있어요.
    </>,
    <>
      세부 태스크를 반영해서
      <br />
      스프린트를 구성하고 있어요.
    </>,
  ]

  const goToNextStep = async () => {
    if (!projectId || !user?.accessToken) return

    setLoading(true)
    try {
      if (step === 0) {
        const selectedTaskIds = incompletedTasks
          .filter((task) => task.selected)
          .map((task) => task.taskId)

        if (eventSource) {
          eventSource.close()
        }

        const newEventSource = startSSE()
        if (!newEventSource) {
          throw new Error('SSE 연결에 실패했습니다.')
        }
        setEventSource(newEventSource)

        await createSprint(projectId, selectedTaskIds, user?.accessToken)
      } else if (step === 1) {
        const updateData: SprintUpdateRequest[] = epics.map((epic) => ({
          epicId: epic.epicId || '',
          tasks: epic.task.map((task) => ({
            title: task.title,
            description: task.description || '',
            status: task.status || 'TODO',
            assigneeEmail: task.assignee,
            startDate: task.startDate,
            endDate: task.endDate,
            priority: task.priority || 'MEDIUM',
          })),
        }))

        if (!eventSource || eventSource.readyState === EventSource.CLOSED) {
          const newEventSource = startSSE()
          if (!newEventSource) {
            throw new Error('SSE 연결에 실패했습니다.')
          }
          setEventSource(newEventSource)
        }

        await updateSprint(projectId, updateData, user?.accessToken)
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '알 수 없는 오류'
      toast.error(`스프린트 처리 중 오류가 발생했습니다: ${errorMessage}`)
      setLoading(false)
    }
  }

  const incompletedTaskColumns: ColumnDef<IncompletedTask>[] = [
    {
      id: 'select',
      header: () => <input type="checkbox" disabled />,
      cell: ({ row }) => (
        <Checkbox
          checked={row.original.selected}
          onCheckedChange={() => handleSelect(row.index)}
        />
      ),
    },
    {
      accessorKey: 'title',
      header: 'Task 제목',
      cell: ({ row }) => (
        <div className="font-medium">{row.original.title}</div>
      ),
    },
    {
      accessorKey: 'position',
      header: '포지션',
      cell: ({ row }) => (
        <Badge variant="secondary" className="capitalize">
          {row.original.position}
        </Badge>
      ),
    },
  ]

  const incompletedTasksTable = useReactTable({
    data: incompletedTasks,
    columns: incompletedTaskColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  const handleSelect = (index: number) => {
    setIncompletedTasks((prev) => {
      const updated = [...prev]
      updated[index] = {
        ...updated[index],
        selected: !updated[index].selected,
      }
      return updated
    })
  }

  const handleTaskDataChange = (epicId: number, newTasks: TaskRow[]) => {
    setEpics((prev) =>
      prev.map((epic) =>
        epic.id === epicId ? { ...epic, task: newTasks } : epic
      )
    )
  }

  const handleComplete = async () => {
    if (!projectId) return
    router.push(`/projects/${projectId}/overview`)
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl w-full mx-auto">
      <div className="w-full flex space-x-2 justify-center mb-16">
        {[0, 1, 2].map((s) => (
          <div
            key={s}
            className={`w-2 h-2 rounded-full ${s <= step ? 'bg-cm' : 'bg-cm-100/50'}`}
          />
        ))}
      </div>

      {loading ? (
        <WizardLoadingScreen message={loadingMessages[step]} />
      ) : (
        <>
          {step === 0 && (
            <div className="text-center w-full">
              <h2 className="text-3xl font-bold mb-8">
                지난 스프린트에서 <br />
                완료하지 않은 항목은 다음과 같아요.
              </h2>
              <div className="text-lg text-gray-700 mb-4">
                이번 스프린트에서 고려할 항목을 선택해 주세요.
              </div>
              <div className="border-y">
                <Table>
                  <TableBody>
                    {incompletedTasksTable.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.original.id}
                        onClick={() => handleSelect(row.index)}
                        className="cursor-pointer hover:bg-muted/50"
                      >
                        {row.getVisibleCells().map((cell) => {
                          const widthClass =
                            {
                              select: 'w-1/12',
                              title: 'w-9/12',
                              position: 'w-2/12',
                            }[cell.column.id] ?? 'w-auto'

                          return (
                            <TableCell
                              key={cell.id}
                              className={`text-left ${widthClass}`}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          )
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Button
                variant="cm"
                onClick={goToNextStep}
                className="mt-8"
                disabled={loading}
              >
                {loading ? '스프린트 생성 중...' : '다음'}
              </Button>
            </div>
          )}

          {step === 1 && (
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-8">
                세부 태스크를 입력해 주세요.
              </h2>
              <div className="space-y-8">
                {epics.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    에픽 데이터를 불러오는 중입니다...
                  </div>
                ) : (
                  epics.map((epic) => (
                    <div key={epic.epicId} className="space-y-4 p-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold">{epic.title}</h3>
                        <span className="text-sm text-muted-foreground">
                          {epic.startDate?.split('-').slice(1).join('. ')} ~{' '}
                          {epic.endDate?.split('-').slice(1).join('. ')}
                        </span>
                      </div>

                      <DetailTaskTable
                        data={epic.task}
                        onDataChange={(updatedTasks) =>
                          handleTaskDataChange(epic.id, updatedTasks)
                        }
                        projectId={projectId || ''}
                        members={members}
                      />
                    </div>
                  ))
                )}

                <div className="text-center">
                  <Button
                    variant="cm"
                    onClick={goToNextStep}
                    className="mt-8"
                    disabled={loading || epics.length === 0}
                  >
                    {loading ? '스프린트 수정 중...' : '다음'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-8">
                스프린트 구성이 완료되었어요.
                <br />
                최종 검토해 주세요.
              </h2>
              <div className="space-y-8">
                {feedbackData.map((epic) => (
                  <div key={epic.epicId} className="space-y-4 p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-sm">
                          Epic {epic.id}
                        </Badge>
                        <h3 className="text-xl font-bold">{epic.title}</h3>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {epic.startDate?.split('-').slice(1).join('. ')} ~{' '}
                        {epic.endDate?.split('-').slice(1).join('. ')}
                      </span>
                    </div>

                    <SprintReviewTable data={epic.task} />
                  </div>
                ))}

                <div className="text-center flex gap-2 justify-center">
                  <Button
                    variant="cmoutline"
                    onClick={() => setStep(1)}
                    className="mt-8"
                  >
                    수정
                  </Button>
                  <Button
                    variant="cm"
                    onClick={handleComplete}
                    className="mt-8"
                  >
                    완료
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
