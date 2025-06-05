import { Member } from '@cm/types/project'
import { Task } from '@cm/types/userTask'
import CheckmateSpinner from '@cm/ui/components/common/CheckmateSpinner'
import { Button } from '@cm/ui/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@cm/ui/components/ui/popover'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import {
  ChevronDown,
  KeyRound,
  Milestone,
  Swords,
  Trash2,
  X,
} from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { DayPicker, getDefaultClassNames } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

import TaskComment from './TaskComment'

type TaskModalProps = {
  task: Task
  isOpen: boolean
  onClose: () => void
  members: Member[]
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
  getTaskById: (taskId: string) => Promise<Task>
  deleteTask: (taskId: string) => Promise<void>
}

export default function TaskModal({
  isOpen,
  onClose,
  task: initialTask,
  onUpdate,
  members,
  getTaskById,
  deleteTask,
}: TaskModalProps) {
  const [task, setTask] = useState<Task>(initialTask)
  const [title, setTitle] = useState(initialTask.title)
  const [description, setDescription] = useState(initialTask.description || '')
  const [priority, setPriority] = useState<Task['priority']>(
    initialTask.priority
  )
  const [status, setStatus] = useState<'TODO' | 'IN_PROGRESS' | 'DONE'>(
    initialTask.status
  )
  const [startDate, setStartDate] = useState<Date>(
    new Date(initialTask.startDate)
  )
  const [endDate, setEndDate] = useState<Date>(new Date(initialTask.endDate))
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [isAssigneeOpen, setIsAssigneeOpen] = useState(false)
  const [selectedAssignee, setSelectedAssignee] = useState<Member | null>(
    members.find((m) => m.email === initialTask.assignee?.email) || null
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [learned, setLearned] = useState(initialTask.review?.learn || '')
  const [difficulties, setDifficulties] = useState(
    initialTask.review?.hardest || ''
  )
  const [nextTasks, setNextTasks] = useState(initialTask.review?.next || '')

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    }
  }, [isOpen])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true)
        const updatedTask = await getTaskById(initialTask.taskId)
        setTask(updatedTask)
        setTitle(updatedTask.title)
        setDescription(updatedTask.description || '')
        setPriority(updatedTask.priority)
        setStatus(updatedTask.status)
        setStartDate(new Date(updatedTask.startDate))
        setEndDate(new Date(updatedTask.endDate))
        setSelectedAssignee(
          members.find((m) => m.email === updatedTask.assignee?.email) || null
        )
        setLearned(updatedTask.review?.learn || '')
        setDifficulties(updatedTask.review?.hardest || '')
        setNextTasks(updatedTask.review?.next || '')
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : '태스크를 불러오는데 실패했습니다.'
        )
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) {
      fetchTask()
    }
  }, [isOpen, initialTask.taskId, getTaskById, members])

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

  const cycleStatus = () => {
    const statuses: ('TODO' | 'IN_PROGRESS' | 'DONE')[] = [
      'TODO',
      'IN_PROGRESS',
      'DONE',
    ]
    const nextIndex = (statuses.indexOf(status) + 1) % statuses.length
    setStatus(statuses[nextIndex])
  }

  const cyclePriority = () => {
    const priorities: Task['priority'][] = ['LOW', 'MEDIUM', 'HIGH']
    const nextIndex = (priorities.indexOf(priority) + 1) % priorities.length
    setPriority(priorities[nextIndex])
  }

  const formatStatus = (status: 'TODO' | 'IN_PROGRESS' | 'DONE') => {
    switch (status) {
      case 'TODO':
        return 'To Do'
      case 'IN_PROGRESS':
        return 'In Progress'
      case 'DONE':
        return 'Done'
    }
  }

  const formatPriority = (priority: Task['priority']) => {
    return priority.charAt(0) + priority.slice(1).toLowerCase()
  }

  const statusStyleMap: Record<'TODO' | 'IN_PROGRESS' | 'DONE', string> = {
    TODO: 'bg-cm-gray-light text-cm-gray',
    IN_PROGRESS: 'bg-[#F3F9FC] text-[#5093BC]',
    DONE: 'bg-cm-green-light text-[#5C9771]',
  }

  const priorityStyleMap: Record<Task['priority'], string> = {
    LOW: 'bg-[#E1FBD6] text-[#204206]',
    MEDIUM: 'bg-[#FFF5E2] text-[#B46C00]',
    HIGH: 'bg-[#FFE5E3] text-[#D91F11]',
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
        assigneeEmail: selectedAssignee?.email || '',
        epicId: task.epic.epicId,
        review: {
          learn: learned,
          hardest: difficulties,
          next: nextTasks,
        },
      }

      await onUpdate(task.taskId, updateData)
      onClose()
    } catch (error) {
      console.error('태스크 업데이트 실패:', error)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('해당 태스크를 삭제하시겠습니까?')) {
      try {
        await deleteTask(task.taskId)
        handleClose()
      } catch (error) {
        console.error('태스크 삭제 실패:', error)
        alert('태스크 삭제에 실패했습니다.')
      }
    }
  }

  if (!isOpen && !isVisible) return null

  if (loading) {
    return (
      <>
        <div
          className={`fixed inset-0 bg-black/10 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          onClick={handleClose}
        />
        <div
          className={`fixed top-12 right-0 h-[calc(100%-3rem)] w-[500px] bg-white shadow-lg overflow-y-auto transition-transform duration-300 ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="relative w-full h-full">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <CheckmateSpinner />
            </div>
          </div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <div
          className={`fixed inset-0 bg-black/10 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          onClick={handleClose}
        />
        <div
          className={`fixed top-12 right-0 h-[calc(100%-3rem)] w-[500px] bg-white shadow-lg overflow-y-auto transition-transform duration-300 ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="p-6">
            <div className="flex justify-center items-center h-full">
              <p className="text-red-500">{error}</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/10 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      />
      <div
        className={`fixed top-12 right-0 h-[calc(100%-3rem)] w-[500px] bg-white shadow-lg overflow-y-auto transition-transform duration-300 ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold">
                {task.epic.sprint?.title || '스프린트 없음'}
              </h2>
              {task.epic?.description && (
                <p className="text-base text-gray-01 mt-1">
                  {task.epic.sprint?.description}
                </p>
              )}
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid gap-4">
            {/* 에픽 정보 */}
            <div>
              <h3 className="text-sm font-medium text-cm-gray mb-2">Epic</h3>
              {task.epic?.title && (
                <p className="text-base font-medium text-gray-700 mt-2">
                  {task.epic.title}
                </p>
              )}
              {task.epic?.description && (
                <p className="text-sm text-cm-gray mt-1">
                  {task.epic.description}
                </p>
              )}
            </div>
            {/* 제목 */}
            <div>
              <h3 className="text-sm font-medium text-cm-gray mb-2">
                Task Title
              </h3>
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cm"
              />
            </div>

            {/* 담당자 */}
            <div>
              <h3 className="text-sm font-medium text-cm-gray mb-2">
                Assignee
              </h3>
              <Popover open={isAssigneeOpen} onOpenChange={setIsAssigneeOpen}>
                <PopoverTrigger asChild>
                  <div className="flex items-center justify-between p-2 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center gap-2">
                      {selectedAssignee?.profileImageUrl && (
                        <Image
                          width={32}
                          height={32}
                          src={selectedAssignee.profileImageUrl}
                          alt={selectedAssignee.name}
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium">
                          {selectedAssignee?.name || '담당자 선택'}
                        </div>
                        <div className="text-xs text-cm-gray">
                          {selectedAssignee?.email}
                        </div>
                      </div>
                    </div>
                    <ChevronDown size={20} className="text-black-01" />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <div className="max-h-[300px] overflow-y-auto">
                    {members.map((member) => (
                      <div
                        key={member.userId}
                        className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          setSelectedAssignee(member)
                          setIsAssigneeOpen(false)
                        }}
                      >
                        {member.profileImageUrl && (
                          <Image
                            width={32}
                            height={32}
                            src={member.profileImageUrl}
                            alt={member.name}
                            className="w-8 h-8 rounded-full"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium">
                            {member.name}
                          </div>
                          <div className="text-xs text-cm-gray">
                            {member.email}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* 상태 */}
            <div>
              <h3 className="text-sm font-medium text-cm-gray mb-2">Status</h3>
              <div
                className={`inline-block text-sm font-normal px-3 py-1.5 rounded-sm cursor-pointer ${statusStyleMap[status]}`}
                onClick={cycleStatus}
              >
                {formatStatus(status)}
              </div>
            </div>

            {/* 우선순위 */}
            <div>
              <h3 className="text-sm font-medium text-cm-gray mb-2">
                Priority
              </h3>
              <div
                className={`inline-block text-sm font-normal px-3 py-1.5 rounded-sm cursor-pointer ${priorityStyleMap[priority]}`}
                onClick={cyclePriority}
              >
                {formatPriority(priority)}
              </div>
            </div>

            {/* 기간 */}
            <div>
              <h3 className="text-sm font-medium text-cm-gray mb-2">
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
                      ...getDefaultClassNames(),
                      today: 'font-black',
                      selected: 'bg-[#795548] border-[#795548] text-black-01',
                      root: `${getDefaultClassNames().root} shadow-lg p-5`,
                      chevron: `${getDefaultClassNames().chevron} fill-[#795548] text-[#795548] hover:fill-[#795548] hover:text-[#795548]`,
                    }}
                    formatters={{
                      formatCaption: (date) => format(date, 'yyyy. MM'),
                      formatWeekdayName: (weekday) => {
                        const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
                        return weekdays[weekday.getDay()]
                      },
                    }}
                    modifiers={{
                      weekend: (date) =>
                        date.getDay() === 0 || date.getDay() === 6,
                    }}
                    modifiersStyles={{
                      weekend: { color: '#D91F11' },
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* 설명 */}
            <div>
              <h3 className="text-sm font-medium text-cm-gray mb-2">
                Description
              </h3>
              <textarea
                value={description}
                onChange={handleDescriptionChange}
                className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cm min-h-[100px]"
                placeholder="Add a description..."
              />
            </div>

            {/* 회고 */}
            <div>
              <h3 className="text-sm font-medium text-cm-gray mb-2">
                Retrospective
              </h3>
              <div className="flex items-center mb-1">
                <KeyRound size={16} className="text-[#FFD66B] mr-1" />
                <h4 className="text-xs font-medium text-cm-300">
                  Key Learnings
                </h4>
              </div>
              <textarea
                value={learned}
                onChange={(e) => setLearned(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cm min-h-[100px] mb-4"
                placeholder="이번 Task를 통해 학습한 기술이나 개념 등 간단히 적어보세요."
              />
              <div className="flex items-center mb-1">
                <Swords size={16} className="text-[#F75A5A] mr-1" />
                <h4 className="text-xs font-medium text-cm-300">Challenges</h4>
              </div>
              <textarea
                value={difficulties}
                onChange={(e) => setDifficulties(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cm min-h-[100px] mb-4"
                placeholder="어떤 부분에서 막혔는지, 예상보다 오래 걸린 이유가 무엇이었는지 간단히 적어보세요."
              />
              <div className="flex items-center mb-1">
                <Milestone size={16} className="text-[#4DA8DA] mr-1" />
                <h4 className="text-xs font-medium text-cm-300">Next Steps</h4>
              </div>
              <textarea
                value={nextTasks}
                onChange={(e) => setNextTasks(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cm min-h-[100px]"
                placeholder="바로 이어서 할 Task나, 진행 중 떠오른 아이디어가 있다면 간단히 적어보세요."
              />
            </div>

            {/* 댓글 섹션 */}
            <TaskComment taskId={task.taskId} />

            <div className="flex justify-between items-center gap-2 mt-4">
              <Button
                onClick={handleDelete}
                className="flex items-center gap-2 bg-[#FFE5E3] text-[#D91F11] hover:bg-[#D91F11] hover:text-[#FFE5E3]"
              >
                <Trash2 size={16} />
                삭제
              </Button>
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  className="bg-cm-900 hover:bg-cm-700"
                >
                  수정 완료
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
