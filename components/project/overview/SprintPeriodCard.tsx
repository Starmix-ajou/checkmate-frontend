'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export default function SprintPeriodCard() {
  const [today, setToday] = useState<Date | null>(null)

  useEffect(() => {
    setToday(new Date())
  }, [])

  if (!today) {
    return <div>Loading...</div>
  }

  const startDate = new Date('2025-03-25')
  const endDate = new Date('2025-04-08')

  const totalDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  )
  const elapsedDays = Math.ceil(
    (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  )
  const remainingDays = totalDays - elapsedDays
  const progress = Math.min((elapsedDays / totalDays) * 100, 100)

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>
          Sprint 종료까지 D-{remainingDays > 0 ? remainingDays : 0}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          <Progress value={progress} className="w-full" />

          <div className="text-sm text-gray-500">
            {startDate.toLocaleDateString()} ~ {endDate.toLocaleDateString()} (
            {totalDays}일)
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
