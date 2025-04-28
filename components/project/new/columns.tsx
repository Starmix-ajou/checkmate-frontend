'use client'

import { Badge } from '@/components/ui/badge'
import { Position, Stack, TeamMember } from '@/types/NewProjectTeamMember'
import { ColumnDef, RowData } from '@tanstack/react-table'
import { useEffect, useState } from 'react'
import CreatableSelect from 'react-select/creatable'

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: TData) => void
  }
}

const getEnumOptions = (e: object) =>
  Object.values(e).map((value) => ({ label: value, value }))

const ROLE_OPTIONS = getEnumOptions(Position)
const STACK_OPTIONS = getEnumOptions(Stack)

interface EditableCellProps<TData> {
  getValue: () => unknown
  row: { index: number }
  column: { id: string }
  table: {
    options: {
      meta?: {
        updateData: (rowIndex: number, columnId: string, value: TData) => void
      }
    }
  }
}

function EditableCell<TData>({
  getValue,
  row,
  column,
  table,
}: EditableCellProps<TData>) {
  const initialValue = getValue()

  const [value, setValue] = useState<unknown>(initialValue)

  const onBlur = () => {
    table.options.meta?.updateData(row.index, column.id, value as TData)
  }

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  if (column.id === 'positions') {
    return (
      <CreatableSelect
        menuPortalTarget={
          typeof document !== 'undefined' ? document.body : null
        }
        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
        options={ROLE_OPTIONS}
        value={
          value ? { label: value as string, value: value as string } : null
        }
        onChange={(option) => {
          setValue(option?.value || '')
          onBlur()
        }}
        placeholder="역할을 선택하거나 입력하세요"
        className="w-full"
        isClearable
        formatCreateLabel={(inputValue) => `"${inputValue}" 추가`}
      />
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
            setValue((prev: Stack[]) => [
              ...(prev || []),
              option.value as Stack,
            ])
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
                  setValue((prev: Stack[]) =>
                    prev.filter((item) => item !== stack)
                  )
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
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      className="w-full border rounded p-1"
      placeholder="이름을 입력하세요"
    />
  )
}

const defaultColumn: Partial<ColumnDef<TeamMember>> = {
  cell: (props) => <EditableCell {...props} />,
}

export const columns: ColumnDef<TeamMember>[] = [
  { accessorKey: 'name', header: '이름' },
  { accessorKey: 'positions', header: '역할' },
  { accessorKey: 'stacks', header: '기술 스택' },
]

export { defaultColumn }
