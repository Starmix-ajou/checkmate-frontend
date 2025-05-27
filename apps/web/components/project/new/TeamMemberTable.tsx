import { Position, TeamMember } from '@cm/types/NewProjectTeamMember'
import '@cm/types/table'
import { Badge } from '@cm/ui/components/ui/badge'
import { Input } from '@cm/ui/components/ui/input'
import { CellContext, ColumnDef } from '@tanstack/react-table'
import CreatableSelect from 'react-select/creatable'

import { GenericEditableTable } from './GenericEditableTable'

const getEnumOptions = (e: object) =>
  Object.values(e).map((value) => ({ label: value, value }))

const ROLE_OPTIONS = getEnumOptions(Position)

function EditableCell({
  getValue,
  row,
  column,
  table,
}: CellContext<TeamMember, unknown>) {
  const value = getValue()
  const readOnly = table.options.meta?.readOnly
  const isLeader = row.index === 0 && column.id === 'email'

  if (column.id === 'positions') {
    const positions = (value as Position[]) || []
    return (
      <div className="flex flex-col gap-2">
        {!readOnly && (
          <CreatableSelect
            menuPlacement="auto"
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

  return readOnly || isLeader ? (
    <div className="w-full py-2">{value as string}</div>
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
      defaultRow={{ email: '', positions: [] }}
      canDeleteRow={(rowIndex) => rowIndex !== 0}
    />
  )
}
