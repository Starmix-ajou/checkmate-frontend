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
}: ChatInputProps) {
  const renderSendButton = () => (
    <Button
      onClick={onSend}
      className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full w-8 h-8 flex items-center justify-center"
      disabled={!input.trim() && !dateRange && !file && !skipFile && !tableData}
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
          <TeamMemberTable data={tableData} onDataChange={setTableData} />
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
