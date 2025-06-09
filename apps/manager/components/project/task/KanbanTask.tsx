import { Task } from '@cm/types/userTask'
import { Calendar } from '@cm/ui/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@cm/ui/components/ui/popover'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { GripVertical } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { DayPicker, getDefaultClassNames } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

type TaskProps = {
  taskId: string
  title: string
  priority: Task['priority']
  startDate: string
  endDate: string
  onSelect: (isSelected: boolean) => void
  onUpdate?: (
    taskId: string,
    data: Partial<{
      title?: string
      description?: string
      status?: Task['status']
      assigneeEmail?: string
      startDate?: string
      endDate?: string
      priority?: Task['priority']
      epicId?: string
    }>
  ) => void
  onTaskClick: () => void
}

export default function KanbanTask({
  taskId,
  title: initialTitle,
  priority: initialPriority,
  startDate: initialStartDate,
  endDate: initialEndDate,
  onSelect,
  onUpdate,
  onTaskClick,
}: TaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: taskId })

  const [isChecked, setIsChecked] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isTitleHovered, setIsTitleHovered] = useState(false)
  const [priority, setPriority] = useState<Task['priority']>(initialPriority)
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(initialTitle)
  const [startDate, setStartDate] = useState<Date>(new Date(initialStartDate))
  const [endDate, setEndDate] = useState<Date>(new Date(initialEndDate))
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [tempStartDate, setTempStartDate] = useState<Date>(
    new Date(initialStartDate)
  )
  const [tempEndDate, setTempEndDate] = useState<Date>(new Date(initialEndDate))
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
      onClick={(e) => {
        const target = e.target as HTMLElement
        if (
          !target.closest('input') &&
          !target.closest('.priority-badge') &&
          !target.closest('.duration-text') &&
          !target.closest('.task-title')
        ) {
          onTaskClick()
        }
      }}
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
            className="text-black-01 text-base font-medium break-words cursor-text hover:text-gray-01 transition-colors task-title"
            onMouseEnter={() => setIsTitleHovered(true)}
            onMouseLeave={() => setIsTitleHovered(false)}
            onDoubleClick={(e) => {
              if (isTitleHovered) {
                e.stopPropagation()
                handleDoubleClick()
              }
            }}
            onClick={(e) => {
              if (!isTitleHovered) {
                e.stopPropagation()
                onTaskClick()
              }
            }}
          >
            {title}
          </span>
        )}
      </div>

      {/* Priority Badge (clickable) */}
      <div
        className={`mb-3 inline-block text-xs font-normal px-2 py-1 rounded-sm cursor-pointer ${priorityStyleMap[priority]} mb-1 priority-badge`}
        onClick={cyclePriority}
      >
        {formatPriority(priority)}
      </div>

      {/* Duration */}
      <Popover
        open={isCalendarOpen}
        onOpenChange={(open) => {
          setIsCalendarOpen(open)
          if (!open) {
            setStartDate(tempStartDate)
            setEndDate(tempEndDate)
            onUpdate?.(taskId, {
              startDate: tempStartDate.toISOString(),
              endDate: tempEndDate.toISOString(),
            })
          }
        }}
      >
        <PopoverTrigger asChild>
          <div
            className="text-xs text-gray-01 font-medium cursor-pointer hover:text-black-01 duration-text"
            onDoubleClick={handleDurationDoubleClick}
          >
            {formatDate(startDate)} ~ {formatDate(endDate)}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={{ from: tempStartDate, to: tempEndDate }}
            onSelect={(range) => {
              if (range?.from) {
                setTempStartDate(range.from)
                if (range.to) {
                  setTempEndDate(range.to)
                }
              }
            }}
            locale={ko}
            numberOfMonths={1}
            className="rounded-md border"
            classNames={{
              caption_label:
                'flex items-center justify-center h-10 ml-2 text-sm font-medium',
            }}
            formatters={{
              formatCaption: (date) => format(date, 'yyyy. MM', { locale: ko }),
              formatWeekdayName: (weekday) => {
                const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
                return weekdays[weekday.getDay()]
              },
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
