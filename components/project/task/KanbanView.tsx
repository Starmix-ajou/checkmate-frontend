'use client'

import { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  MouseSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDroppable,
} from '@dnd-kit/core'
import {
  useSortable,
  rectSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type Task = {
  id: string
  content: string
}

type ColumnType = 'todo' | 'inProgress' | 'done'

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

const SortableItem = ({ id, content }: { id: string; content: string }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1, // 드래그 중 원본은 흐리게
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

export default function KanbanView() {
  const [columns, setColumns] = useState<Record<ColumnType, Task[]>>({
    todo: [
      { id: 'task-1', content: 'Task 1' },
      { id: 'task-2', content: 'Task 2' },
    ],
    inProgress: [{ id: 'task-3', content: 'Task 3' }],
    done: [],
  })

  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(useSensor(MouseSensor))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)
    if (!over) return

    const activeId = active.id
    const overId = over.id

    let fromColumn: ColumnType | null = null
    let toColumn: ColumnType | null = null

    for (const key of Object.keys(columns) as ColumnType[]) {
      if (columns[key].some((task) => task.id === activeId)) {
        fromColumn = key
      }
    }

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

  const renderColumn = (title: string, columnKey: ColumnType, bg: string) => {
    const tasks = columns[columnKey]

    return (
      <DroppableColumn columnKey={columnKey}>
        <div className={`${bg} p-4 rounded-md`}>
          <h2 className="font-bold text-lg mb-4">{title}</h2>
          <SortableContext
            items={tasks.map((task) => task.id)}
            strategy={rectSortingStrategy}
          >
            {tasks.map((task) => (
              <SortableItem key={task.id} id={task.id} content={task.content} />
            ))}
          </SortableContext>
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
        onDragStart={(event) => {
          const activeId = event.active.id
          for (const column of Object.values(columns)) {
            const found = column.find((task) => task.id === activeId)
            if (found) {
              setActiveTask(found)
              break
            }
          }
        }}
      >
        <div className="flex gap-4">
          {renderColumn('To Do', 'todo', 'bg-gray-100')}
          {renderColumn('In Progress', 'inProgress', 'bg-sky-100')}
          {renderColumn('Done', 'done', 'bg-lime-100')}
        </div>

        {/* 마우스를 따라다니는 드래그 오버레이 */}
        <DragOverlay>
          {activeTask ? (
            <div className="bg-white text-black rounded-md shadow-md p-3 select-none cursor-pointer">
              {activeTask.content}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
