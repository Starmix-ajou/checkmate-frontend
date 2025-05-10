'use client'

import CalendarView from '@/components/project/task/CalendarView'
import KanbanView from '@/components/project/task/KanbanView'
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
import { CircleX, Search, SlidersHorizontal } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export default function TasksPage() {
  const { id } = useParams()
  const projectId = id as string
  const [searchText, setSearchText] = useState('')
  const [isToggled, setIsToggled] = useState(false)
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const user = useAuthStore((state) => state.user)

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
              <BreadcrumbPage>Task</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex justify-between items-center mb-3 mt-2">
          <h1 className="text-3xl font-bold gap-4 text-black-01">
            {loading ? <Skeleton className="h-8 w-[200px]" /> : projectTitle}
          </h1>
        </div>

        <div className="flex items-center mb-6">
          <div className="gap-8 flex-1">
            <button
              className={`text-base font-medium mr-2 px-2 py-3.5 border-b-2 transition ${
                isToggled
                  ? 'text-gray-01 border-transparent'
                  : 'text-black-01 border-black-01'
              }`}
              onClick={() => setIsToggled(false)}
            >
              칸반보드
            </button>
            <button
              className={`text-base font-medium px-2 py-3.5 border-b-2 transition ${
                isToggled
                  ? 'text-black-01 border-black-01'
                  : 'text-gray-01 border-transparent'
              }`}
              onClick={() => setIsToggled(true)}
            >
              캘린더
            </button>
          </div>

          <div className="flex flex-row justify-end h-[36px]">
            <div className="py-1.5 cursor-pointer mr-3 flex items-center">
              <SlidersHorizontal
                size={20}
                className="text-gray-01 transition-colors hover:text-black-01 focus:text-black-01 active:text-black-01"
              />
            </div>

            <div className="flex items-center border-1 border-[#F7F7F7] bg-[#F7F7F7] rounded-full px-3 py-2 w-64 relative">
              <Search size={24} className="text-gray-01 shrink-0 mr-2" />
              <input
                type="text"
                className="outline-none text-black-01 text-base font-medium placeholder-gray-01 placeholder-base w-full pr-8" // w-full과 pr-8을 추가해줍니다
                placeholder="검색"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              {searchText && (
                <CircleX
                  size={16}
                  className="text-gray-01 cursor-pointer shrink-0 absolute right-3" // absolute와 right-3을 추가하여 CircleX를 input의 오른쪽 끝에 위치시킵니다
                  onClick={() => setSearchText('')}
                />
              )}
            </div>
          </div>
        </div>

        {/* Task View */}
        {isToggled ? (
          <CalendarView />
        ) : (
          <KanbanView projectId={projectId} members={project?.members || []} />
        )}
      </div>
    </div>
  )
}
