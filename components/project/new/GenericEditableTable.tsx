import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'

interface GenericEditableTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  onDataChange: (data: T[]) => void
  addButtonText?: string
  emptyStateText?: string
  defaultRow?: T
}

export function GenericEditableTable<T>({
  data,
  columns,
  onDataChange,
  addButtonText = '항목 추가',
  emptyStateText = 'No results.',
  defaultRow,
}: GenericEditableTableProps<T>) {
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
                <TableRow>
                  <TableCell
                    onClick={handleAddRow}
                    colSpan={columns.length + 1}
                    className="text-center py-4 cursor-pointer hover:bg-gray-100 font-medium text-blue-500"
                  >
                    {addButtonText}
                  </TableCell>
                </TableRow>
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
