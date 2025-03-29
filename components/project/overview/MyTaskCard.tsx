'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Task {
  title: string
  date: string
  status: 'Completed' | 'On Progress'
}

interface MyTaskCardProps {
  tasks: Task[]
}

export default function MyTaskCard({ tasks }: MyTaskCardProps) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>My Task</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-40">
          {tasks.map((task, index) => (
            <div key={index} className="flex justify-between p-2 border-b">
              <div className="flex gap-2">
                <span className="font-semibold">{task.title}</span>
                <span className="text-xs text-gray-500">{task.date}</span>
              </div>
              <span
                className={`px-2 py-1 text-xs rounded ${
                  task.status === 'Completed'
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                }`}
              >
                {task.status}
              </span>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
