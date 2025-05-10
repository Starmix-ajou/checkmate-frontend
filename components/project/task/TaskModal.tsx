import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Task } from '@/types/userTask'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { X } from 'lucide-react'
import { useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

type TaskModalProps = {
  task: Task
  isOpen: boolean
  onClose: () => void
  onUpdate: (
    taskId: string,
    data: Partial<{
      title: string
      description: string
      status: Task['status']
      assigneeEmail: string
      startDate: string
      endDate: string
      priority: Task['priority']
      epicId: string
    }>
  ) => Promise<void>
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
  const [status, setStatus] = useState<'TODO' | 'IN_PROGRESS' | 'DONE'>(
    task.status
  )
  const [startDate, setStartDate] = useState<Date>(new Date(task.startDate))
  const [endDate, setEndDate] = useState<Date>(new Date(task.endDate))
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy.MM.dd')
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value)
  }

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPriority(e.target.value as Task['priority'])
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value as 'TODO' | 'IN_PROGRESS' | 'DONE')
  }

  const handleSave = async () => {
    try {
      const updateData = {
        title: title,
        description: description,
        status: status,
        priority: priority,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      }

      await onUpdate(task.taskId, updateData)
      onClose()
    } catch (error) {
      console.error('태스크 업데이트 실패:', error)
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="fixed top-12 right-0 h-[calc(100%-3rem)] w-[500px] bg-white shadow-lg overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">태스크 상세</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid gap-4">
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
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <div
                    className="text-sm text-black-01 font-medium cursor-pointer hover:text-gray-01"
                    onClick={() => setIsCalendarOpen(true)}
                  >
                    {formatDate(startDate.toISOString())} ~{' '}
                    {formatDate(endDate.toISOString())}
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
                        }
                      }
                    }}
                    locale={ko}
                    captionLayout="label"
                    classNames={{
                      caption: 'flex justify-between items-center px-4 py-2',
                      nav: 'flex items-center justify-between w-full flex items-center px-4',
                      nav_button:
                        'text-gray-500 hover:text-black transition-colors',
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

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={onClose}>
                취소
              </Button>
              <Button onClick={handleSave}>수정 완료</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
