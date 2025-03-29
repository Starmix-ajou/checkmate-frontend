'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ScheduleItem {
  title: string
  time: string
}

interface ScheduleCardProps {
  schedules: ScheduleItem[]
}

export default function ScheduleCard({ schedules }: ScheduleCardProps) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Schedule</CardTitle>
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
