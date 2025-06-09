import { ColumnType, Task } from '@cm/types/userTask'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@cm/ui/components/ui/tooltip'
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
  onTaskUpdate?: (
    taskId: string,
    data: { priority?: Task['priority']; startDate?: string; endDate?: string }
  ) => void
  onTaskClick: (task: Task) => void
}

export default function KanbanColumn({
  title,
  columnKey,
  bg,
  tasks,
  onTaskSelect,
  onTaskUpdate,
  onTaskClick,
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
                onSelect={(isSelected) => onTaskSelect(task.taskId, isSelected)}
                onUpdate={onTaskUpdate}
                onTaskClick={() => onTaskClick(task)}
              />
            ))}
          </SortableContext>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
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
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              align="start"
              sideOffset={3}
              className="relative [&>svg]:!hidden top-0"
            >
              {/* <div className="absolute left-3 -top-1 w-2 h-2 bg-primary rotate-45" /> */}
              <div className="relative z-10">
                Task를 추가하면 자동으로 본인에게 할당됩니다.
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
