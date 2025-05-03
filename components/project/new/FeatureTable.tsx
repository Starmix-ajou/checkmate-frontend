import { Feature } from '@/types/project-creation'
import { ColumnDef } from '@tanstack/react-table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

interface EditableCellProps {
  getValue: () => unknown
  row: { index: number }
  column: { id: string }
  table: {
    options: {
      meta?: {
        updateData: (rowIndex: number, columnId: string, value: unknown) => void
      }
    }
  }
}

function EditableCell({ getValue, row, column, table }: EditableCellProps) {
  const value = getValue() as string

  return (
    <Input
      value={value || ''}
      onChange={(e) =>
        table.options.meta?.updateData(row.index, column.id, e.target.value)
      }
      className="w-full"
      placeholder={`${column.id}을(를) 입력하세요`}
    />
  )
}

const defaultColumn: Partial<ColumnDef<Feature>> = {
  cell: (props) => <EditableCell {...props} />,
}

export const featureColumns: ColumnDef<Feature>[] = [
  { id: 'name', accessorKey: 'name', header: '기능명' },
  { id: 'useCase', accessorKey: 'useCase', header: '사용 사례' },
  { id: 'input', accessorKey: 'input', header: '입력' },
  { id: 'output', accessorKey: 'output', header: '출력' },
]

export { defaultColumn } 