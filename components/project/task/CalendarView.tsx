'use client'

import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { ko } from 'date-fns/locale'

// 날짜 로컬라이저 설정
const locales = { ko }

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
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

// 캘린더 메시지 한국어 설정
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
  return (
    <div className="h-[600px] lg:h-[700px] bg-white rounded-2xl shadow-md p-4 sm:p-6 overflow-auto">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        messages={calendarMessages}
        className="text-sm"
      />
    </div>
  )
}
