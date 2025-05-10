import { Category, Task } from '@/types/project'
import { Trash2 } from 'lucide-react'
import Select from 'react-select'

import { TaskItem } from './TaskItem'

interface TaskListProps {
  category: Category
  tasks: Task[]
  isEditMode: boolean
  isCurrentUserSelected: boolean
  hasUserDailyScrum: boolean
  isAdding: boolean
  onAdd: (category: Category, task: Task) => void
  onRemove: (taskId: string, category: Category) => void
  onTaskChange: (taskId: string, newTask: Task) => void
  onEdit: () => void
  onAddClick: () => void
  onCancelAdd: () => void
  availableTasks: Task[]
}

export function TaskList({
  category,
  tasks,
  isEditMode,
  isCurrentUserSelected,
  hasUserDailyScrum,
  isAdding,
  onAdd,
  onRemove,
  onTaskChange,
  onEdit,
  onAddClick,
  onCancelAdd,
  availableTasks,
}: TaskListProps) {
  return (
    <div className="px-2">
      <div
        className={`text-center text-sm font-semibold py-1 rounded ${
          category === 'DONE'
            ? 'text-cm-green bg-cm-green-light'
            : 'text-cm-gray bg-cm-gray-light'
        }`}
      >
        {category === 'DONE' ? '어제 한 일' : '오늘 할 일'}
      </div>
      <div className="mt-2 flex flex-col gap-2">
        {tasks.map((task) => (
          <TaskItem
            key={task.taskId}
            task={task}
            isEditMode={isEditMode}
            isCurrentUserSelected={isCurrentUserSelected}
            hasUserDailyScrum={hasUserDailyScrum}
            onEdit={onEdit}
            onRemove={() => onRemove(task.taskId, category)}
            onTaskChange={onTaskChange}
            availableTasks={availableTasks}
          />
        ))}
        {isAdding && isCurrentUserSelected ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Select
                  options={availableTasks}
                  getOptionLabel={(option: Task) => option.title}
                  getOptionValue={(option: Task) => option.taskId}
                  value={null}
                  onChange={(newValue) => {
                    if (newValue) {
                      onAdd(category, newValue)
                    }
                  }}
                  placeholder="태스크 선택"
                  className="text-sm"
                  isSearchable
                  noOptionsMessage={() => '선택 가능한 태스크가 없습니다'}
                />
              </div>
              <button
                onClick={onCancelAdd}
                className="text-gray-500 hover:text-gray-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : isCurrentUserSelected && !hasUserDailyScrum ? (
          <button
            onClick={onAddClick}
            className="text-sm text-gray-500 hover:underline text-left"
          >
            + Add
          </button>
        ) : null}
      </div>
    </div>
  )
}
