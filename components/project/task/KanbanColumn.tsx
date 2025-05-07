import { ColumnType, Task } from '@/types/userTask'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'

import KanbanTask from './KanbanTask'

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
              />
            ))}
          </SortableContext>
        </div>

        <button
          className="flex items-center text-sm text-[#474747] my-2 hover:text-black-01"
          onClick={() => {
            const newTask: Task = {
              taskId: `task-${Date.now()}`,
              title: 'New Task',
              description: '',
              status: 'TODO',
              assignee: {
                userId: '',
                name: '',
                email: '',
                profileImageUrl: '',
                profiles: [],
                role: '',
              },
              startDate: new Date().toISOString().split('T')[0],
              endDate: new Date().toISOString().split('T')[0],
              priority: 'MEDIUM',
              epic: {
                epicId: '',
                title: '',
                description: '',
                projectId: '',
              },
              completed: false,
            }
            const event = new CustomEvent('kanban:add-task', {
              detail: { columnKey, newTask },
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
