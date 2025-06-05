import { Member } from '@cm/types/project'
import { ActionItemRow } from '@cm/types/sprint'
import { Epic } from '@cm/types/sprint'
import { Badge } from '@cm/ui/components/ui/badge'
import { Input } from '@cm/ui/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@cm/ui/components/ui/select'
import { CellContext, ColumnDef } from '@tanstack/react-table'
import clsx from 'clsx'

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
  const meta = table.options.meta as TableMetaType & { members: Member[]; epics: Epic[] }

  if (column.id === 'epic') {
    const typedValue = typeof value === 'string' ? value : ''
    const selectedEpic = meta.epics.find((epic) => epic.epicId === typedValue)
    const epicTitle = selectedEpic?.title || ''

    return (
      <Select
        value={typedValue}
        onValueChange={(val) => meta?.updateData(row.index, column.id, val)}
      >
        <SelectTrigger className="w-full border-none bg-transparent shadow-none">
          <SelectValue placeholder="에픽 선택">
            {epicTitle && (
              <Badge className="max-w-[150px] truncate bg-purple-100 text-purple-600">
                {epicTitle.length > 15 ? `${epicTitle.slice(0, 15)}...` : epicTitle}
              </Badge>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {meta.epics.length === 0 ? (
            <SelectItem value="no-epics" disabled>
              에픽이 없습니다
            </SelectItem>
          ) : (
            meta.epics.map((epic) => (
              <SelectItem key={epic.epicId} value={epic.epicId}>
                <Badge className="max-w-[150px] truncate bg-purple-100 text-purple-600">
                  {epic.title.length > 15 ? `${epic.title.slice(0, 15)}...` : epic.title}
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
    return (
      <Input
        type="date"
        value={typedValue}
        onChange={(e) => meta?.updateData(row.index, column.id, e.target.value)}
        className="w-full border-none shadow-none"
      />
    )
  }

  if (column.id === 'priority') {
    const typedValue = typeof value === 'string' ? value : ''

    return (
      <Select
        value={typedValue}
        onValueChange={(val) => meta?.updateData(row.index, column.id, val)}
      >
        <SelectTrigger className="w-full border-none bg-transparent shadow-none">
          <SelectValue placeholder="우선순위 선택" />
        </SelectTrigger>
        <SelectContent>
          {PRIORITY_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              <Badge
                className={clsx(
                  'px-2 py-1 text-sm',
                  opt.value === 'HIGH' && 'bg-red-100 text-red-600',
                  opt.value === 'MEDIUM' && 'bg-yellow-100 text-yellow-600',
                  opt.value === 'LOW' && 'bg-green-100 text-green-600'
                )}
              >
                {opt.label}
              </Badge>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  if (column.id === 'position') {
    const typedValue = typeof value === 'string' ? value : ''

    return (
      <Select
        value={typedValue}
        onValueChange={(val) => meta?.updateData(row.index, column.id, val)}
      >
        <SelectTrigger className="w-full border-none bg-transparent shadow-none">
          <SelectValue placeholder="역할 선택" />
        </SelectTrigger>
        <SelectContent>
          {POSITION_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              <Badge
                className={clsx(
                  'px-2 py-1 text-sm',
                  opt.value === 'Frontend' && 'bg-orange-100 text-orange-600',
                  opt.value === 'Backend' && 'bg-blue-100 text-blue-600',
                  opt.value === 'AI' && 'bg-pink-100 text-pink-600'
                )}
              >
                {opt.label}
              </Badge>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  if (column.id === 'assignee') {
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
      placeholder="작업 내용을 입력하세요"
    />
  )
}

const columns: ColumnDef<ActionItemRow>[] = [
  {
    accessorKey: 'title',
    header: '작업',
    cell: EditableCell,
  },
  {
    accessorKey: 'epic',
    header: '에픽',
    cell: EditableCell,
  },
  {
    accessorKey: 'endDate',
    header: '종료일',
    cell: EditableCell,
  },
  {
    accessorKey: 'assignee',
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
