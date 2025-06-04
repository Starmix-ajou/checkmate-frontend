'use client'

import { ProjectStatistics, getProjectStatistics } from '@/lib/api/project'
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
import { Skeleton } from '@cm/ui/components/ui/skeleton'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import BurndownChartCard from './BurndownChart'
import ProgressCharts from './ProgressCharts'
import TaskStatusChart from './TaskStatusChart'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export default function ProjectOverview() {
  const { id } = useParams()
  const user = useAuthStore((state) => state.user)
  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [statistics, setStatistics] = useState<ProjectStatistics | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user?.accessToken || !id) return

    const fetchData = async () => {
      setLoading(true)
      try {
        const [projectResponse, tasksResponse, statisticsResponse] =
          await Promise.all([
            fetch(`${API_BASE_URL}/project/${id}`, {
              headers: {
                Accept: '*/*',
                Authorization: `Bearer ${user?.accessToken}`,
              },
            }),
            getProjectTasks(id as string, user.accessToken),
            getProjectStatistics(id as string, user.accessToken),
          ])

        if (!projectResponse.ok) {
          throw new Error('프로젝트 상세 정보 불러오기 실패')
        }

        const projectData = await projectResponse.json()
        setProject(projectData)
        setTasks(tasksResponse)
        setStatistics(statisticsResponse)
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
            <BurndownChartCard tasks={tasks} />
            {statistics && (
              <>
                <TaskStatusChart statistics={statistics} />
                <ProgressCharts statistics={statistics} />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
