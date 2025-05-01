import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'

type TaskProps = {
  id: string
  title: string
  level: 'Low' | 'Medium' | 'High'
  duration: string
  completed?: boolean
}

export default function KanbanTask({
  id,
  title,
  level,
  duration,
  completed = false,
}: TaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const [isChecked, setIsChecked] = useState(completed)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const levelStyleMap: Record<TaskProps['level'], string> = {
    Low: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    High: 'bg-red-100 text-red-800',
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={`bg-white text-black-01 rounded-md px-3 py-3.5 select-none cursor-pointer mb-2 border border-[#DCDCDC] ${
        isDragging ? 'opacity-30' : 'opacity-100'
      }`}
    >
      {/* Title + Checkbox */}
      <div className="flex items-start mb-2">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
          className="mr-2 mt-0.5 cursor-pointer"
        />
        <span
          className={`text-sm break-words ${
            isChecked ? 'line-through text-gray-400' : ''
          }`}
        >
          {title}
        </span>
      </div>

      {/* Level Badge */}
      <div
        className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${levelStyleMap[level]} mb-1`}
      >
        {level}
      </div>

      {/* Duration */}
      <div className="text-xs text-gray-400">{duration}</div>
    </div>
  )
}
