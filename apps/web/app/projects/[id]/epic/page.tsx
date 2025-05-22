'use client'

import { Gantt } from '@/components/project/epic/gantt/gantt'
import { Epic } from '@/components/project/epic/types/epic'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuthStore } from '@/stores/useAuthStore'
import { Project } from '@/types/project'
import { ViewMode } from '@/types/public-types'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export default function ProjectEpic() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [project, setProject] = useState<Project | null>(null)
  const [epics, setEpics] = useState<Epic[]>([])
  const user = useAuthStore((state) => state.user)

  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Week)
  const [viewType, setViewType] = useState<'WEEK' | 'SPRINT'>('WEEK')

  useEffect(() => {
    if (!user?.accessToken || !id) return

    const fetchProjectDetails = async () => {
      try {
        // 프로젝트 상세 정보 가져오기
        const projectResponse = await fetch(`${API_BASE_URL}/project/${id}`, {
          headers: {
            Accept: '*/*',
            Authorization: `Bearer ${user?.accessToken}`,
          },
        })

        if (!projectResponse.ok) {
          throw new Error('프로젝트 상세 정보 불러오기 실패')
        }

        const projectData = await projectResponse.json()
        setProject(projectData)

        // 에픽 목록 가져오기
        const epicsResponse = await fetch(
          `${API_BASE_URL}/epic?projectId=${id}`,
          {
            headers: {
              Accept: '*/*',
              Authorization: `Bearer ${user?.accessToken}`,
            },
          }
        )

        if (!epicsResponse.ok) {
          throw new Error('에픽 목록 불러오기 실패')
        }

        const epicsData = await epicsResponse.json()
        setEpics(epicsData)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjectDetails()
  }, [id, user?.accessToken])

  const projectTitle = project?.title || '프로젝트'

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/projects">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/projects/${id}/overview`}>
                {loading ? (
                  <Skeleton className="h-4 w-[100px]" />
                ) : (
                  projectTitle
                )}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Epic</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex justify-between items-top mt-2">
          <h1 className="text-3xl font-bold gap-4 text-black-01">
            {loading ? <Skeleton className="h-8 w-[200px]" /> : projectTitle}
          </h1>
        </div>

        <div className="">
          <div className="flex gap-2">
            <button
              className={`text-base font-medium mr-2 px-2 py-3.5 border-b-2 transition ${
                viewMode === ViewMode.Week && viewType === 'WEEK'
                  ? 'text-cm-900 border-cm-900'
                  : 'text-cm-100 border-transparent'
              }`}
              onClick={() => {
                setViewMode(ViewMode.Week)
                setViewType('WEEK')
              }}
            >
              Week
            </button>
            <button
              className={`text-base font-medium px-2 py-3.5 border-b-2 transition ${
                viewMode === ViewMode.Day
                  ? 'text-cm-900 border-cm-900'
                  : 'text-cm-100 border-transparent'
              }`}
              onClick={() => {
                setViewMode(ViewMode.Day)
                setViewType('WEEK')
              }}
            >
              Day
            </button>
            <button
              className={`text-base font-medium mr-2 px-2 py-3.5 border-b-2 transition ${
                viewMode === ViewMode.Week && viewType === 'SPRINT'
                  ? 'text-cm-900 border-cm-900'
                  : 'text-cm-100 border-transparent'
              }`}
              onClick={() => {
                setViewMode(ViewMode.Week)
                setViewType('SPRINT')
              }}
            >
              Sprint
            </button>
          </div>
        </div>

        <div className="bg-white p-6">
          {loading ? (
            <Skeleton className="h-[600px] w-full" />
          ) : (
            <Gantt epics={epics} viewMode={viewMode} />
          )}
        </div>
      </div>
    </div>
  )
}
