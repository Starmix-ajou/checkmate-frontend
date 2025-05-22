import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getProjectMembers } from '@/lib/api/sprintConfiguration'
import { Member } from '@/types/project'
import { TaskRow } from '@/types/sprint'
import '@/types/table'
import { CellContext, ColumnDef } from '@tanstack/react-table'
import clsx from 'clsx'
import { useEffect, useState } from 'react'

import { EditableTable } from './EditableTable'

type TableMetaType = {
  projectId: string
  updateData: (rowIndex: number, columnId: string, value: unknown) => void
}

const DEFAULT_ROW: TaskRow = {
  title: '',
  position: '',
  assignee: '',
  priority: 'MEDIUM',
  startDate: '',
  endDate: '',
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

interface DetailTaskTableProps {
  data: TaskRow[]
  onDataChange: (data: TaskRow[]) => void
  projectId: string
}

function EditableCell({
  getValue,
  row,
  column,
  table,
}: CellContext<TaskRow, unknown>) {
  const value = getValue()
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadMembers = async () => {
      const meta = table.options.meta as TableMetaType
      const projectId = meta?.projectId
      if (!projectId) return

      setIsLoading(true)
      setError(null)
      try {
        const memberData = await getProjectMembers(projectId)
        if (Array.isArray(memberData)) {
          setMembers(memberData)
        } else {
          console.error('멤버 데이터가 배열이 아닙니다:', memberData)
          setError('멤버 데이터 형식이 올바르지 않습니다.')
        }
      } catch (error) {
        console.error('멤버 정보 로딩 실패:', error)
        setError('멤버 정보를 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }
    loadMembers()
  }, [table.options.meta])

  if (column.id === 'priority') {
    const typedValue = typeof value === 'string' ? value : ''
    const meta = table.options.meta as TableMetaType

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
    const meta = table.options.meta as TableMetaType

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
    const selectedMember = members.find((member) => member.email === typedValue)
    const meta = table.options.meta as TableMetaType

    return (
      <Select
        value={typedValue}
        onValueChange={(val) => meta?.updateData(row.index, column.id, val)}
        disabled={isLoading}
      >
        <SelectTrigger className="w-full border-none bg-transparent shadow-none">
          <SelectValue
            placeholder={
              isLoading ? '로딩 중...' : error ? '오류 발생' : '담당자 선택'
            }
          >
            {selectedMember ? selectedMember.name : typedValue}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {error ? (
            <SelectItem value="error" disabled>
              {error}
            </SelectItem>
          ) : members.length === 0 ? (
            <SelectItem value="no-members" disabled>
              {isLoading ? '로딩 중...' : '멤버가 없습니다'}
            </SelectItem>
          ) : (
            members.map((member) => (
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

  const meta = table.options.meta as TableMetaType
  return (
    <Input
      value={typeof value === 'string' ? value : ''}
      onChange={(e) => meta?.updateData(row.index, column.id, e.target.value)}
      className="w-full border-none shadow-none"
      placeholder="작업 내용을 입력하세요"
    />
  )
}

const columns: ColumnDef<TaskRow>[] = [
  {
    accessorKey: 'title',
    header: '작업',
    cell: EditableCell,
  },
  {
    accessorKey: 'priority',
    header: '우선순위',
    cell: EditableCell,
  },
  {
    accessorKey: 'assignee',
    header: '담당자',
    cell: EditableCell,
  },
]

export function DetailTaskTable({
  data,
  onDataChange,
  projectId,
}: DetailTaskTableProps) {
  return (
    <EditableTable
      data={data}
      columns={columns}
      onDataChange={onDataChange}
      addButtonText="+ Add"
      defaultRow={DEFAULT_ROW}
      meta={{ projectId }}
    />
  )
}
