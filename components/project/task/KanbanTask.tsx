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
import { DateRange, DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

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
            onSelect={(range: DateRange | undefined) => {
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
            className="border rounded-md [&_.rdp-nav_button:hover]:opacity-100"
            styles={{
              months: {
                display: 'flex',
                flexDirection: 'column',
              },
              month: {
                display: 'flex',
                flexDirection: 'column',
              },
              caption: {
                margin: 0,
                padding: '0.5rem 0',
              },
              caption_label: {
                fontSize: '0.875rem',
                fontWeight: 500,
              },
              nav: {
                marginLeft: 'auto',
              },
              nav_button: {
                height: '28px',
                width: '28px',
                padding: 0,
                opacity: 0.5,
              },
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
