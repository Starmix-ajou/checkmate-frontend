'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

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
  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>스케줄</CardTitle>
        <Link
          href={`/projects/${projectId}/task?view=calendar`}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
        >
          더보기 <ChevronRight className="h-4 w-4" />
        </Link>
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
