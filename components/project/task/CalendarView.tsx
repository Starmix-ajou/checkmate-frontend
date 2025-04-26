'use client'

import { useState } from 'react'
import { Calendar, dateFnsLocalizer, View } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { format, parse, startOfWeek, getDay, isSameDay } from 'date-fns'
import { ko } from 'date-fns/locale'

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
  title: string
  start: Date
  end: Date
  allDay?: boolean
}

const events: Event[] = [
  {
    title: '회의',
    start: new Date(),
    end: new Date(),
    allDay: true,
  },
]

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

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<View>('month')

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

  return (
    <div className="h-[600px] lg:h-[700px] bg-white rounded-2xl shadow-md p-4 sm:p-6 overflow-auto">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        date={currentDate}
        onNavigate={handleNavigate}
        onView={(newView) => setView(newView)} // 기본 버튼 클릭 시 view 상태 업데이트
        dayPropGetter={customDayPropGetter}
        style={{ height: '100%' }}
        messages={calendarMessages}
        className="text-sm"
        views={['month', 'week', 'day', 'agenda']}
        view={view}
      />
    </div>
  )
}
