'use client'

import { Sprint } from '@cm/types/sprint'
import { Button } from '@cm/ui/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@cm/ui/components/ui/card'
import { Progress } from '@cm/ui/components/ui/progress'
import { Skeleton } from '@cm/ui/components/ui/skeleton'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface SprintPeriodCardProps {
  sprints: Sprint[]
  loading?: boolean
  projectId: string
}

export default function SprintPeriodCard({
  sprints,
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

  if (sprints.length === 0) {
    return (
      <Card className="col-span-2 gap-2">
        <CardHeader>
          <CardTitle>현재 스프린트</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 items-center">
          <p className="text-sm text-muted-foreground">
            진행 중인 스프린트가 없습니다.
          </p>
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

  const currentSprint = sprints.reduce((latest, current) => {
    return new Date(current.startDate) > new Date(latest.startDate)
      ? current
      : latest
  }, sprints[0])

  const start = new Date(currentSprint.startDate)
  const end = new Date(currentSprint.endDate)

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
        <CardTitle>{currentSprint.title}</CardTitle>
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
          <div className="flex flex-row mt-1 justify-between">
            <div className="text-xs text-muted-foreground">다음 Sprint까지</div>
            <div className="text-right text-xs text-gray-500 font-medium">
              {remainingDays < 0 ? 'Done' : `D-${remainingDays}`}
            </div>
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
