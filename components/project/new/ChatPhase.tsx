'use client'

import { phases } from '@/components/project/new/phases'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { FileUpload } from '@/components/ui/file-upload'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/useAuthStore'
import { TeamMember } from '@/types/NewProjectTeamMember'
import { Feature, Message, Phase } from '@/types/project-creation'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { EventSourcePolyfill } from 'event-source-polyfill'
import { ArrowUp, CalendarIcon, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'

import { DataTable } from './DataTable'
import { featureColumns } from './FeatureTable'
import { columns } from './columns'

type ChatPhaseProps = {
  phase: Phase
  onNext: () => void
  formPhaseInput: string
}

type EditingCell = {
  rowIndex: number
  columnId: string | undefined
} | null

function getInitialMemberData(count: number = 1): TeamMember[] {
  return Array.from({ length: count }, () => ({
    email: '',
    profile: {
      stacks: [],
      positions: [],
      projectId: '',
    },
  }))
}

export default function ChatPhase({
  phase,
  onNext,
  formPhaseInput,
}: ChatPhaseProps) {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: phase.question },
  ])
  const [input, setInput] = useState<string>('')
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [file, setFile] = useState<File | null>(null)
  const [skipFile, setSkipFile] = useState(false)
  const [tableData, setTableData] = useState<TeamMember[]>([])
  const [editingCell, setEditingCell] = useState<EditingCell>(null)

  const [projectTitle, setProjectTitle] = useState('')
  const [projectDescription, setProjectDescription] = useState(formPhaseInput)

  const user = useAuthStore((state) => state.user)

  const sendProjectDefinition = async () => {
    if (!user?.accessToken) return console.warn('JWT 토큰이 없습니다.')

    const members = tableData.map((member) => ({
      email: member.email ? member.email : 'pjookim@ajou.ac.kr',
      profile: {
        stacks: member.profile.stacks,
        positions: member.profile.positions,
        projectId: member.profile.projectId,
      },
    }))

    const body = {
      title: projectTitle,
      description: projectDescription
        ? projectDescription
        : '스터디 그룹을 매칭하고 관리하는 서비스',
      startDate: dateRange?.from?.toISOString().split('T')[0],
      endDate: dateRange?.to?.toISOString().split('T')[0],
      members,
      definitionUrl: file
        ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${file.name}`
        : '',
    }
    console.log(tableData)

    console.log(body)

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/test/definition`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.accessToken}`,
          },
          body: JSON.stringify(body),
        }
      )

      if (!res.ok) throw new Error(`정의서 전송 실패: ${res.status}`)
    } catch (error) {
      console.error('정의서 전송 에러:', error)
    }
  }

  const startSSE = () => {
    const token = user?.accessToken
    if (!token) return console.warn('JWT 토큰이 존재하지 않습니다.')

    const eventSource = new EventSourcePolyfill(
      `${process.env.NEXT_PUBLIC_API_URL}/sse/subscribe`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'text/event-stream',
        },
      }
    )

    eventSource.onopen = async () => {
      console.log('SSE 연결 성공')
      sendProjectDefinition()
    }

    eventSource.onmessage = (event) => {
      console.log(event)
      if (event.data) {
        addMessage('ai', event.data)
        setTimeout(onNext, 1000)
        eventSource.close()
      }
    }

    eventSource.addEventListener('create-feature-definition', (event) => {
      if ('data' in event) {
        const message = event as MessageEvent
        try {
          const parsed = JSON.parse(message.data)
          console.log('SSE 수신 (create-feature-definition):', parsed)

          const features: Feature[] = parsed?.suggestion?.features ?? []
          const suggestions = parsed?.suggestion?.suggestions ?? []

          if (features.length > 0 || suggestions.length > 0) {
            addMessage('ai', '기능 정의와 제안을 생성했습니다.', {
              features,
              suggestions,
            })
          }

          setTimeout(() => {
            eventSource.close()
            onNext()
          }, 1000)
        } catch (error) {
          console.error('SSE 데이터 파싱 오류:', error)
        }
      }
    })

    eventSource.onerror = (err) => {
      console.error('SSE 연결 오류:', err)
      eventSource.close()
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
    if (phase.inputType === 'dateRange' && dateRange) {
      if (dateRange.to) {
        messageText = `${format(dateRange.from!, 'PPP', { locale: ko })} ~ ${format(dateRange.to, 'PPP', { locale: ko })}`
      } else {
        messageText = format(dateRange.from!, 'PPP', { locale: ko })
      }
    } else if (phase.inputType === 'file') {
      messageText = skipFile
        ? '파일 업로드를 건너뜁니다.'
        : `파일 업로드: ${file?.name}`
    } else if (phase.inputType === 'number') {
      const memberCount = Number(input)
      if (!isNaN(memberCount) && memberCount > 0) {
        setTableData(getInitialMemberData(memberCount))
      }
    }

    if (phase.id === 1) setProjectDescription(input)
    if (phase.id === 2) setProjectTitle(input)

    addMessage('user', messageText)
    setInput('')
    setFile(null)
    setSkipFile(false)

    const currentIndex = phases.findIndex((p) => p.id === phase.id)
    const nextPhase = phases[currentIndex + 1]

    setTimeout(async () => {
      addMessage('ai', nextPhase?.question || '로딩중')

      if (!nextPhase || nextPhase.id > 6) {
        await sendProjectDefinition()
        startSSE()
      } else {
        onNext()
      }
    }, 1000)
  }

  const renderMessage = (msg: Message) => {
    if (msg.tableData) {
      return (
        <div className="w-full max-w-2xl">
          {msg.tableData.features && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">기능 목록</h3>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {featureColumns.map((column) => (
                        <TableHead key={column.id}>
                          {typeof column.header === 'string'
                            ? column.header
                            : '헤더'}
                        </TableHead>
                      ))}
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {msg.tableData.features.map((feature, index) => (
                      <TableRow key={index}>
                        {featureColumns.map((column) => (
                          <TableCell
                            key={column.id}
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={() =>
                              setEditingCell({
                                rowIndex: index,
                                columnId: column.id,
                              })
                            }
                          >
                            {editingCell?.rowIndex === index &&
                            editingCell?.columnId === column.id ? (
                              <Input
                                value={
                                  feature[column.id as keyof Feature] ?? ''
                                }
                                onChange={(e) => {
                                  const newFeatures = [
                                    ...msg.tableData!.features!,
                                  ]
                                  newFeatures[index] = {
                                    ...newFeatures[index],
                                    [column.id as keyof Feature]:
                                      e.target.value,
                                  }
                                  setMessages((prev) =>
                                    prev.map((m) =>
                                      m === msg
                                        ? {
                                            ...m,
                                            tableData: {
                                              ...m.tableData!,
                                              features: newFeatures,
                                            },
                                          }
                                        : m
                                    )
                                  )
                                }}
                                onBlur={() => setEditingCell(null)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    setEditingCell(null)
                                  }
                                }}
                                className="w-full"
                                autoFocus
                              />
                            ) : (
                              <div className="py-2">
                                {feature[column.id as keyof Feature] || (
                                  <span className="text-gray-400">
                                    {typeof column.header === 'string'
                                      ? column.header
                                      : '입력'}{' '}
                                    입력
                                  </span>
                                )}
                              </div>
                            )}
                          </TableCell>
                        ))}
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const newFeatures = [...msg.tableData!.features!]
                              newFeatures.splice(index, 1)
                              setMessages((prev) =>
                                prev.map((m) =>
                                  m === msg
                                    ? {
                                        ...m,
                                        tableData: {
                                          ...m.tableData!,
                                          features: newFeatures,
                                        },
                                      }
                                    : m
                                )
                              )
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell
                        colSpan={featureColumns.length + 1}
                        className="text-center py-4 cursor-pointer hover:bg-gray-100 font-medium text-blue-500"
                        onClick={() => {
                          const newFeatures = [
                            ...msg.tableData!.features!,
                            {
                              name: '',
                              useCase: '',
                              input: '',
                              output: '',
                            },
                          ]
                          setMessages((prev) =>
                            prev.map((m) =>
                              m === msg
                                ? {
                                    ...m,
                                    tableData: {
                                      ...m.tableData!,
                                      features: newFeatures,
                                    },
                                  }
                                : m
                            )
                          )
                        }}
                      >
                        기능 추가
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
          {msg.tableData.suggestions && (
            <div>
              <h3 className="font-semibold mb-2">제안</h3>
              {msg.tableData.suggestions.map((suggestion, index) => (
                <div key={index} className="mb-4">
                  <p className="font-medium mb-1">{suggestion.question}</p>
                  <ul className="list-disc pl-5">
                    {suggestion.answers.map((answer, ansIndex) => (
                      <li key={ansIndex}>{answer}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )
    }

    return (
      <div
        className={`px-3 py-2 rounded-lg text-md max-w-xs break-words ${
          msg.sender === 'user'
            ? 'bg-[#795548] text-white'
            : 'bg-[#EFEAE8] text-gray-900'
        }`}
      >
        {msg.text}
      </div>
    )
  }

  const renderInput = () => {
    const renderSendButton = () => (
      <Button
        onClick={handleSendMessage}
        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full w-8 h-8 flex items-center justify-center"
        disabled={
          !input.trim() && !dateRange && !file && !skipFile && !tableData
        }
      >
        <ArrowUp className="h-6 w-6" />
      </Button>
    )

    switch (phase.inputType) {
      case 'number':
        return (
          <div className="relative flex-1 flex gap-2">
            <Input
              type="number"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="숫자를 입력하세요"
              className="flex-1"
            />
            {renderSendButton()}
          </div>
        )
      case 'table':
        return (
          <div className="relative flex-1 flex gap-2">
            <DataTable
              data={tableData}
              onDataChange={setTableData}
              columns={columns}
            />
            {renderSendButton()}
          </div>
        )
      case 'dateRange':
        return (
          <div className="relative flex-1 flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  className={cn(
                    'flex-1 justify-start text-left font-normal',
                    !dateRange && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, 'PPP', { locale: ko })} -{' '}
                        {format(dateRange.to, 'PPP', { locale: ko })}
                      </>
                    ) : (
                      format(dateRange.from, 'PPP', { locale: ko })
                    )
                  ) : (
                    <span>기간을 선택하세요</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            {renderSendButton()}
          </div>
        )
      case 'file':
        return (
          <div className="relative flex-1 flex gap-2">
            <FileUpload
              value={file}
              skip={skipFile}
              onFileChange={setFile}
              onSkipChange={setSkipFile}
              accept=".pdf,.doc,.docx"
              className="flex-1"
            />
            {renderSendButton()}
          </div>
        )
      default:
        return (
          <div className="relative flex gap-2 flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="메시지를 입력하세요..."
              className="flex-1 border border-input px-3 py-2 rounded-2xl bg-muted resize-none min-h-[24px] max-h-[calc(75dvh)] pb-10"
              rows={2}
              autoFocus
            />
            {renderSendButton()}
          </div>
        )
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-4 pb-60">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {renderMessage(msg)}
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white p-4 flex items-center gap-2">
        <div className="w-full max-w-4xl mx-auto flex gap-2">
          {renderInput()}
        </div>
      </div>
    </div>
  )
}
