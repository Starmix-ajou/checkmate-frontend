'use client'

import {
  DndContext,
  DragOverEvent,
  DragOverlay,
  MouseSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Plus } from 'lucide-react'
import { useState } from 'react'

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
  const { setNodeRef } = useDroppable({ id: columnKey })

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
    opacity: isDragging ? 0.3 : 1,
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

  const findColumn = (taskId: string): ColumnType | null => {
    return (
      (Object.keys(columns) as ColumnType[]).find((key) =>
        columns[key].some((task) => task.id === taskId)
      ) || null
    )
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const activeId = active.id.toString()
    const overId = over.id.toString()

    const fromColumn = findColumn(activeId)
    const toColumn =
      findColumn(overId) ||
      (['todo', 'inProgress', 'done'].includes(overId)
        ? (overId as ColumnType)
        : null)

    if (!fromColumn || !toColumn) return

    const fromTasks = [...columns[fromColumn]]
    const toTasks = [...columns[toColumn]]

    const fromIndex = fromTasks.findIndex((task) => task.id === activeId)
    const toIndex = toTasks.findIndex((task) => task.id === overId)

    if (fromColumn === toColumn) {
      const updated = [...toTasks]
      const [moved] = updated.splice(fromIndex, 1)
      updated.splice(toIndex, 0, moved)

      setColumns((prev) => ({
        ...prev,
        [fromColumn]: updated,
      }))
    } else {
      const [moved] = fromTasks.splice(fromIndex, 1)
      toTasks.splice(toIndex === -1 ? toTasks.length : toIndex, 0, moved)

      setColumns((prev) => ({
        ...prev,
        [fromColumn]: fromTasks,
        [toColumn]: toTasks,
      }))
    }
  }

  const handleDragEnd = () => {
    setActiveTask(null)
  }

  const renderColumn = (title: string, columnKey: ColumnType, bg: string) => {
    const tasks = columns[columnKey]

    return (
      <DroppableColumn columnKey={columnKey}>
        <div className={`${bg} p-4 rounded-md flex flex-col justify-between`}>
          <div>
            <h2 className="font-bold text-lg mb-4">{title}</h2>
            <SortableContext
              items={tasks.map((task) => task.id)}
              strategy={rectSortingStrategy}
            >
              {tasks.map((task) => (
                <SortableItem
                  key={task.id}
                  id={task.id}
                  content={task.content}
                />
              ))}
            </SortableContext>
          </div>

          <button
            className="flex items-center text-sm text-gray-600 mt-4 hover:text-black"
            onClick={() => {
              const newTask: Task = {
                id: `task-${Date.now()}`, // 고유 ID 생성
                content: 'New Task',
              }
              setColumns((prev) => ({
                ...prev,
                [columnKey]: [...prev[columnKey], newTask],
              }))
            }}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </button>
        </div>
      </DroppableColumn>
    )
  }

  return (
    <div className="text-[#121212]">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragStart={({ active }) => {
          const activeId = active.id.toString()
          for (const column of Object.values(columns)) {
            const task = column.find((t) => t.id === activeId)
            if (task) {
              setActiveTask(task)
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

        <DragOverlay>
          {activeTask && (
            <div className="bg-white text-black rounded-md shadow-md p-3 select-none cursor-pointer">
              {activeTask.content}
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
