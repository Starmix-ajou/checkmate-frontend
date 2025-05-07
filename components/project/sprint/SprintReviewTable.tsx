import { Badge } from '@/components/ui/badge'
import { ColumnDef } from '@tanstack/react-table'
import clsx from 'clsx'

import { ReadOnlyTable } from './ReadOnlyTable'

interface TaskRow {
  title: string
  position: string
  assignee: string
  period: string
}

const columns: ColumnDef<TaskRow>[] = [
  {
    accessorKey: 'title',
    header: '작업',
    cell: ({ getValue }) => getValue() as string,
  },
  {
    accessorKey: 'position',
    header: '포지션',
    cell: ({ getValue }) => {
      const value = getValue() as string
      return (
        <Badge
          className={clsx(
            'px-2 py-1 text-sm',
            value === 'Frontend' && 'bg-orange-100 text-orange-600',
            value === 'Backend' && 'bg-blue-100 text-blue-600',
            value === 'AI' && 'bg-pink-100 text-pink-600'
          )}
        >
          {value}
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
    accessorKey: 'period',
    header: '기간',
    cell: ({ getValue }) => getValue() as string,
  },
]

export function SprintReviewTable({ data }: { data: TaskRow[] }) {
  return <ReadOnlyTable data={data} columns={columns} />
}
