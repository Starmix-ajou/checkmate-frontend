import { Member } from '@cm/types/project'
import { ActionItemRow } from '@cm/types/sprint'
import { Epic } from '@cm/types/sprint'
import { Badge } from '@cm/ui/components/ui/badge'
import { Button } from '@cm/ui/components/ui/button'
import { Calendar } from '@cm/ui/components/ui/calendar'
import { Input } from '@cm/ui/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@cm/ui/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@cm/ui/components/ui/select'
import { CellContext, ColumnDef } from '@tanstack/react-table'
import clsx from 'clsx'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'

import { EditableTable } from './EditableTable'

type TableMetaType = {
  projectId: string
  updateData: (rowIndex: number, columnId: string, value: unknown) => void
}

const getTodayString = () => {
  const today = new Date()
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
}

const DEFAULT_ROW: ActionItemRow = {
  title: '',
  assigneeEmail: '',
  epicId: '',
  startDate: getTodayString(),
  endDate: getTodayString(),
}

const POSITION_OPTIONS = [
  { value: 'Frontend', label: 'Frontend' },
  { value: 'Backend', label: 'Backend' },
  { value: 'AI', label: 'AI' },
]

const PRIORITY_OPTIONS = [
  { value: 'HIGH', label: '높음' },
  { value: 'MEDIUM', label: '중간' },
  { value: 'LOW', label: '낮음' },
]

interface ActionItemsTableProps {
  data: ActionItemRow[]
  onDataChange: (data: ActionItemRow[]) => void
  projectId: string
  members: Member[]
  epics: Epic[]
  canAdd?: boolean
}

function EditableCell({
  getValue,
  row,
  column,
  table,
}: CellContext<ActionItemRow, unknown>) {
  const value = getValue()
  const meta = table.options.meta as TableMetaType & {
    members: Member[]
    epics: Epic[]
  }

  if (column.id === 'epicId') {
    const typedValue = typeof value === 'string' ? value : ''
    const selectedEpic = meta.epics.find((epic) => epic.epicId === typedValue)
    const epicTitle = selectedEpic?.title || ''

    return (
      <Select
        value={typedValue}
        onValueChange={(val) => meta?.updateData(row.index, column.id, val)}
      >
        <SelectTrigger className="w-full border-none bg-transparent shadow-none">
          <SelectValue placeholder="Epic 선택">
            {epicTitle && (
              <Badge className="max-w-[150px] truncate bg-accent text-primary">
                {epicTitle.length > 15
                  ? `${epicTitle.slice(0, 15)}...`
                  : epicTitle}
              </Badge>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {meta.epics.length === 0 ? (
            <SelectItem value="no-epics" disabled>
              Epic이 없습니다
            </SelectItem>
          ) : (
            meta.epics.map((epic) => (
              <SelectItem key={epic.epicId} value={epic.epicId}>
                <Badge className="max-w-[150px] truncate bg-accent text-primary">
                  {epic.title.length > 15
                    ? `${epic.title.slice(0, 15)}...`
                    : epic.title}
                </Badge>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    )
  }

  if (column.id === 'endDate') {
    const typedValue = typeof value === 'string' ? value : ''
    const date = typedValue ? new Date(typedValue) : undefined

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className={clsx(
              'w-full justify-start text-left font-normal border-none shadow-none',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'PPP', { locale: ko }) : '날짜 선택'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            defaultMonth={date}
            onSelect={(date) => {
              if (date) {
                const formattedDate = format(date, 'yyyy-MM-dd')
                meta?.updateData(row.index, column.id, formattedDate)
              }
            }}
            initialFocus
            locale={ko}
          />
        </PopoverContent>
      </Popover>
    )
  }

  if (column.id === 'assigneeEmail') {
    const typedValue = typeof value === 'string' ? value : ''
    const selectedMember = meta.members.find(
      (member) => member.email === typedValue
    )

    return (
      <Select
        value={typedValue}
        onValueChange={(val) => meta?.updateData(row.index, column.id, val)}
      >
        <SelectTrigger className="w-full border-none bg-transparent shadow-none">
          <SelectValue placeholder="담당자 선택">
            {selectedMember ? selectedMember.name : typedValue}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {meta.members.length === 0 ? (
            <SelectItem value="no-members" disabled>
              멤버가 없습니다
            </SelectItem>
          ) : (
            meta.members.map((member) => (
              <SelectItem
                key={member.userId}
                value={member.email || `member-${member.userId}`}
              >
                {member.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    )
  }

  return (
    <Input
      value={typeof value === 'string' ? value : ''}
      onChange={(e) => meta?.updateData(row.index, column.id, e.target.value)}
      className="w-full border-none shadow-none"
      placeholder="Task를 입력하세요"
    />
  )
}

const columns: ColumnDef<ActionItemRow>[] = [
  {
    accessorKey: 'title',
    header: 'Task',
    cell: EditableCell,
  },
  {
    accessorKey: 'epicId',
    header: 'Epic',
    cell: EditableCell,
  },
  {
    accessorKey: 'endDate',
    header: '종료일',
    cell: EditableCell,
  },
  {
    accessorKey: 'assigneeEmail',
    header: '담당자',
    cell: EditableCell,
  },
]

export function ActionItemsTable({
  data,
  onDataChange,
  projectId,
  members,
  epics,
  canAdd = true,
}: ActionItemsTableProps) {
  return (
    <EditableTable
      data={data}
      columns={columns}
      onDataChange={onDataChange}
      addButtonText="+ Add"
      defaultRow={DEFAULT_ROW}
      meta={{ projectId, members, epics }}
      canAddRow={canAdd}
    />
  )
}
