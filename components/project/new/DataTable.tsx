import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TeamMember } from '@/types/NewProjectTeamMember'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { defaultColumn } from './columns'

interface DataTableProps<TData extends TeamMember, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onDataChange: (data: TData[]) => void
}

export function DataTable<TData extends TeamMember, TValue>({
  columns,
  data,
  onDataChange,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable<TeamMember>({
    data,
    columns: columns as ColumnDef<TeamMember>[],
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: (rowIndex: number, columnId: string, value: unknown) => {
        onDataChange(
          data.map((row, index) => {
            if (index === rowIndex) {
              if (columnId === 'stacks' || columnId === 'positions') {
                return {
                  ...row,
                  profile: {
                    ...row.profile,
                    [columnId]: value,
                  },
                }
              }
              if (columnId === 'email') {
                return {
                  ...row,
                  email: value as string,
                }
              }
            }
            return row
          })
        )
      },
    },
  })

  const handleAddRow = () => {
    const emptyRow: TeamMember = {
      email: '',
      profile: {
        stacks: [],
        positions: [],
        projectId: '',
      },
    }
    onDataChange([...data, emptyRow as TData])
  }

  const handleDeleteRow = (index: number) => {
    onDataChange(data.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4 flex-1">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
                <TableHead></TableHead>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              <>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                    <TableCell className="text-center">
                      <button
                        onClick={() => handleDeleteRow(row.index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        x
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell
                    onClick={handleAddRow}
                    colSpan={columns.length + 1}
                    className="text-center py-4 cursor-pointer hover:bg-gray-100 font-medium text-blue-500"
                  >
                    팀원 추가
                  </TableCell>
                </TableRow>
              </>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
