'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuthStore } from '@/stores/useAuthStore'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface ScheduleItem {
  title: string
  endDate: string
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
}

interface ScheduleGroup {
  date: string
  tasks: ScheduleItem[]
}

interface ScheduleCardProps {
  projectId: string
}

export default function ScheduleCard({ projectId }: ScheduleCardProps) {
  const [weekDates, setWeekDates] = useState<number[]>([])
  const [schedules, setSchedules] = useState<ScheduleGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    const fetchSchedules = async () => {
      if (!user?.accessToken) {
        console.log('인증 토큰이 없습니다.')
        setLoading(false)
        return
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/task/schedule?projectId=${projectId}`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${user.accessToken}`,
            },
            credentials: 'include',
          }
        )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: ScheduleGroup[] = await response.json()
        setSchedules(data)
      } catch (error) {
        console.error('스케줄 조회 실패:', error)
        setError('스케줄 정보를 불러오는데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchSchedules()
  }, [projectId, user?.accessToken])

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

  if (loading) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <div className="w-full flex items-center justify-between mb-4">
            <CardTitle>스케줄</CardTitle>
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="w-full flex justify-center mb-2">
            <div className="flex gap-7">
              {[...Array(7)].map((_, index) => (
                <div key={index} className="flex flex-col items-center gap-1">
                  <Skeleton className="h-3 w-3" />
                  <Skeleton className="w-9 h-9 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between px-4 py-1 border-b border-[#DCDCDC]">
            <Skeleton className="h-4 w-[60%]" />
            <Skeleton className="h-4 w-[20%] mx-3" />
            <Skeleton className="h-4 w-[20%]" />
          </div>
          <ScrollArea className="h-[148px]">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex justify-between p-2 border-b border-[#DCDCDC]"
              >
                <div className="w-[60%] mr-3">
                  <Skeleton className="h-5 w-full" />
                </div>
                <div className="w-[20%] mr-3">
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="w-[20%]">
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return <div>에러: {error}</div>
  }

  const formatStatus = (status: string) => {
    switch (status) {
      case 'TODO':
        return 'To Do'
      case 'IN_PROGRESS':
        return 'In Progress'
      case 'DONE':
        return 'Done'
      default:
        return status
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'DONE':
        return 'bg-cm-green-light text-[#5C9771]'
      case 'IN_PROGRESS':
        return 'bg-[#F3F9FC] text-[#5093BC]'
      default:
        return 'bg-cm-gray-light text-cm-gray'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${month}. ${day}`
  }

  // 선택된 날짜 또는 오늘 날짜의 Task를 가져오는 함수
  const getFilteredTasks = () => {
    const now = new Date()
    const kstOffset = 9 * 60
    const userOffset = now.getTimezoneOffset()
    const totalOffset = kstOffset + userOffset
    const kstToday = new Date(now.getTime() + totalOffset * 60000)

    const year = kstToday.getFullYear()
    const month = String(kstToday.getMonth() + 1).padStart(2, '0')

    // 선택된 날짜가 있으면 해당 날짜의 Task를, 없으면 오늘 날짜의 Task를 반환
    const targetDate =
      selectedDate ||
      `${year}-${month}-${String(kstToday.getDate()).padStart(2, '0')}`

    return schedules
      .filter((schedule) => schedule.date === targetDate)
      .flatMap((schedule) => schedule.tasks)
      .sort((a, b) => {
        const dateA = new Date(a.endDate).getTime()
        const dateB = new Date(b.endDate).getTime()
        return dateA - dateB
      })
  }

  // 날짜 클릭 핸들러
  const handleDateClick = (date: number) => {
    const now = new Date()
    const kstOffset = 9 * 60
    const userOffset = now.getTimezoneOffset()
    const totalOffset = kstOffset + userOffset
    const kstToday = new Date(now.getTime() + totalOffset * 60000)

    const year = kstToday.getFullYear()
    const month = String(kstToday.getMonth() + 1).padStart(2, '0')
    const selectedDateStr = `${year}-${month}-${String(date).padStart(2, '0')}`

    setSelectedDate(selectedDateStr)
  }

  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="w-full flex items-center justify-between mb-4">
          <CardTitle>스케줄</CardTitle>
          <Link
            href={`/projects/${projectId}/task?view=calendar`}
            className="text-xs text-cm-gray hover:text-gray-700 flex items-center"
          >
            더보기 <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="w-full flex justify-center">
          <div className="flex gap-7">
            {weekDates.map((date, index) => (
              <div key={index} className="flex flex-col items-center">
                <span
                  className={`text-xs mb-1 ${
                    ['S', 'M', 'T', 'W', 'T', 'F', 'S'][index] === 'S'
                      ? 'text-[#D91F11]'
                      : 'text-cm-900'
                  }`}
                >
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'][index]}
                </span>
                <span
                  onClick={() => handleDateClick(date)}
                  className={`text-cm-900 text-sm font-normal w-9 h-9 flex items-center justify-center cursor-pointer
                    ${date === currentDate ? 'bg-cm text-white rounded-full' : ''}
                    ${
                      selectedDate ===
                      `${new Date().getFullYear()}-${String(
                        new Date().getMonth() + 1
                      ).padStart(2, '0')}-${String(date).padStart(2, '0')}`
                        ? 'border-2 border-solid border-cm rounded-full'
                        : ''
                    }
                  `}
                >
                  {date}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between px-4 py-1 border-b border-[#DCDCDC] bg-white">
          <span className="w-[60%] text-xs font-base text-gray-01 mr-3">
            작업
          </span>
          <span className="w-[20%] text-xs font-base text-gray-01 mr-3">
            마감일
          </span>
          <span className="w-[20%] text-xs font-base text-gray-01">상태</span>
        </div>
        <ScrollArea className="h-[148px]">
          {getFilteredTasks().length > 0 ? (
            getFilteredTasks().map((task, index) => (
              <div
                key={index}
                className="flex justify-between p-2 border-b border-[#DCDCDC]"
              >
                <div className="w-[60%] mr-3">
                  <span className="font-base text-[#0F0F0F] text-sm">
                    {task.title}
                  </span>
                </div>
                <div className="w-[20%] mr-3">
                  <span className="text-xs text-cm-gray">
                    {formatDate(task.endDate)}
                  </span>
                </div>
                <div className="w-[20%]">
                  <span
                    className={`px-2 py-1 text-xs rounded-sm ${getStatusStyle(task.status)}`}
                  >
                    {formatStatus(task.status)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center mt-6">
              <span className="text-sm text-cm-gray font-medium">
                해당 날짜에 예정된 작업이 없습니다.
              </span>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
