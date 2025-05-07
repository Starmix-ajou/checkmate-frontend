import { Task } from '@/types/userTask'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { useState } from 'react'

type TaskProps = {
  taskId: string
  title: string
  priority: Task['priority']
  startDate: string
  endDate: string
  completed?: boolean
}

export default function KanbanTask({
  taskId,
  title,
  priority: initialPriority,
  startDate,
  endDate,
  completed = false,
}: TaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: taskId })

  const [isChecked, setIsChecked] = useState(completed)
  const [isHovered, setIsHovered] = useState(false)
  const [priority, setPriority] = useState<Task['priority']>(initialPriority)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const priorityStyleMap: Record<Task['priority'], string> = {
    LOW: 'bg-[#E1FBD6] text-[#204206]',
    MEDIUM: 'bg-[#FFF5E2] text-[#B46C00]',
    HIGH: 'bg-[#FFE5E3] text-[#D91F11]',
  }

  const formatPriority = (priority: Task['priority']) => {
    return priority.charAt(0) + priority.slice(1).toLowerCase()
  }

  const cyclePriority = () => {
    const priorities: Task['priority'][] = ['LOW', 'MEDIUM', 'HIGH']
    const nextIndex = (priorities.indexOf(priority) + 1) % priorities.length
    setPriority(priorities[nextIndex])
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`relative bg-white text-black-01 rounded-md px-3 py-3.5 select-none mb-2 border border-[#DCDCDC] ${
        isDragging ? 'opacity-30' : 'opacity-100'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Drag Handle Icon */}
      {isHovered && (
        <div
          {...listeners}
          className="absolute top-4 right-2 cursor-grab text-gray-01 hover:text-black-01"
        >
          <GripVertical size={18} />
        </div>
      )}

      {/* Title + Checkbox */}
      <div className="flex items-center mb-3">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
          className="cursor-pointer mr-1.5"
        />
        <span
          className={`text-black-01 text-base font-medium break-words ${
            isChecked ? 'line-through text-gray-01' : ''
          }`}
        >
          {title}
        </span>
      </div>

      {/* Priority Badge (clickable) */}
      <div
        className={`mb-3 inline-block text-xs font-normal px-2 py-1 rounded-sm cursor-pointer ${priorityStyleMap[priority]} mb-1`}
        onClick={cyclePriority}
      >
        {formatPriority(priority)}
      </div>

      {/* Duration */}
      <div className="text-xs text-gray-01 font-medium">
        {formatDate(startDate)} ~ {formatDate(endDate)}
      </div>
    </div>
  )
}
