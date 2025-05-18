'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface Task {
  title: string
  date: string
  status: 'Completed' | 'On Progress'
}

interface MyTaskCardProps {
  tasks: Task[]
  projectId: string
}

export default function MyTaskCard({ tasks, projectId }: MyTaskCardProps) {
  return (
    <Card className="col-span-2 row-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>내 작업</CardTitle>
        <Link
          href={`/projects/${projectId}/task`}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
        >
          더보기 <ChevronRight className="h-4 w-4" />
        </Link>
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
