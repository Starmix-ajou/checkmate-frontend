'use client'

import { Badge } from '@/components/ui/badge'
import { Position, Stack, TeamMember } from '@/types/NewProjectTeamMember'
import { ColumnDef, RowData } from '@tanstack/react-table'
import CreatableSelect from 'react-select/creatable'

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (
      rowIndex: number,
      columnId: string,
      value: unknown | TData
    ) => void
  }
}

const getEnumOptions = (e: object) =>
  Object.values(e).map((value) => ({ label: value, value }))

const ROLE_OPTIONS = getEnumOptions(Position)
const STACK_OPTIONS = getEnumOptions(Stack)

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
  const value = getValue()

  if (column.id === 'positions') {
    return (
      <div className="flex flex-col gap-2">
        <CreatableSelect
          menuPortalTarget={
            typeof document !== 'undefined' ? document.body : null
          }
          styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          options={ROLE_OPTIONS.filter(
            (option) => !(value as Position[])?.includes(option.value as Position)
          )}
          onChange={(option) => {
            if (!option) return
            const currentValue = value as Position[] || []
            const newValue = [...currentValue, option.value as Position]
            table.options.meta?.updateData(row.index, column.id, newValue)
          }}
          placeholder="역할을 선택하거나 입력하세요"
          className="w-full"
          isClearable
          formatCreateLabel={(inputValue) => `"${inputValue}" 추가`}
        />
        <div className="flex flex-wrap gap-1">
          {((value as Position[]) || []).map((position, idx) => (
            <Badge key={idx} className="flex items-center gap-1">
              {position}
              <button
                type="button"
                onClick={() => {
                  const newValue = (value as Position[]).filter(
                    (item) => item !== position
                  )
                  table.options.meta?.updateData(row.index, column.id, newValue)
                }}
                className="ml-1 text-xs"
              >
                ✕
              </button>
            </Badge>
          ))}
        </div>
      </div>
    )
  }

  if (column.id === 'stacks') {
    return (
      <div className="flex flex-col gap-2">
        <CreatableSelect
          menuPortalTarget={
            typeof document !== 'undefined' ? document.body : null
          }
          styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          options={STACK_OPTIONS.filter(
            (option) => !(value as Stack[])?.includes(option.value)
          )}
          onChange={(option) => {
            if (!option) return
            const currentValue = value as Stack[] || []
            const newValue = [...currentValue, option.value as Stack]
            table.options.meta?.updateData(row.index, column.id, newValue)
          }}
          placeholder="스택을 추가하거나 입력하세요"
          className="w-full"
          isClearable
          formatCreateLabel={(inputValue) => `"${inputValue}" 추가`}
        />
        <div className="flex flex-wrap gap-1">
          {((value as Stack[]) || []).map((stack, idx) => (
            <Badge key={idx} className="flex items-center gap-1">
              {stack}
              <button
                type="button"
                onClick={() => {
                  const newValue = (value as Stack[]).filter(
                    (item) => item !== stack
                  )
                  table.options.meta?.updateData(row.index, column.id, newValue)
                }}
                className="ml-1 text-xs"
              >
                ✕
              </button>
            </Badge>
          ))}
        </div>
      </div>
    )
  }

  return (
    <input
      value={typeof value === 'string' ? value : ''}
      onChange={(e) =>
        table.options.meta?.updateData(row.index, column.id, e.target.value)
      }
      className="w-full border rounded p-1"
      placeholder="이메일을 입력하세요"
    />
  )
}

const defaultColumn: Partial<ColumnDef<TeamMember>> = {
  cell: (props) => <EditableCell {...props} />,
}

export const columns: ColumnDef<TeamMember>[] = [
  { accessorKey: 'email', header: '이메일' },
  { accessorKey: 'positions', header: '역할' },
  { accessorKey: 'stacks', header: '기술 스택' },
]

export { defaultColumn }
