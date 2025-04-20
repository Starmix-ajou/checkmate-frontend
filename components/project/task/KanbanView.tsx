'use client'

import { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDroppable,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// 타입 정의
type Task = {
  id: string
  content: string
}

type ColumnType = 'todo' | 'inProgress' | 'done'

// DroppableColumn 컴포넌트
const DroppableColumn = ({
  columnKey,
  children,
}: {
  columnKey: ColumnType
  children: React.ReactNode
}) => {
  const { setNodeRef } = useDroppable({
    id: columnKey,
  })

  return (
    <div
      ref={setNodeRef}
      className="w-1/3 p-4 rounded-md min-h-[200px] m-0 flex flex-col gap-2"
    >
      {children}
    </div>
  )
}

// SortableItem 컴포넌트
const SortableItem = ({ id, content }: { id: string; content: string }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="bg-white text-black rounded-md shadow-md p-3 select-none cursor-pointer mb-2"
    >
      {content}
    </div>
  )
}

// KanbanView 컴포넌트
export default function KanbanView() {
  const [columns, setColumns] = useState<Record<ColumnType, Task[]>>({
    todo: [
      { id: 'task-1', content: 'Task 1' },
      { id: 'task-2', content: 'Task 2' },
    ],
    inProgress: [{ id: 'task-3', content: 'Task 3' }],
    done: [],
  })

  const sensors = useSensors(useSensor(MouseSensor))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    let fromColumn: ColumnType | null = null
    let toColumn: ColumnType | null = null

    // fromColumn 찾기
    for (const key of Object.keys(columns) as ColumnType[]) {
      if (columns[key].some((task) => task.id === activeId)) {
        fromColumn = key
      }
    }

    // toColumn 찾기
    if (['todo', 'inProgress', 'done'].includes(String(overId))) {
      toColumn = overId as ColumnType
    } else {
      for (const key of Object.keys(columns) as ColumnType[]) {
        if (columns[key].some((task) => task.id === overId)) {
          toColumn = key
        }
      }
    }

    if (!fromColumn || !toColumn) return
    if (fromColumn === toColumn && activeId === overId) return

    const fromTasks = [...columns[fromColumn]]
    const toTasks = [...columns[toColumn]]

    const fromIndex = fromTasks.findIndex((task) => task.id === activeId)
    const [movedTask] = fromTasks.splice(fromIndex, 1)

    const toIndex =
      toColumn === fromColumn
        ? toTasks.findIndex((task) => task.id === overId)
        : 0

    toTasks.splice(toIndex, 0, movedTask)

    setColumns({
      ...columns,
      [fromColumn]: fromTasks,
      [toColumn]: toTasks,
    })
  }

  // 컬럼 렌더링 함수
  const renderColumn = (title: string, columnKey: ColumnType, bg: string) => {
    const tasks = columns[columnKey]

    return (
      <DroppableColumn columnKey={columnKey}>
        <div className={`${bg} p-4 rounded-md`}>
          <h2 className="font-bold text-lg mb-4">{title}</h2>
          {tasks.map((task) => (
            <SortableItem key={task.id} id={task.id} content={task.content} />
          ))}
        </div>
      </DroppableColumn>
    )
  }

  return (
    <div className="text-[#121212]">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={Object.values(columns)
            .flat()
            .map((task) => task.id)}
          strategy={rectSortingStrategy}
        >
          <div className="flex gap-4">
            {renderColumn('To Do', 'todo', 'bg-gray-100')}
            {renderColumn('In Progress', 'inProgress', 'bg-sky-100')}
            {renderColumn('Done', 'done', 'bg-lime-100')}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
