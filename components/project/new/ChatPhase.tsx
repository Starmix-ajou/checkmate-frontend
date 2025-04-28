import { phases } from '@/components/project/new/phases'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { FileUpload } from '@/components/ui/file-upload'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Position, TeamMember } from '@/types/NewProjectTeamMember'
import { Phase } from '@/types/phase'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { ArrowUp, CalendarIcon } from 'lucide-react'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'

import { DataTable } from './DataTable'
import { columns } from './columns'

type Message = {
  sender: 'user' | 'ai'
  text: string
}

type ChatPhaseProps = {
  phase: Phase
  onNext: () => void
}

function getMemberData(): TeamMember[] {
  return [
    {
      email: '',
      positions: '' as Position,
      stacks: [],
    },
  ]
}

export default function ChatPhase({ phase, onNext }: ChatPhaseProps) {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: phase.question },
  ])
  const [input, setInput] = useState<string>('')
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [file, setFile] = useState<File | null>(null)
  const [skipFile, setSkipFile] = useState(false)
  const [tableData, setTableData] = useState<TeamMember[]>(getMemberData())

  const handleSaveData = (savedData: TeamMember[]) => {
    setTableData(savedData)
    console.log('저장된 데이터:', savedData)
  }

  const handleSendMessage = () => {
    if (!input.trim() && !dateRange && !file && !skipFile && !tableData) return

    let messageText = input
    if (phase.inputType === 'dateRange' && dateRange) {
      if (dateRange.to) {
        messageText = `${format(dateRange.from!, 'PPP', { locale: ko })} ~ ${format(
          dateRange.to,
          'PPP',
          { locale: ko }
        )}`
      } else {
        messageText = format(dateRange.from!, 'PPP', { locale: ko })
      }
    } else if (phase.inputType === 'file') {
      if (skipFile) {
        messageText = '파일 업로드를 건너뜁니다.'
      } else if (file) {
        messageText = `파일 업로드: ${file.name}`
      }
    }

    const userMessage: Message = { sender: 'user', text: messageText }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setDateRange(undefined)
    setFile(null)
    setSkipFile(false)

    setTimeout(() => {
      const nextPhaseIndex = phases.findIndex((p) => p.id === phase.id) + 1
      const nextQuestion =
        phases[nextPhaseIndex]?.question || '마지막 질문입니다.'

      const aiMessage: Message = {
        sender: 'ai',
        text: nextQuestion,
      }
      setMessages((prev) => [...prev, aiMessage])
      setTimeout(onNext, 1000)
    }, 1000)
  }

  const renderInput = () => {
    const renderSendButton = () => (
      <div>
        <Button
          onClick={handleSendMessage}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full w-8 h-8 flex items-center justify-center"
          disabled={
            !input.trim() && !dateRange && !file && !skipFile && !tableData
          }
        >
          <ArrowUp className="h-6 w-6" />
        </Button>
      </div>
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
              columns={columns}
              data={tableData}
              onSave={handleSaveData}
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
      <div className="flex-1 space-y-4 pb-20">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <Avatar className="w-8 h-8 mr-2">
                <AvatarImage src="/bot-avatar.png" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
            )}
            <div
              className={`px-3 py-2 rounded-lg text-sm max-w-xs break-words ${
                msg.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white p-4 flex items-center gap-2">
        <div className="w-full max-w-5xl mx-auto flex gap-2">
          {renderInput()}
        </div>
      </div>
    </div>
  )
}
