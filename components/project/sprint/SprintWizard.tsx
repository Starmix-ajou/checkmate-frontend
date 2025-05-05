import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useState } from 'react'

interface Task {
  id: number
  title: string
  position: string
  selected: boolean
}

const initialTasks: Task[] = [
  {
    id: 1,
    title: '로그인 페이지 구현',
    position: '프론트엔드',
    selected: false,
  },
  { id: 2, title: 'API 연동', position: '백엔드', selected: false },
]

export default function SprintWizard() {
  const [step, setStep] = useState(0)
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  const columns: ColumnDef<Task>[] = [
    {
      id: 'select',
      header: () => <input type="checkbox" disabled />,
      cell: ({ row }) => (
        <Checkbox
          checked={row.original.selected}
          onCheckedChange={() => handleSelect(row.index)}
        />
      ),
    },
    {
      accessorKey: 'title',
      header: 'Task 제목',
      cell: ({ row }) => (
        <div className="font-medium">{row.original.title}</div>
      ),
    },
    {
      accessorKey: 'position',
      header: '포지션',
      cell: ({ row }) => (
        <Badge variant="secondary" className="capitalize">
          {row.original.position}
        </Badge>
      ),
    },
  ]

  const table = useReactTable({
    data: tasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const handleSelect = (index: number) => {
    setTasks((prevTasks) => {
      const updated = [...prevTasks]
      updated[index] = {
        ...updated[index],
        selected: !updated[index].selected,
      }
      return updated
    })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex space-x-2 justify-center mb-16">
        {[0, 1, 2, 3].map((s) => (
          <div
            key={s}
            className={`w-2 h-2 rounded-full ${s <= step ? 'bg-cm' : 'bg-cm-100/50'}`}
          />
        ))}
      </div>

      {step === 0 && (
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8">
            지난 스프린트에서 <br />
            완료하지 않은 항목은 다음과 같아요.
          </h2>
          <div className="text-lg text-gray-700 mb-4">
            이번 스프린트에서 고려할 항목을 선택해 주세요.
          </div>
          <div className="border-y">
            <Table>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-left">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Button variant="cm" onClick={() => setStep(1)} className="mt-8">
            다음
          </Button>
        </div>
      )}

      {step === 1 && <div></div>}

      {step === 2 && <div></div>}

      {step === 3 && <div></div>}
    </div>
  )
}
