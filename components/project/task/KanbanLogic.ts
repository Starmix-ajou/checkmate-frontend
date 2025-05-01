import {
  DragOverEvent,
  MouseSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { useEffect, useState } from 'react'

type Task = {
  id: string
  title: string
  level: 'Low' | 'Medium' | 'High'
  duration: string
  completed?: boolean
}

type ColumnType = 'todo' | 'inProgress' | 'done'

export function KanbanLogic() {
  const [columns, setColumns] = useState<Record<ColumnType, Task[]>>({
    todo: [
      {
        id: 'task-1',
        title: 'Task 1',
        level: 'Low',
        duration: '2025. 04. 01 ~ 2025. 04. 03',
      },
      {
        id: 'task-2',
        title: 'Task 2',
        level: 'Medium',
        duration: '2025. 04. 04 ~ 2025. 04. 06',
      },
    ],
    inProgress: [
      {
        id: 'task-3',
        title: 'Task 3',
        level: 'High',
        duration: '2025. 04. 02 ~ 2025. 04. 05',
      },
    ],
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

  useEffect(() => {
    const handleAddTask = (e: Event) => {
      const { columnKey, newTask } = (e as CustomEvent).detail as {
        columnKey: ColumnType
        newTask: Task
      }
      setColumns((prev) => ({
        ...prev,
        [columnKey]: [...prev[columnKey], newTask],
      }))
    }

    window.addEventListener('kanban:add-task', handleAddTask)
    return () => {
      window.removeEventListener('kanban:add-task', handleAddTask)
    }
  }, [])

  return {
    columns,
    activeTask,
    setActiveTask,
    sensors,
    handleDragOver,
    handleDragEnd,
  }
}
