'use client'

import CheckMateLogoSpinner from '@/components/CheckMateSpinner'
import { Member } from '@/types/project'
import { Task } from '@/types/userTask'
import { format, getDay, isSameDay, parse, startOfWeek } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Check, Pencil, Pickaxe } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Calendar, Formats, View, dateFnsLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'

import { CalendarLogic } from './CalendarLogic'
import TaskModal from './TaskModal'

// 로컬라이저 설정
const locales = { ko }
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
})

// 이벤트 타입 정의
type Event = {
  id: string
  title: string
  start: Date
  end: Date
  allDay?: boolean
  priority: Task['priority']
  task: Task // Task 객체 전체를 저장
}

// 상태 스타일 매핑 추가
const statusStyleMap: Record<
  Task['status'],
  { bg: string; text: string; displayText: string; icon: React.ReactNode }
> = {
  TODO: {
    bg: '#F8F8F7',
    text: '#858380',
    displayText: 'To Do',
    icon: <Pencil size={14} color="#858380" />,
  },
  IN_PROGRESS: {
    bg: '#F3F9FC',
    text: '#5093BC',
    displayText: 'In Progress',
    icon: <Pickaxe size={14} color="#5093BC" />,
  },
  DONE: {
    bg: '#F6FAF6',
    text: '#5C9771',
    displayText: 'Done',
    icon: <Check size={14} color="#5C9771" />,
  },
}

// 메시지 설정
const calendarMessages = {
  next: 'Next',
  previous: 'Prev',
  today: 'Today',
  month: 'Month',
  week: 'Week',
  agenda: 'Task List',
  event: 'Task',
}

// 요일 포맷 설정 추가
const formats: Formats = {
  weekdayFormat: (date: Date) => {
    return format(date, 'EEE').toUpperCase()
  },
  monthHeaderFormat: (date: Date) => {
    return format(date, 'yyyy. MM')
  },
  dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) => {
    const startMonth = format(start, 'MM')
    const startDay = format(start, 'dd')
    const endDay = format(end, 'dd')
    return `${startMonth}. ${startDay} - ${endDay}`
  },
  agendaHeaderFormat: ({ start }: { start: Date }) => {
    return format(start, 'yyyy. MM')
  },
}

type CalendarViewProps = {
  projectId: string
  searchText: string
  filters: {
    priority: Task['priority'] | 'ALL'
    epicId: string
    sprintId: string
    assigneeEmails: string[]
  }
  members: Member[]
}

export default function CalendarView({
  projectId,
  searchText,
  filters,
  members,
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<View>('month')
  const {
    tasks,
    loading,
    error,
    fetchTasks,
    handleTaskUpdate,
    getTaskById,
    deleteTask,
  } = CalendarLogic(projectId)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  // filters가 변경될 때마다 fetchTasks 호출
  useEffect(() => {
    fetchTasks(filters)
  }, [filters, fetchTasks])

  const handleNavigate = (newDate: Date) => {
    setCurrentDate(newDate)
  }

  const customDayPropGetter = (date: Date) => {
    const isToday = isSameDay(date, new Date())
    const viewingToday = isSameDay(currentDate, new Date())
    const isSameMonth = date.getMonth() === currentDate.getMonth()

    if (!isSameMonth) {
      return {
        style: {
          backgroundColor: '#f3f4f6',
          color: '#9ca3af',
        },
      }
    }

    if (isToday && viewingToday) {
      return {
        style: {
          backgroundColor: '#efeae8',
          fontWeight: 'bold',
        },
      }
    }

    return {
      style: {
        backgroundColor: 'white',
        fontWeight: 'normal',
      },
    }
  }

  // Task를 Event 형식으로 변환
  const events: Event[] = tasks
    .filter((task) => {
      // 검색어 필터링
      if (
        searchText &&
        !task.title.toLowerCase().includes(searchText.toLowerCase())
      ) {
        return false
      }
      return true
    })
    .map((task) => ({
      id: task.taskId,
      title: task.title,
      start: new Date(task.startDate),
      end: new Date(task.endDate),
      allDay: true,
      priority: task.priority,
      task, // Task 객체 전체를 저장
    }))

  const handleEventClick = (event: Event) => {
    setSelectedTask(event.task)
  }

  const handleModalClose = () => {
    setSelectedTask(null)
  }

  const updateTaskAndState = async (
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
  ) => {
    try {
      console.log('캘린더 - 업데이트 전 데이터:', {
        taskId,
        currentTask: selectedTask,
        updateData: data,
      })

      // taskId를 제외한 데이터만 전송
      const updateData = Object.fromEntries(
        Object.entries(data).filter(([key]) => key !== 'taskId')
      )

      // 서버에 업데이트 요청만 하고, 로컬 상태 업데이트는 하지 않음
      await handleTaskUpdate(taskId, updateData)

      // 모달에 표시된 태스크만 업데이트
      if (selectedTask?.taskId === taskId) {
        setSelectedTask((prev) => (prev ? { ...prev, ...updateData } : null))
      }
    } catch (error) {
      console.error('태스크 업데이트 실패:', error)
    }
  }

  const handleTaskDelete = async (taskId: string) => {
    try {
      await deleteTask(taskId)
      // CalendarLogic의 tasks 상태 업데이트를 위해 fetchTasks 호출
      await fetchTasks(filters)
      handleModalClose()
    } catch (error) {
      console.error('태스크 삭제 실패:', error)
      alert('태스크 삭제에 실패했습니다.')
    }
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="text-red-500 text-center">
          <p className="text-lg font-medium mb-2">오류가 발생했습니다</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <CheckMateLogoSpinner size={64} />
      </div>
    )
  }

  return (
    <div className="h-[600px] lg:h-[700px] bg-white p-4 sm:p-6 pt-0 sm:pt-0 overflow-auto">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        date={currentDate}
        onNavigate={handleNavigate}
        onView={(newView) => setView(newView)}
        dayPropGetter={customDayPropGetter}
        style={{ height: '100%' }}
        messages={calendarMessages}
        className="text-sm [&_.rbc-header]:bg-[#efeae8] [&_.rbc-header]:!font-normal [&_.rbc-toolbar-label]:text-lg [&_.rbc-toolbar-label]:font-semibold"
        views={['month', 'week', 'agenda']}
        view={view}
        formats={formats}
        components={{
          event: ({ event }) => (
            <div className="group flex items-center gap-2">
              <span
                className={event.task.status === 'DONE' ? 'line-through' : ''} //decoration-2 추기
              >
                {event.title}
              </span>
              <span
                className="px-2 py-0.5 rounded-full text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{
                  backgroundColor: statusStyleMap[event.task.status].bg,
                  color: statusStyleMap[event.task.status].text,
                }}
              >
                {statusStyleMap[event.task.status].icon}
                {statusStyleMap[event.task.status].displayText}
              </span>
            </div>
          ),
        }}
        eventPropGetter={(event) => {
          const priorityStyleMap: Record<
            Task['priority'],
            { style: React.CSSProperties }
          > = {
            LOW: {
              style: {
                backgroundColor: '#E1FBD6',
                color: '#204206',
                border: 'none',
              },
            },
            MEDIUM: {
              style: {
                backgroundColor: '#FFF5E2',
                color: '#B46C00',
                border: 'none',
              },
            },
            HIGH: {
              style: {
                backgroundColor: '#FFE5E3',
                color: '#D91F11',
                border: 'none',
              },
            },
          }
          return priorityStyleMap[event.priority]
        }}
        onSelectEvent={handleEventClick}
      />

      {selectedTask && (
        <div className="relative z-10">
          <TaskModal
            task={selectedTask}
            isOpen={!!selectedTask}
            onClose={handleModalClose}
            members={members}
            onUpdate={updateTaskAndState}
            getTaskById={getTaskById}
            deleteTask={handleTaskDelete}
          />
        </div>
      )}
    </div>
  )
}
