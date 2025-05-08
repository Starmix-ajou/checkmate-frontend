import { Task } from '@/types/userTask'
import { X } from 'lucide-react'
import { useState } from 'react'

type TaskModalProps = {
  isOpen: boolean
  onClose: () => void
  task: {
    taskId: string
    title: string
    description?: string
    priority: Task['priority']
    startDate: string
    endDate: string
    status: Task['status']
  }
  onUpdate?: (
    taskId: string,
    data: Partial<{
      title?: string
      description?: string
      status?: 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'DONE'
      assigneeEmail?: string
      startDate?: string
      endDate?: string
      priority?: 'LOW' | 'MEDIUM' | 'HIGH'
      epicId?: string
    }>
  ) => void
}

export default function TaskModal({
  isOpen,
  onClose,
  task,
  onUpdate,
}: TaskModalProps) {
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || '')
  const [priority, setPriority] = useState<Task['priority']>(task.priority)
  const [status, setStatus] = useState<Task['status']>(task.status)

  if (!isOpen) return null

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    onUpdate?.(task.taskId, { title: e.target.value })
  }

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value)
    onUpdate?.(task.taskId, { description: e.target.value })
  }

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPriority = e.target.value as Task['priority']
    setPriority(newPriority)
    onUpdate?.(task.taskId, { priority: newPriority })
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as Task['status']
    setStatus(newStatus)
    onUpdate?.(task.taskId, { status: newStatus })
  }

  return (
    <div className="fixed top-0 right-0 h-full w-[400px] bg-white shadow-lg border-l border-gray-200 z-50">
      <div className="h-full flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-black-01">Task Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* 컨텐츠 */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            {/* 제목 */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Title</h3>
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 상태 */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
              <select
                value={status}
                onChange={handleStatusChange}
                className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="BACKLOG">Backlog</option>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>

            {/* 우선순위 */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Priority
              </h3>
              <select
                value={priority}
                onChange={handlePriorityChange}
                className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            {/* 기간 */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Duration
              </h3>
              <p className="text-base text-black-01">
                {task.startDate} ~ {task.endDate}
              </p>
            </div>

            {/* 설명 */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Description
              </h3>
              <textarea
                value={description}
                onChange={handleDescriptionChange}
                className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                placeholder="Add a description..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
