import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import '@/types/table'
import { CellContext, ColumnDef } from '@tanstack/react-table'
import clsx from 'clsx'

import { EditableTable } from './EditableTable'

interface TaskRow {
  title: string
  position: string
  assignee: string
  period: string
}

const DEFAULT_ROW: TaskRow = {
  title: '',
  position: '',
  assignee: '',
  period: '',
}

const POSITION_OPTIONS = [
  { value: 'Frontend', label: 'Frontend' },
  { value: 'Backend', label: 'Backend' },
  { value: 'AI', label: 'AI' },
]

const ASSIGNEE_OPTIONS = [
  { value: '김평주', label: '김평주' },
  { value: '한도연', label: '한도연' },
  { value: '조성연', label: '조성연' },
  { value: '박승연', label: '박승연' },
]

function EditableCell({
  getValue,
  row,
  column,
  table,
}: CellContext<TaskRow, unknown>) {
  const value = getValue()

  if (column.id === 'position') {
    const typedValue = typeof value === 'string' ? value : ''

    return (
      <Select
        value={typedValue}
        onValueChange={(val) =>
          table.options.meta?.updateData(row.index, column.id, val)
        }
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

    return (
      <Select
        value={typedValue}
        onValueChange={(val) =>
          table.options.meta?.updateData(row.index, column.id, val)
        }
      >
        <SelectTrigger className="w-full border-none bg-transparent shadow-none">
          <SelectValue placeholder="담당자 선택" />
        </SelectTrigger>
        <SelectContent>
          {ASSIGNEE_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  return (
    <Input
      value={typeof value === 'string' ? value : ''}
      onChange={(e) =>
        table.options.meta?.updateData(row.index, column.id, e.target.value)
      }
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
    accessorKey: 'position',
    header: '포지션',
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
}: {
  data: TaskRow[]
  onDataChange: (data: TaskRow[]) => void
}) {
  return (
    <EditableTable
      data={data}
      columns={columns}
      onDataChange={onDataChange}
      addButtonText="+ Add"
      defaultRow={DEFAULT_ROW}
    />
  )
}
