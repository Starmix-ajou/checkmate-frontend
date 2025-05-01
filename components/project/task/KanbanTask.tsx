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
    Low: 'bg-[#E1FBD6] text-[#204206]',
    Medium: 'bg-[#FFF5E2] text-[#B46C00]',
    High: 'bg-[#FFE5E3] text-[#D91F11]',
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

      {/* Level Badge */}
      <div
        className={`mb-3 inline-block text-xs font-normal px-2 py-1 rounded-sm ${levelStyleMap[level]} mb-1`}
      >
        {level}
      </div>

      {/* Duration */}
      <div className="text-xs text-gray-01 font-medium">{duration}</div>
    </div>
  )
}
