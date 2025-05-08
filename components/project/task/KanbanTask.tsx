import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Task } from '@/types/userTask'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { GripVertical } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { /*DateRange,*/ DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

import TaskModal from './TaskModal'

type TaskProps = {
  taskId: string
  title: string
  priority: Task['priority']
  startDate: string
  endDate: string
  completed?: boolean
  onSelect: (isSelected: boolean) => void
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

export default function KanbanTask({
  taskId,
  title: initialTitle,
  priority: initialPriority,
  startDate: initialStartDate,
  endDate: initialEndDate,
  completed = false,
  onSelect,
  onUpdate,
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
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(initialTitle)
  const [startDate, setStartDate] = useState<Date>(new Date(initialStartDate))
  const [endDate, setEndDate] = useState<Date>(new Date(initialEndDate))
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleUncheck = (e: Event) => {
      const { taskId: uncheckTaskId } = (e as CustomEvent).detail
      if (uncheckTaskId === taskId) {
        setIsChecked(false)
        onSelect(false)
      }
    }

    window.addEventListener('kanban:uncheck-task', handleUncheck)
    return () => {
      window.removeEventListener('kanban:uncheck-task', handleUncheck)
    }
  }, [taskId, onSelect])

  const handleDoubleClick = () => {
    setIsEditing(true)

    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    }, 0)
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleTitleBlur = () => {
    setIsEditing(false)
    if (title !== initialTitle) {
      onUpdate?.(taskId, { title })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditing(false)
      if (title !== initialTitle) {
        onUpdate?.(taskId, { title })
      }
    } else if (e.key === 'Escape') {
      setIsEditing(false)
      setTitle(initialTitle)
    }
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked
    setIsChecked(newChecked)
    onSelect(newChecked)
  }

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
    const newPriority = priorities[nextIndex]
    setPriority(newPriority)
    onUpdate?.(taskId, { priority: newPriority })
  }

  const handleDurationDoubleClick = () => {
    setIsCalendarOpen(true)
  }

  const formatDate = (date: Date) => {
    return format(date, 'yyyy.MM.dd', { locale: ko })
  }

  const handleBoxDoubleClick = () => {
    setIsModalOpen(true)
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={`relative bg-white text-black-01 rounded-md px-3 py-3.5 select-none mb-2 border border-[#DCDCDC] ${
          isDragging ? 'opacity-30' : 'opacity-100'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onDoubleClick={handleBoxDoubleClick}
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
            onChange={handleCheckboxChange}
            className="cursor-pointer mr-1.5 w-[16px] h-[16px]"
          />
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={title}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              onKeyDown={handleKeyDown}
              className="text-black-01 text-base font-medium bg-transparent border-b-2 border-gray-01 focus:outline-none focus:border-gray-01 w-[calc(100%-50px)]"
            />
          ) : (
            <span
              className="text-black-01 text-base font-medium break-words cursor-text"
              onDoubleClick={handleDoubleClick}
            >
              {title}
            </span>
          )}
        </div>

        {/* Priority Badge (clickable) */}
        <div
          className={`mb-3 inline-block text-xs font-normal px-2 py-1 rounded-sm cursor-pointer ${priorityStyleMap[priority]} mb-1`}
          onClick={cyclePriority}
        >
          {formatPriority(priority)}
        </div>

        {/* Duration */}
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <div
              className="text-xs text-gray-01 font-medium cursor-pointer hover:text-black-01"
              onDoubleClick={handleDurationDoubleClick}
            >
              {formatDate(startDate)} ~ {formatDate(endDate)}
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <DayPicker
              mode="range"
              selected={{ from: startDate, to: endDate }}
              onSelect={(range) => {
                if (range?.from) {
                  setStartDate(range.from)
                  if (range.to) {
                    setEndDate(range.to)
                    onUpdate?.(taskId, {
                      startDate: range.from.toISOString(),
                      endDate: range.to.toISOString(),
                    })
                  }
                }
              }}
              locale={ko}
              captionLayout="label"
              classNames={{
                caption: 'flex justify-between items-center px-4 py-2',
                nav: 'flex items-center justify-between w-full flex items-center px-4',
                nav_button: 'text-gray-500 hover:text-black transition-colors',
                caption_label:
                  'text-center font-semibold text-base w-full flex items-center justify-center text-black-01',
                table: 'w-full border-collapse mt-4',
                head_row:
                  'flex justify-between text-center text-gray-500 text-xs',
                head_cell: 'w-full',
                weekday:
                  'text-black-01 [&:first-child]:text-[#D91F11] [&:last-child]:text-[#D91F11]',
              }}
              modifiers={{
                weekend: (date: Date) =>
                  date.getDay() === 0 || date.getDay() === 6,
              }}
              modifiersStyles={{
                weekend: { color: '#D91F11' },
              }}
              formatters={{
                formatCaption: (date) => format(date, 'yyyy. MM'),
                formatWeekdayName: (weekday) => {
                  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
                  return weekdays[weekday.getDay()]
                },
              }}
              styles={{
                months: {
                  display: 'flex',
                  flexDirection: 'column',
                },
                caption: {
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                },
                nav: {
                  position: 'static',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                },
                nav_button: {
                  width: '28px',
                  height: '28px',
                },
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={{
          taskId,
          title,
          priority,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          status: 'TODO', // TODO: 실제 상태값 전달 필요
        }}
        onUpdate={onUpdate}
      />
    </>
  )
}
