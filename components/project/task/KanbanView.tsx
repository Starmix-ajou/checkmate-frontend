'use client'

import { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, useSortable } from '@dnd-kit/sortable'
import { arrayMove } from '@dnd-kit/sortable'

export default function KanbanView() {
  const [tasks, setTasks] = useState([
    { id: 'task-1', content: 'Task 1' },
    { id: 'task-2', content: 'Task 2' },
    { id: 'task-3', content: 'Task 3' },
  ])

  // Drag end event handler
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    // Find the index of the active and over items
    const activeIndex = tasks.findIndex((task) => task.id === active.id)
    const overIndex = tasks.findIndex((task) => task.id === over.id)

    // If the active and over items are in the same position, don't do anything
    if (activeIndex === overIndex) return

    // Move the task to the new index
    const newTasks = arrayMove(tasks, activeIndex, overIndex)
    setTasks(newTasks)
  }

  // Setting up the drag sensors for mouse and touch
  const sensors = useSensors(useSensor(MouseSensor))

  // Sortable item
  const SortableItem = ({ id, content }: { id: string; content: string }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({
        id,
      })

    const style = {
      transform: `translate3d(${transform?.x}px, ${transform?.y}px, 0)`,
      transition,
      ...{
        padding: '8px',
        marginBottom: '8px',
        backgroundColor: 'white',
        borderRadius: '4px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      },
    }

    return (
      <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
        {content}
      </div>
    )
  }

  return (
    <div className="text-gray-500">
      {/* 실제 칸반 보드 구현 */}
      <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
        <div className="flex space-x-4">
          {/* 칸반의 각 칼럼 */}
          <div className="w-1/3 bg-gray-100 p-4 rounded-md">
            <h2 className="font-bold mb-4">To Do</h2>
            <SortableContext items={tasks.map((task) => task.id)}>
              {tasks.map((task) => (
                <SortableItem
                  key={task.id}
                  id={task.id}
                  content={task.content}
                />
              ))}
            </SortableContext>
          </div>
          {/* 다른 칼럼들 (예: In Progress, Done) */}
          <div className="w-1/3 bg-gray-100 p-4 rounded-md">
            <h2 className="font-bold mb-4">In Progress</h2>
            <SortableContext items={tasks.map((task) => task.id)}>
              {tasks.map((task) => (
                <SortableItem
                  key={task.id}
                  id={task.id}
                  content={task.content}
                />
              ))}
            </SortableContext>
          </div>
          <div className="w-1/3 bg-gray-100 p-4 rounded-md">
            <h2 className="font-bold mb-4">Done</h2>
            <SortableContext items={tasks.map((task) => task.id)}>
              {tasks.map((task) => (
                <SortableItem
                  key={task.id}
                  id={task.id}
                  content={task.content}
                />
              ))}
            </SortableContext>
          </div>
        </div>
      </DndContext>
    </div>
  )
}
