'use client'

import LoadingCheckMate from '@/components/LoadingCheckMate'
import MyTaskCard from '@/components/project/overview/MyTaskCard'
import ProjectHeader from '@/components/project/overview/ProjectHeader'
import ScheduleCard from '@/components/project/overview/ScheduleCard'
import SprintPeriodCard from '@/components/project/overview/SprintPeriodCard'
import DailyScrumCard from '@/components/project/overview/daily-scrum/DailyScrumCard'
import { useAuthStore } from '@/stores/useAuthStore'
import { Project } from '@/types/project'
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export default function ProjectOverview() {
  const { id } = useParams()
  const user = useAuthStore((state) => state.user)
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.accessToken || !id) return

    const fetchProjectDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/project/${id}`, {
          headers: {
            Accept: '*/*',
            Authorization: `Bearer ${user?.accessToken}`,
          },
        })

        if (!response.ok) {
          throw new Error('프로젝트 상세 정보 불러오기 실패')
        }

        const data = await response.json()
        setProject(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjectDetails()
  }, [id, user?.accessToken])

  return (
    <>
      <LoadingCheckMate size={64} loading={loading} />
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
            <DailyScrumCard projectId={id as string} />
            <SprintPeriodCard
              startDate={project?.startDate || ''}
              endDate={project?.endDate || ''}
              loading={loading}
              projectId={id as string}
            />
            <MyTaskCard projectId={id as string} />
            <ScheduleCard projectId={id as string} />
          </div>
        </div>
      </div>
    </>
  )
}
