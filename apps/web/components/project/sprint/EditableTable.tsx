import { Button } from '@cm/ui/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@cm/ui/components/ui/table'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'

interface EditableTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  onDataChange: (data: T[]) => void
  canAddRow?: boolean
  addButtonText?: string
  emptyStateText?: string
  defaultRow?: T
  meta?: Record<string, unknown>
}

export function EditableTable<T>({
  data,
  columns,
  onDataChange,
  canAddRow = true,
  addButtonText = '항목 추가',
  emptyStateText = 'No results.',
  defaultRow,
  meta,
}: EditableTableProps<T>) {
  const table = useReactTable<T>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: (rowIndex: number, columnId: string, value: unknown) => {
        onDataChange(
          data.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...row,
                [columnId]: value,
              } as T
            }
            return row
          })
        )
      },
      ...meta,
    },
  })

  const handleAddRow = () => {
    if (defaultRow) {
      onDataChange([...data, defaultRow])
    }
  }

  const handleDeleteRow = (index: number) => {
    onDataChange(data.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4 flex-1">
      <div className="">
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
                    {row.getVisibleCells().map((cell) => {
                      const widthClass =
                        {
                          title: 'w-6/12',
                          priority: 'w-2/12',
                          assignee: 'w-2/12',
                          startDate: 'w-1/12',
                          endDate: 'w-1/12',
                          delete: 'w-1/12',
                        }[cell.column.id] ?? 'w-auto'

                      return (
                        <TableCell
                          key={cell.id}
                          className={`text-left ${widthClass}`}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      )
                    })}
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteRow(row.index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {canAddRow && (
                  <TableRow>
                    <TableCell
                      onClick={handleAddRow}
                      colSpan={columns.length + 1}
                      className="text-left py-4 cursor-pointer hover:bg-gray-100 font-medium"
                    >
                      {addButtonText}
                    </TableCell>
                  </TableRow>
                )}
              </>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-24 text-center"
                >
                  {emptyStateText}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
