'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface SprintPeriodCardProps {
  startDate: string
  endDate: string
  loading?: boolean
  projectId: string
}

export default function SprintPeriodCard({
  startDate,
  endDate,
  loading = false,
  projectId,
}: SprintPeriodCardProps) {
  const [today, setToday] = useState<Date | null>(null)
  const router = useRouter()

  useEffect(() => {
    setToday(new Date())
  }, [])

  if (loading || !today) {
    return (
      <Card className="col-span-2 gap-5">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="flex flex-col gap-5 items-center">
          <div className="flex flex-col w-full">
            <Skeleton className="w-full h-2 rounded-full" />
            <Skeleton className="h-4 w-16 ml-auto mt-1" />
          </div>
          <Skeleton className="w-full h-8" />
        </CardContent>
      </Card>
    )
  }

  const start = new Date(startDate)
  const end = new Date(endDate)

  const totalDays = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  )
  const elapsedDays = Math.ceil(
    (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  )
  const remainingDays = totalDays - elapsedDays
  const progress = Math.max(0, Math.min((elapsedDays / totalDays) * 100, 100))

  return (
    <Card className="col-span-2 gap-2">
      <CardHeader>
        <CardTitle>다음 스프린트까지</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 items-center">
        <div className="flex flex-col w-full">
          <div className="relative h-5">
            <Image
              src="/tabler-run.svg"
              alt="hi"
              width={20}
              height={20}
              className="text-cm-blue absolute"
              style={{ left: `${progress}%`, transform: 'translateX(-50%)' }}
            />
          </div>
          <Progress value={progress} className="w-full h-2 rounded-full" />

          <div className="text-right text-xs text-gray-500 font-medium mt-1">
            {remainingDays < 0 ? 'Done' : `D-${remainingDays}`}
          </div>
        </div>

        <Button
          variant="cmoutline"
          className="w-full"
          onClick={() => router.push(`/projects/${projectId}/newsprint`)}
        >
          스프린트 재구성
        </Button>
      </CardContent>
    </Card>
  )
}
