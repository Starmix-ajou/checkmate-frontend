import { Plus } from 'lucide-react'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import KanbanTask from './KanbanTask'

type Task = {
  id: string
  content: string
}

type ColumnType = 'todo' | 'inProgress' | 'done'

export default function KanbanColumn({
  title,
  columnKey,
  bg,
  tasks,
}: {
  title: React.ReactNode
  columnKey: ColumnType
  bg: string
  tasks: Task[]
}) {
  const { setNodeRef } = useDroppable({ id: columnKey })

  return (
    <div
      ref={setNodeRef}
      className="w-1/3 min-h-[200px] m-0 flex flex-col gap-3"
    >
      <div
        className={`${bg} px-2 py-3.5 rounded-md flex flex-col justify-between`}
      >
        <div>
          <h2 className="font-medium text-sm mb-3.5">{title}</h2>
          <SortableContext
            items={tasks.map((task) => task.id)}
            strategy={rectSortingStrategy}
          >
            {tasks.map((task) => (
              <KanbanTask key={task.id} id={task.id} content={task.content} />
            ))}
          </SortableContext>
        </div>

        <button
          className="flex items-center text-sm text-[#474747] my-2 hover:text-black-01"
          onClick={() => {
            const newTask: Task = {
              id: `task-${Date.now()}`,
              content: 'New Task',
            }
            const event = new CustomEvent('kanban:add-task', {
              detail: { columnKey, newTask },
            })
            window.dispatchEvent(event)
          }}
        >
          <Plus size={20} className="mr-1.5 text-inherit" />
          Add
        </button>
      </div>
    </div>
  )
}
