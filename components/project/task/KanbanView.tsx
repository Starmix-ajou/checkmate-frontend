'use client'

import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDroppable,
  DragOverEvent,
} from '@dnd-kit/core'
import {
  useSortable,
  rectSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import React from 'react'
import { Plus, Pencil, Pickaxe, Check } from 'lucide-react'

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
      className="w-1/3 min-h-[200px] m-0 flex flex-col gap-3"
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

  const dynamicStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={dynamicStyle}
      className={`
        bg-white text-black rounded-md shadow-md p-3 select-none cursor-pointer mb-2
        ${isDragging ? 'opacity-30' : 'opacity-100'}
      `}
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

  const renderColumn = (
    title: React.ReactNode,
    columnKey: ColumnType,
    bg: string
  ) => {
    const tasks = columns[columnKey]

    return (
      <DroppableColumn columnKey={columnKey}>
        <div className={`${bg} p-4 rounded-md flex flex-col justify-between`}>
          <div>
            <h2 className="font-medium text-sm mb-3.5">{title}</h2>
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
            className="flex items-center text-sm text-[#474747] mt-4 hover:text-black-01"
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
            <Plus size={20} className="mr-1.5 text-inherit" />
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
        <div className="flex gap-3">
          {renderColumn(
            <div className="flex items-center">
              <Pencil size={14} color="#858380" />
              <span className="ml-1">To Do</span>
            </div>,
            'todo',
            'bg-[#F8F8F7] rounded-none'
          )}
          {renderColumn(
            <div className="flex items-center">
              <Pickaxe size={14} color="#5093BC" />
              <span className="ml-1">In Progress</span>
            </div>,
            'inProgress',
            'bg-[#F3F9FC] rounded-none'
          )}
          {renderColumn(
            <div className="flex items-center">
              <Check size={14} color="#5C9771" />
              <span className="ml-1">Done</span>
            </div>,
            'done',
            'bg-[#F6FAF6] rounded-none'
          )}
        </div>

        <DragOverlay>
          {activeTask && (
            <div className="bg-white text-black shadow-md p-3 select-none cursor-pointer">
              {activeTask.content}
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
