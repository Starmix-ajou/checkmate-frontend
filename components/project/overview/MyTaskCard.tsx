'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAuthStore } from '@/stores/useAuthStore'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Task {
  title: string
  endDate: string
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
}

interface TaskCount {
  count: number
  tasks: Task[]
}

interface TaskCountResponse {
  total: TaskCount
  todo: TaskCount
  inProgress: TaskCount
  done: TaskCount
}

interface MyTaskCardProps {
  projectId: string
}

interface StatusCircleProps {
  label: string
  bgColor: string
  count?: number
  textColor: string
  isSelected: boolean
  borderColor: string
  onClick: () => void
}

type StatusFilter = 'ALL' | 'TODO' | 'IN_PROGRESS' | 'DONE'

function StatusCircle({
  label,
  bgColor,
  count,
  textColor,
  isSelected,
  borderColor,
  onClick,
}: StatusCircleProps) {
  return (
    <div
      className="flex flex-col items-center cursor-pointer"
      onClick={onClick}
    >
      <span className="text-xs mb-2">{label}</span>
      <div
        className={`w-[52px] h-[52px] rounded-full ${bgColor} flex items-center justify-center ${
          isSelected ? `border-2 ${borderColor}` : ''
        }`}
      >
        <span className={`text-base px-3 py-2 font-medium ${textColor}`}>
          {count}
        </span>
      </div>
    </div>
  )
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${month}. ${day}`
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

export default function MyTaskCard({ projectId }: MyTaskCardProps) {
  const [taskCounts, setTaskCounts] = useState<TaskCountResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('ALL')
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    const fetchTaskCounts = async () => {
      if (!user?.accessToken) {
        console.log('인증 토큰이 없습니다.')
        setLoading(false)
        return
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/task/count?projectId=${projectId}`,
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

        const data: TaskCountResponse = await response.json()
        setTaskCounts(data)
      } catch (error) {
        console.error('태스크 카운트 조회 실패:', error)
        setError('태스크 정보를 불러오는데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchTaskCounts()
  }, [projectId, user?.accessToken])

  const getStatusPriority = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 0
      case 'TODO':
        return 1
      case 'DONE':
        return 2
      default:
        return 3
    }
  }

  const sortTasks = (tasks: Task[]) => {
    return [...tasks].sort((a, b) => {
      // 먼저 status 우선순위로 정렬
      const statusDiff =
        getStatusPriority(a.status) - getStatusPriority(b.status)
      if (statusDiff !== 0) return statusDiff

      // status가 같은 경우 마감일로 정렬
      const dateA = new Date(a.endDate)
      const dateB = new Date(b.endDate)
      return dateA.getTime() - dateB.getTime()
    })
  }

  const filteredTasks = taskCounts
    ? selectedStatus === 'ALL'
      ? sortTasks(taskCounts.total.tasks)
      : selectedStatus === 'TODO'
        ? sortTasks(taskCounts.todo.tasks)
        : selectedStatus === 'IN_PROGRESS'
          ? sortTasks(taskCounts.inProgress.tasks)
          : sortTasks(taskCounts.done.tasks)
    : []

  if (loading) {
    return <div>로딩 중...</div>
  }

  if (error) {
    return <div>에러: {error}</div>
  }

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
          count={taskCounts?.total.count || 0}
          textColor="text-cm-900"
          isSelected={selectedStatus === 'ALL'}
          borderColor="border-cm-900"
          onClick={() => setSelectedStatus('ALL')}
        />
        <StatusCircle
          label="To Do"
          bgColor="bg-cm-gray-light"
          count={taskCounts?.todo.count || 0}
          textColor="text-cm-gray"
          isSelected={selectedStatus === 'TODO'}
          borderColor="border-cm-gray"
          onClick={() => setSelectedStatus('TODO')}
        />
        <StatusCircle
          label="In Progress"
          bgColor="bg-[#F3F9FC]"
          count={taskCounts?.inProgress.count || 0}
          textColor="text-[#5093BC]"
          isSelected={selectedStatus === 'IN_PROGRESS'}
          borderColor="border-[#5093BC]"
          onClick={() => setSelectedStatus('IN_PROGRESS')}
        />
        <StatusCircle
          label="Done"
          bgColor="bg-cm-green-light"
          count={taskCounts?.done.count || 0}
          textColor="text-[#5C9771]"
          isSelected={selectedStatus === 'DONE'}
          borderColor="border-[#5C9771]"
          onClick={() => setSelectedStatus('DONE')}
        />
      </div>
      <CardContent>
        <ScrollArea className="h-40">
          <div className="flex justify-between px-4 py-1 border-b border-[#DCDCDC]">
            <span className="w-[60%] text-xs font-base text-gray-01 mr-3">
              작업
            </span>
            <span className="w-[20%] text-xs font-base text-gray-01 mr-3">
              마감일
            </span>
            <span className="w-[20%] text-xs font-base text-gray-01">상태</span>
          </div>
          {filteredTasks.map((task, index) => (
            <div key={index} className="flex justify-between p-2 border-b">
              <div className="w-[60%] mr-3">
                <span className="font-base text-[#0F0F0F] text-sm">
                  {task.title}
                </span>
              </div>
              <div className="w-[20%] mr-3">
                <span className="text-xs text-gray-500">
                  {formatDate(task.endDate)}
                </span>
              </div>
              <div className="w-[20%]">
                <span
                  className={`px-2 py-1 text-xs rounded-sm ${
                    task.status === 'DONE'
                      ? 'bg-cm-green-light text-[#5C9771]'
                      : task.status === 'IN_PROGRESS'
                        ? 'bg-[#F3F9FC] text-[#5093BC]'
                        : 'bg-m-gray-light text-cm-gray'
                  }`}
                >
                  {formatStatus(task.status)}
                </span>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
