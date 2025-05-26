import { Badge } from '@cm/ui/components/ui/badge'
import { ColumnDef } from '@tanstack/react-table'
import clsx from 'clsx'

import { ReadOnlyTable } from './ReadOnlyTable'

interface TaskRow {
  title: string
  position: string
  assignee: string
  startDate: string
  endDate: string
  priority?: string
}

const columns: ColumnDef<TaskRow>[] = [
  {
    accessorKey: 'title',
    header: '작업',
    cell: ({ getValue }) => getValue() as string,
  },
  {
    accessorKey: 'priority',
    header: '우선순위',
    cell: ({ getValue }) => {
      const value = getValue() as string
      return (
        <Badge
          className={clsx(
            'px-2 py-1 text-sm',
            value === 'HIGH' && 'bg-red-100 text-red-600',
            value === 'MEDIUM' && 'bg-yellow-100 text-yellow-600',
            value === 'LOW' && 'bg-green-100 text-green-600'
          )}
        >
          {value === 'HIGH' ? '높음' : value === 'MEDIUM' ? '중간' : '낮음'}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'assignee',
    header: '담당자',
    cell: ({ getValue }) => getValue() as string,
  },
  {
    accessorKey: 'startDate',
    header: '시작일',
    cell: ({ getValue }) => {
      const date = getValue() as string
      return date.split('-').slice(1).join('. ')
    },
  },
  {
    accessorKey: 'endDate',
    header: '종료일',
    cell: ({ getValue }) => {
      const date = getValue() as string
      return date.split('-').slice(1).join('. ')
    },
  },
]

export function SprintReviewTable({ data }: { data: TaskRow[] }) {
  return <ReadOnlyTable data={data} columns={columns} />
}
