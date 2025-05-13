import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Position, Stack, TeamMember } from '@/types/NewProjectTeamMember'
import { CellContext, ColumnDef } from '@tanstack/react-table'
import CreatableSelect from 'react-select/creatable'

import { GenericEditableTable } from './GenericEditableTable'

declare module '@tanstack/react-table' {
  interface TableMeta<TData> {
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

function EditableCell({
  getValue,
  row,
  column,
  table,
}: CellContext<TeamMember, unknown>) {
  const value = getValue()
  const readOnly = (table.options.meta as any)?.readOnly

  if (column.id === 'positions') {
    const positions = (value as Position[]) || []
    return (
      <div className="flex flex-col gap-2">
        {!readOnly && (
          <CreatableSelect
            menuPortalTarget={
              typeof document !== 'undefined' ? document.body : null
            }
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            options={ROLE_OPTIONS.filter(
              (option) => !positions.includes(option.value as Position)
            )}
            onChange={(option) => {
              if (!option) return
              const newValue = [...positions, option.value as Position]
              table.options.meta?.updateData(row.index, column.id, newValue)
            }}
            placeholder="역할을 선택하거나 입력하세요"
            className="w-full"
            isClearable
            formatCreateLabel={(inputValue) => `"${inputValue}" 추가`}
          />
        )}
        <div className="flex flex-wrap gap-1">
          {positions.map((position, idx) => (
            <Badge key={idx} className="flex items-center gap-1">
              {position}
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => {
                    const newValue = positions.filter(
                      (item) => item !== position
                    )
                    table.options.meta?.updateData(
                      row.index,
                      column.id,
                      newValue
                    )
                  }}
                  className="ml-1 text-xs"
                >
                  ✕
                </button>
              )}
            </Badge>
          ))}
        </div>
      </div>
    )
  }

  if (column.id === 'stacks') {
    const stacks = (value as Stack[]) || []
    return (
      <div className="flex flex-col gap-2">
        {!readOnly && (
          <CreatableSelect
            menuPortalTarget={
              typeof document !== 'undefined' ? document.body : null
            }
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            options={STACK_OPTIONS.filter(
              (option) => !stacks.includes(option.value as Stack)
            )}
            onChange={(option) => {
              if (!option) return
              const newValue = [...stacks, option.value as Stack]
              table.options.meta?.updateData(row.index, column.id, newValue)
            }}
            placeholder="스택을 추가하거나 입력하세요"
            className="w-full"
            isClearable
            formatCreateLabel={(inputValue) => `"${inputValue}" 추가`}
          />
        )}
        <div className="flex flex-wrap gap-1">
          {stacks.map((stack, idx) => (
            <Badge key={idx} className="flex items-center gap-1">
              {stack}
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => {
                    const newValue = stacks.filter((item) => item !== stack)
                    table.options.meta?.updateData(
                      row.index,
                      column.id,
                      newValue
                    )
                  }}
                  className="ml-1 text-xs"
                >
                  ✕
                </button>
              )}
            </Badge>
          ))}
        </div>
      </div>
    )
  }

  return readOnly ? (
    <div className="w-full py-2">{value}</div>
  ) : (
    <Input
      value={typeof value === 'string' ? value : ''}
      onChange={(e) =>
        table.options.meta?.updateData(row.index, column.id, e.target.value)
      }
      className="w-full"
      placeholder="이메일을 입력하세요"
    />
  )
}

const columns: ColumnDef<TeamMember>[] = [
  {
    accessorKey: 'email',
    header: '이메일',
    cell: EditableCell,
  },
  {
    accessorKey: 'positions',
    header: '역할',
    cell: EditableCell,
  },
  {
    accessorKey: 'stacks',
    header: '기술 스택',
    cell: EditableCell,
  },
]

export function TeamMemberTable({
  data,
  onDataChange,
  readOnly = false,
}: {
  data: TeamMember[]
  onDataChange: (data: TeamMember[]) => void
  readOnly?: boolean
}) {
  return (
    <GenericEditableTable
      data={data}
      columns={columns}
      onDataChange={onDataChange}
      addButtonText="팀원 추가"
      emptyStateText="팀원이 없습니다."
      readOnly={readOnly}
      defaultRow={{ email: '', stacks: [], positions: [] }}
    />
  )
}
