'use client'

import { useAuthStore } from '@/stores/useAuthStore'
import { getProjectTasks } from '@cm/api/task'
import { Project } from '@cm/types/project'
import { Task } from '@cm/types/project'
import LoadingScreen from '@cm/ui/components/common/LoadingScreen'
import ProjectHeader from '@cm/ui/components/project/ProjectHeader'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@cm/ui/components/ui/breadcrumb'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@cm/ui/components/ui/card'
import { Skeleton } from '@cm/ui/components/ui/skeleton'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

const exampleBurndownData = [
  { date: '2025-05-30', remaining: 10, ideal: 10 },
  { date: '2025-05-31', remaining: 9, ideal: 8 },
  { date: '2025-06-01', remaining: 7, ideal: 6 },
  { date: '2025-06-02', remaining: 5, ideal: 4 },
  { date: '2025-06-03', remaining: 3, ideal: 2 },
  { date: '2025-06-04', remaining: 0, ideal: 0 },
]

const calculateBurndownData = (tasks: Task[]) => {
  const sprintDates = tasks
    .filter((task) => task.epic?.sprint)
    .map((task) => ({
      startDate: new Date(task.epic.sprint.startDate),
      endDate: new Date(task.epic.sprint.endDate),
    }))
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())

  if (sprintDates.length === 0) {
    return []
  }

  const startDate = sprintDates[0].startDate
  const endDate = sprintDates[sprintDates.length - 1].endDate
  const totalDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  )
  const totalTasks = tasks.length
  const idealBurndown = totalTasks / totalDays

  const dates: { [key: string]: { remaining: number; ideal: number } } = {}

  for (let i = 0; i <= totalDays; i++) {
    const currentDate = new Date(startDate)
    currentDate.setDate(startDate.getDate() + i)
    const dateStr = currentDate.toISOString().split('T')[0]
    dates[dateStr] = {
      remaining: totalTasks,
      ideal: Math.max(0, totalTasks - idealBurndown * i),
    }
  }

  tasks.forEach((task) => {
    if (task.status === 'DONE' && task.endDate) {
      const endDate = new Date(task.endDate).toISOString().split('T')[0]
      if (dates[endDate]) {
        dates[endDate].remaining--
      }
    }
  })

  let remainingTasks = totalTasks
  Object.keys(dates).forEach((date) => {
    if (dates[date].remaining !== totalTasks) {
      remainingTasks = dates[date].remaining
    }
    dates[date].remaining = remainingTasks
  })

  return Object.entries(dates).map(([date, data]) => ({
    date,
    remaining: data.remaining,
    ideal: Math.round(data.ideal * 100) / 100,
  }))
}

export default function ProjectOverview() {
  const { id } = useParams()
  const user = useAuthStore((state) => state.user)
  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [burndownData, setBurndownData] = useState<typeof exampleBurndownData>(
    []
  )

  useEffect(() => {
    if (!user?.accessToken || !id) return

    const fetchData = async () => {
      setLoading(true)
      try {
        const [projectResponse, tasksResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/project/${id}`, {
            headers: {
              Accept: '*/*',
              Authorization: `Bearer ${user?.accessToken}`,
            },
          }),
          getProjectTasks(id as string, user.accessToken),
        ])

        if (!projectResponse.ok) {
          throw new Error('프로젝트 상세 정보 불러오기 실패')
        }

        const projectData = await projectResponse.json()
        setProject(projectData)
        setTasks(tasksResponse)

        // 번다운 데이터 계산
        const burndown = calculateBurndownData(tasksResponse)
        setBurndownData(burndown)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, user?.accessToken])

  return (
    <>
      <LoadingScreen size={64} loading={loading} />
      <div className="flex w-full">
        <div className="flex-1 p-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/projects">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {loading ? (
                  <Skeleton className="h-4 w-[100px]" />
                ) : (
                  <BreadcrumbPage>{project?.title}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <ProjectHeader project={project} loading={loading} />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Card className="col-span-2 row-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>번다운차트</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={burndownData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="remaining"
                      stroke="#8884d8"
                      name="남은 작업"
                    />
                    <Line
                      type="monotone"
                      dataKey="ideal"
                      stroke="#82ca9d"
                      strokeDasharray="5 5"
                      name="이상적인 진행"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
