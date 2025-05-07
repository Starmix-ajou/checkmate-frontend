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

import { DetailTaskTable } from './DetailTaskTable'
import { SprintReviewTable } from './SprintReviewTable'

interface IncompletedTask {
  id: number
  title: string
  position: string
  selected: boolean
}

interface Epic {
  id: number
  title: string
  period: string
  task: TaskRow[]
}

const initialEpics: Epic[] = [
  {
    id: 1,
    title: '회원가입 및 로그인',
    period: '04. 01 ~ 04. 10',
    task: [
      {
        title: '이메일 회원가입 기능 구현',
        position: 'Frontend',
        assignee: '한도연',
        period: '04. 01 ~ 04. 02',
      },
      {
        title: '소셜 로그인 백엔드 연동',
        position: 'Backend',
        assignee: '조성연',
        period: '04. 01 ~ 04. 02',
      },
    ],
  },
  {
    id: 2,
    title: '그룹 매칭 시스템',
    period: '04. 11 ~ 04. 20',
    task: [
      {
        title: '매칭 알고리즘 설계',
        position: 'AI',
        assignee: '박승연',
        period: '04. 01 ~ 04. 02',
      },
      {
        title: '매칭 결과 UI 구현',
        position: 'Frontend',
        assignee: '김평주',
        period: '04. 01 ~ 04. 02',
      },
    ],
  },
  {
    id: 3,
    title: '새로운 시스템',
    period: '04. 21 ~ 04. 30',
    task: [
      {
        title: '시스템 구조도 작성',
        position: 'Backend',
        assignee: '조성연',
        period: '04. 01 ~ 04. 02',
      },
      {
        title: '디자인 시안 제작',
        position: 'AI',
        assignee: '박승연',
        period: '04. 01 ~ 04. 02',
      },
    ],
  },
]

interface TaskRow {
  title: string
  position: string
  assignee: string
  period: string
}

const initialIncompletedTasks: IncompletedTask[] = [
  {
    id: 1,
    title: '로그인 페이지 구현',
    position: '프론트엔드',
    selected: false,
  },
  { id: 2, title: 'API 연동', position: '백엔드', selected: false },
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
  const [incompletedTasks, setIncompletedTasks] = useState<IncompletedTask[]>(
    initialIncompletedTasks
  )
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

  const incompletedTaskColumns: ColumnDef<IncompletedTask>[] = [
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

  const incompletedTasksTable = useReactTable({
    data: incompletedTasks,
    columns: incompletedTaskColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  const epicTable = useReactTable({
    data: epics,
    columns: epicColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  const handleSelect = (index: number) => {
    setIncompletedTasks((prevIncompletedTasks) => {
      const updated = [...prevIncompletedTasks]
      updated[index] = {
        ...updated[index],
        selected: !updated[index].selected,
      }
      return updated
    })
  }

  const handleTaskDataChange = (epicId: number, newTasks: TaskRow[]) => {
    setEpics((prev) =>
      prev.map((epic) =>
        epic.id === epicId ? { ...epic, task: newTasks } : epic
      )
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl w-4xl mx-auto">
      <div className="w-full flex space-x-2 justify-center mb-16">
        {[0, 1, 2, 3].map((s) => (
          <div
            key={s}
            className={`w-2 h-2 rounded-full ${s <= step ? 'bg-cm' : 'bg-cm-100/50'}`}
          />
        ))}
      </div>

      {step === 0 && (
        <div className="text-center w-full">
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
                {incompletedTasksTable.getRowModel().rows.map((row) => (
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

      {step === 2 && (
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8">
            세부 태스크를 입력해 주세요.
          </h2>
          <div className="space-y-8">
            {epics.map((epic) => (
              <div key={epic.id} className="space-y-4 p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">{epic.title}</h3>
                  <span className="text-sm text-muted-foreground">
                    {epic.period}
                  </span>
                </div>

                <DetailTaskTable
                  data={epic.task}
                  onDataChange={(updatedTasks) =>
                    handleTaskDataChange(epic.id, updatedTasks)
                  }
                />
              </div>
            ))}

            <div className="text-center">
              <Button variant="cm" onClick={() => setStep(3)} className="mt-8">
                다음
              </Button>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8">
            스프린트 구성이 완료되었어요.
            <br />
            최종 검토해 주세요.
          </h2>
          <div className="space-y-8">
            {epics.map((epic) => (
              <div key={epic.id} className="space-y-4 p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-sm">
                      Epic {epic.id}
                    </Badge>
                    <h3 className="text-xl font-bold">{epic.title}</h3>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {epic.period}
                  </span>
                </div>

                <SprintReviewTable data={epic.task} />
              </div>
            ))}

            <div className="text-center">
              <Button variant="outline" className="mt-8">
                수정
              </Button>
              <Button variant="cm" className="mt-8">
                완료
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
