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
import { TeamMember } from '@/types/NewProjectTeamMember'
import { Phase } from '@/types/project-creation'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { ArrowUp, CalendarIcon } from 'lucide-react'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'

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
}: ChatInputProps) {
  const [emailError, setEmailError] = useState<string>('')

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateTableData = (): boolean => {
    if (tableData.length === 0) {
      setEmailError('최소 한 명의 팀 멤버를 추가해주세요.')
      return false
    }

    for (const member of tableData) {
      if (!validateEmail(member.email)) {
        setEmailError('유효한 이메일 주소를 입력해주세요.')
        return false
      }
      if (member.positions.length === 0) {
        setEmailError('모든 멤버의 역할을 선택해주세요.')
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
            {emailError && (
              <p className="text-sm text-red-500 mt-1">{emailError}</p>
            )}
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
              accept=".pdf,.doc,.docx"
              className="flex-1"
              disabled={skipFile}
            />
          </div>
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
