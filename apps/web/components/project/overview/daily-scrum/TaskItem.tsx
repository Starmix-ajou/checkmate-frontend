import { Task } from '@/types/project'
import { Card } from '@cm/ui/components/ui/card'
import { Pencil, Trash2 } from 'lucide-react'
import Select from 'react-select'

interface TaskItemProps {
  task: Task
  isEditMode: boolean
  isCurrentUserSelected: boolean
  hasUserDailyScrum: boolean
  onEdit: () => void
  onRemove: () => void
  onTaskChange?: (taskId: string, newTask: Task) => void
  availableTasks?: Task[]
}

export function TaskItem({
  task,
  isEditMode,
  isCurrentUserSelected,
  hasUserDailyScrum,
  onEdit,
  onRemove,
  onTaskChange,
  availableTasks,
}: TaskItemProps) {
  if (isEditMode) {
    return (
      <div className="text-sm relative group">
        <div className="flex justify-between items-center">
          <Select
            options={availableTasks}
            getOptionLabel={(option: Task) => option.title}
            getOptionValue={(option: Task) => option.taskId}
            value={task}
            onChange={(newValue) =>
              newValue && onTaskChange?.(task.taskId, newValue)
            }
            placeholder="태스크 선택"
            className="text-sm w-full"
            menuPortalTarget={document.body}
            isSearchable
            noOptionsMessage={() => '선택 가능한 태스크가 없습니다'}
          />
          {isCurrentUserSelected && (
            <button
              onClick={onRemove}
              className="text-cm-gray hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity ml-2"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <Card className="text-sm px-2 py-2 shadow-none rounded-md relative group">
      <div className="flex justify-between items-center">
        <span>{task.title}</span>
        {isCurrentUserSelected && !hasUserDailyScrum && (
          <button
            onClick={onEdit}
            className="text-cm-gray hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Pencil className="w-4 h-4" />
          </button>
        )}
      </div>
    </Card>
  )
}
