import { ColumnType, Task } from '@/types/userTask'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'

import KanbanTask from './KanbanTask'

type KanbanColumnProps = {
  title: React.ReactNode
  columnKey: ColumnType
  bg: string
  tasks: Task[]
  onTaskSelect: (taskId: string, isSelected: boolean) => void
}

export default function KanbanColumn({
  title,
  columnKey,
  bg,
  tasks,
  onTaskSelect,
}: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id: columnKey })

  return (
    <div
      ref={setNodeRef}
      className="w-1/3 min-h-[200px] m-0 flex flex-col gap-3"
    >
      <div
        className={`${bg} p-[15px] rounded-md flex flex-col justify-between`}
      >
        <div>
          <h2 className="font-medium text-sm mb-3.5">{title}</h2>
          <SortableContext
            items={tasks.map((task) => task.taskId)}
            strategy={rectSortingStrategy}
          >
            {tasks.map((task) => (
              <KanbanTask
                key={task.taskId}
                taskId={task.taskId}
                title={task.title}
                priority={task.priority}
                startDate={task.startDate}
                endDate={task.endDate}
                completed={task.completed}
                onSelect={(isSelected) => onTaskSelect(task.taskId, isSelected)}
              />
            ))}
          </SortableContext>
        </div>

        <button
          className="flex items-center text-sm text-[#474747] my-2 hover:text-black-01"
          onClick={() => {
            const event = new CustomEvent('kanban:add-task', {
              detail: { columnKey },
            })
            window.dispatchEvent(event)
          }}
        >
          <Plus size={20} className="font-medium mr-1.5 text-inherit" />
          Add
        </button>
      </div>
    </div>
  )
}
