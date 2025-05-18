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

interface StatusCircleProps {
  label: string
  bgColor: string
  count?: number
  textColor: string
}

function StatusCircle({ label, bgColor, count, textColor }: StatusCircleProps) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-xs mb-2">{label}</span>
      <div
        className={`w-[52px] h-[52px] rounded-full ${bgColor} flex items-center justify-center`}
      >
        <span className={`text-base px-3 py-2 font-medium ${textColor}`}>
          {count}
        </span>
      </div>
    </div>
  )
}

export default function MyTaskCard({ tasks, projectId }: MyTaskCardProps) {
  const todoCount = 5
  const inProgressCount = 3
  const doneCount = 2
  const totalCount = todoCount + inProgressCount + doneCount

  return (
    <Card className="col-span-2 row-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>내 작업</CardTitle>
        <Link
          href={`/projects/${projectId}/task`}
          className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
        >
          더보기 <ChevronRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <div className="flex justify-center gap-3 px-6">
        <StatusCircle
          label="Total"
          bgColor="bg-cm-light"
          count={totalCount}
          textColor="text-cm-900"
        />
        <StatusCircle
          label="To Do"
          bgColor="bg-cm-gray-light"
          count={todoCount}
          textColor="text-cm-gray"
        />
        <StatusCircle
          label="In Progress"
          bgColor="bg-[#F3F9FC]"
          count={inProgressCount}
          textColor="text-[#5093BC]"
        />
        <StatusCircle
          label="Done"
          bgColor="bg-cm-green-light"
          count={doneCount}
          textColor="text-[#5C9771]"
        />
      </div>
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
