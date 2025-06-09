import { TeamMember } from '@cm/types/NewProjectTeamMember'
import { Phase } from '@cm/types/project-creation'
import { Button } from '@cm/ui/components/ui/button'
import { Calendar } from '@cm/ui/components/ui/calendar'
import { FileUpload } from '@cm/ui/components/ui/file-upload'
import { Input } from '@cm/ui/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@cm/ui/components/ui/popover'
import { cn } from '@cm/ui/lib/utils'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { ArrowUp, CalendarIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { toast } from 'sonner'

import { TeamMemberTable } from './TeamMemberTable'

type ChatInputProps = {
  phase: Phase
  input: string
  setInput: (value: string) => void
  dateRange: DateRange | undefined
  setDateRange: (value: DateRange | undefined) => void
  file: File | null
  setFile: (value: File | null) => void
  skipFile: boolean
  setSkipFile: (value: boolean) => void
  tableData: TeamMember[]
  setTableData: (value: TeamMember[]) => void
  onSend: () => void
  isLoading?: boolean
  selectedSuggestions?: {
    question: string
    answers: string[]
  }[]
}

export function ChatInput({
  phase,
  input,
  setInput,
  dateRange,
  setDateRange,
  file,
  setFile,
  skipFile,
  setSkipFile,
  tableData,
  setTableData,
  onSend,
  isLoading = false,
  selectedSuggestions = [],
}: ChatInputProps) {
  const [emailError, setEmailError] = useState<string>('')
  const shouldAutoSend = useRef(false)

  useEffect(() => {
    if (shouldAutoSend.current && input) {
      shouldAutoSend.current = false
      onSend()
    }
  }, [input, onSend])

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateTableData = (): boolean => {
    if (tableData.length === 0) {
      toast.error('최소 한 명의 팀 멤버를 추가해주세요.')
      return false
    }

    for (const member of tableData) {
      if (!validateEmail(member.email)) {
        toast.error('유효한 이메일 주소를 입력해주세요.')
        return false
      }
      if (member.positions.length === 0) {
        toast.error('모든 멤버의 역할을 선택해주세요.')
        return false
      }
    }
    setEmailError('')
    return true
  }

  const handleSend = () => {
    if (phase.inputType === 'table' && !validateTableData()) {
      return
    }
    onSend()
  }

  const handleQuickResponse = (response: string) => {
    shouldAutoSend.current = true
    setInput(response)
  }

  const isSendButtonDisabled = () => {
    if (isLoading) return true
    if (phase.inputType === 'table') {
      return tableData.length === 0
    }
    if (phase.inputType === 'file') {
      return !file && !skipFile
    }
    return !input.trim() && !dateRange && !file && !skipFile && !tableData
  }

  const renderSendButton = () => (
    <Button
      onClick={handleSend}
      className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full w-8 h-8 flex items-center justify-center"
      disabled={isSendButtonDisabled()}
    >
      <ArrowUp className="h-6 w-6" />
    </Button>
  )

  const renderQuickResponses = () => {
    if (phase.id < 6) return null

    const quickResponses = [
      <Button
        key="default"
        variant="outline"
        size="sm"
        className="text-sm"
        onClick={() => handleQuickResponse('좋아요. 이대로 진행해 주세요.')}
        disabled={isLoading}
      >
        좋아요. 이대로 진행해 주세요.
      </Button>,
    ]

    if (phase.id === 6 && selectedSuggestions.length > 0) {
      const totalSelectedAnswers = selectedSuggestions.reduce(
        (acc, curr) => acc + curr.answers.length,
        0
      )
      quickResponses.push(
        <Button
          key="add-selected"
          variant="outline"
          size="sm"
          className="text-sm"
          onClick={() =>
            handleQuickResponse(
              `체크한 ${totalSelectedAnswers}개 기능을 추가해줘`
            )
          }
          disabled={isLoading}
        >
          체크한 {totalSelectedAnswers}개 기능을 추가해줘
        </Button>
      )
    }

    return <div className="flex gap-2 mb-2">{quickResponses}</div>
  }

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
          <div className="flex flex-col gap-2 flex-1">
            <TeamMemberTable data={tableData} onDataChange={setTableData} />
          </div>
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
                numberOfMonths={3}
              />
            </PopoverContent>
          </Popover>
          {renderSendButton()}
        </div>
      )
    case 'file':
      return (
        <div className="relative flex-1 flex gap-2">
          <div className="flex flex-col gap-2 flex-1">
            <FileUpload
              value={file}
              skip={skipFile}
              onFileChange={setFile}
              onSkipChange={(value) => {
                setSkipFile(value)
                if (value) {
                  setFile(null)
                }
              }}
              accept=".txt,.pdf,.doc,.docx"
              className="flex-1"
              disabled={skipFile || isLoading}
            />
          </div>
          {renderSendButton()}
        </div>
      )
    default:
      return (
        <div className="relative flex flex-col gap-2 flex-1">
          {renderQuickResponses()}
          <div className="relative flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                phase.id >= 6 ? phase.question : '메시지를 입력해 주세요'
              }
              className="flex-1 border border-input px-3 py-2 rounded-2xl bg-muted resize-none min-h-[24px] max-h-[calc(75dvh)] pb-10 placeholder:text-muted-foreground/70"
              rows={2}
              autoFocus
            />
            {renderSendButton()}
          </div>
        </div>
      )
  }
}
