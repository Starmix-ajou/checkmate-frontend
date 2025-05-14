'use client'

import CheckMateLogoSpinner from '@/components/CheckMateSpinner'
import { Task } from '@/types/userTask'
import { format, getDay, isSameDay, parse, startOfWeek } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useEffect, useState } from 'react'
import { Calendar, View, dateFnsLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'

import { CalendarLogic } from './CalendarLogic'

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
}

// 메시지 한국어 설정
const calendarMessages = {
  next: '다음',
  previous: '이전',
  today: '오늘',
  month: '월',
  week: '주',
  day: '일',
  agenda: '목록',
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
}

export default function CalendarView({
  projectId,
  searchText,
  filters,
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<View>('month')
  const { tasks, loading, error, fetchTasks } = CalendarLogic(projectId)

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
          backgroundColor: '#f3f4f6', // 회색 배경
          color: '#9ca3af', // 회색 텍스트
        },
      }
    }

    if (isToday && viewingToday) {
      return {
        style: {
          backgroundColor: '#e0f2fe', // 하늘색 배경
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
    }))

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
    <div className="h-[600px] lg:h-[700px] bg-white rounded-2xl shadow-md p-4 sm:p-6 overflow-auto">
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
        className="text-sm"
        views={['month', 'week', 'day', 'agenda']}
        view={view}
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
      />
    </div>
  )
}
