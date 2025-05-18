'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface ScheduleItem {
  title: string
  time: string
}

interface ScheduleCardProps {
  schedules: ScheduleItem[]
  projectId: string
}

export default function ScheduleCard({
  schedules,
  projectId,
}: ScheduleCardProps) {
  const [weekDates, setWeekDates] = useState<number[]>([])

  useEffect(() => {
    const updateWeekDates = () => {
      const now = new Date()
      const kstOffset = 9 * 60
      const userOffset = now.getTimezoneOffset()
      const totalOffset = kstOffset + userOffset

      const today = new Date(now.getTime() + totalOffset * 60000)
      const currentDay = today.getDay()
      const sunday = new Date(today)
      sunday.setDate(today.getDate() - currentDay)

      const dates = []
      for (let i = 0; i < 7; i++) {
        const date = new Date(sunday)
        date.setDate(sunday.getDate() + i)
        dates.push(date.getDate())
      }
      setWeekDates(dates)
    }

    updateWeekDates()
    const now = new Date()
    const tomorrow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    )
    const timeUntilMidnight = tomorrow.getTime() - now.getTime()

    const timeout = setTimeout(updateWeekDates, timeUntilMidnight)
    return () => clearTimeout(timeout)
  }, [])

  const today = new Date()
  const kstOffset = 9 * 60
  const userOffset = today.getTimezoneOffset()
  const totalOffset = kstOffset + userOffset
  const kstToday = new Date(today.getTime() + totalOffset * 60000)
  const currentDate = kstToday.getDate()

  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="w-full flex items-center justify-between mb-4">
          <CardTitle>스케줄</CardTitle>
          <Link
            href={`/projects/${projectId}/task?view=calendar`}
            className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
          >
            더보기 <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="w-full flex justify-center">
          <div className="flex gap-7">
            {weekDates.map((date, index) => (
              <span
                key={index}
                className={`text-[#3E2723] text-sm font-normal w-9 h-9 flex items-center justify-center ${
                  date === currentDate
                    ? 'bg-cm text-white rounded-full px-2 py-1.5'
                    : ''
                }`}
              >
                {date}
              </span>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-40">
          {schedules.map((event, index) => (
            <div key={index} className="flex justify-between p-2 border-b">
              <span>{event.title}</span>
              <span className="text-xs text-gray-500">{event.time}</span>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
