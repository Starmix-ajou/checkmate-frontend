import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  ColumnDef,
  Row,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { GripVertical, Trash2 } from 'lucide-react'
import { useState } from 'react'

interface Task {
  id: number
  title: string
  position: string
  selected: boolean
}

interface Epic {
  id: number
  title: string
  period: string
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

const initialEpics: Epic[] = [
  {
    id: 1,
    title: '회원가입 및 로그인',
    period: '04. 01 ~ 04. 10',
  },
  {
    id: 2,
    title: '그룹 매칭 시스템',
    period: '04. 11 ~ 04. 20',
  },
  {
    id: 3,
    title: '새로운 시스템',
    period: '04. 21 ~ 04. 30',
  },
]

function SortableRow({
  row,
  children,
  isDragging = false,
}: {
  row: Row<Epic>
  children: React.ReactNode
  isDragging?: boolean
}) {
  const { setNodeRef, transform, transition, attributes, listeners } =
    useSortable({
      id: row.original.id,
      animateLayoutChanges: () => false,
    })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  }

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="h-12"
    >
      {children}
    </TableRow>
  )
}

export default function SprintWizard() {
  const [step, setStep] = useState(0)
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [epics, setEpics] = useState<Epic[]>(initialEpics)
  const sensors = useSensors(useSensor(PointerSensor))
  const [activeId, setActiveId] = useState<number | null>(null)

  const [activeItem, setActiveItem] = useState<Epic | null>(null)

  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id as number
    setActiveId(id)
    const item = epics.find((epic) => epic.id === id) || null
    setActiveItem(item)
  }

  const handleDeleteEpic = (index: number) => {
    setEpics((prev) => prev.filter((_, i) => i !== index))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    if (active.id !== over?.id) {
      const oldIndex = epics.findIndex((epic) => epic.id === active.id)
      const newIndex = epics.findIndex((epic) => epic.id === over?.id)
      setEpics((items) => arrayMove(items, oldIndex, newIndex))
    }
  }

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

  const epicColumns: ColumnDef<Epic>[] = [
    {
      id: 'drag',
      header: () => null,
      cell: () => (
        <div className="cursor-move">
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </div>
      ),
    },
    {
      accessorKey: 'id',
      header: '에픽 번호',
      cell: ({ row }) => (
        <Badge variant="secondary" className="text-xs px-2 py-1">
          Epic {row.index + 1}
        </Badge>
      ),
    },
    {
      accessorKey: 'title',
      header: '에픽명',
      cell: ({ row }) => (
        <div className="font-medium">{row.original.title}</div>
      ),
    },
    {
      accessorKey: 'period',
      header: '기간',
      cell: ({ row }) => <div>{row.original.period}</div>,
    },
    {
      id: 'delete',
      header: () => null,
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleDeleteEpic(row.index)}
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
      ),
    },
  ]

  const table = useReactTable({
    data: tasks,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const epicTable = useReactTable({
    data: epics,
    columns: epicColumns,
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
                  <TableRow key={row.original.id}>
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

      {step === 1 && (
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8">스프린트 구성 완료!</h2>
          <div className="text-lg text-gray-700 mb-4">
            구성된 Epic을 수정할 수 있어요.
          </div>
          <div className="border-y">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={epics.map((e) => e.id)}
                strategy={verticalListSortingStrategy}
              >
                <Table>
                  <TableBody>
                    {epicTable.getRowModel().rows.map((row) => {
                      return (
                        <SortableRow
                          key={row.original.id}
                          row={row}
                          isDragging={activeId === row.original.id}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id} className="text-left">
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </SortableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </SortableContext>
              <DragOverlay>
                <Table>
                  <TableBody>
                    {activeItem && (
                      <TableRow className="bg-white border border-gray-200 shadow-md h-12">
                        <TableCell className="text-left">
                          {activeItem.title}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </DragOverlay>
            </DndContext>
          </div>
          <Button variant="cm" onClick={() => setStep(2)} className="mt-8">
            다음
          </Button>
        </div>
      )}

      {step === 2 && <div></div>}

      {step === 3 && <div></div>}
    </div>
  )
}
