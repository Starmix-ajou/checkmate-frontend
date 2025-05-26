import { Feature } from '@/types/project-creation'
import '@/types/table'
import { Input } from '@cm/ui/components/ui/input'
import { CellContext, ColumnDef } from '@tanstack/react-table'

import { GenericEditableTable } from './GenericEditableTable'

function EditableCell({
  getValue,
  row,
  column,
  table,
}: CellContext<Feature, unknown>) {
  const value = getValue() as string
  const readOnly = table.options.meta?.readOnly

  return readOnly ? (
    <div className="w-full py-2">{value}</div>
  ) : (
    <Input
      value={value || ''}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        table.options.meta?.updateData(row.index, column.id, e.target.value)
      }
      className="w-full text-xs"
      placeholder={`${column.id}을(를) 입력하세요`}
    />
  )
}

export const featureColumns: ColumnDef<Feature>[] = [
  {
    accessorKey: 'name',
    header: '기능명',
    cell: EditableCell,
  },
  {
    accessorKey: 'useCase',
    header: '사용 사례',
    cell: EditableCell,
  },
  {
    accessorKey: 'input',
    header: '입력',
    cell: EditableCell,
  },
  {
    accessorKey: 'output',
    header: '출력',
    cell: EditableCell,
  },
]

type FeatureTableProps = {
  data: Feature[]
  onDataChange: (data: Feature[]) => void
  readOnly?: boolean
}

export function FeatureTable({
  data,
  onDataChange,
  readOnly = false,
}: FeatureTableProps) {
  return (
    <GenericEditableTable
      data={data}
      columns={featureColumns}
      onDataChange={onDataChange}
      addButtonText="기능 추가"
      emptyStateText="기능이 없습니다."
      defaultRow={{
        featureId: '',
        name: '',
        useCase: '',
        input: '',
        output: '',
      }}
      readOnly={readOnly}
    />
  )
}
