'use client'

import CalendarView from '@/components/project/task/CalendarView'
import KanbanView from '@/components/project/task/KanbanView'
import TaskFilter from '@/components/project/task/TaskFilter'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { Task } from '@/types/userTask'
import { CircleX, Search } from 'lucide-react'
import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

type FilterOption = {
  priority: Task['priority'] | 'ALL'
  epicId: string
  sprintId: string
  assigneeEmails: string[]
}

export default function TasksPage() {
  const { id } = useParams()
  const searchParams = useSearchParams()
  const projectId = id as string
  const [searchText, setSearchText] = useState('')
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isToggled, setIsToggled] = useState(
    searchParams.get('view') === 'calendar'
  )
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterOption>({
    priority: 'ALL',
    epicId: '',
    sprintId: '',
    assigneeEmails: [],
  })
  const [sprints, setSprints] = useState<
    {
      sprintId: string
      title: string
      description: string
      sequence: number
      projectId: string
      startDate: string
      endDate: string
    }[]
  >([])
  const user = useAuthStore((state) => state.user)

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

        // 프로젝트 데이터에 에픽 목록 추가
        setProject((prev) => (prev ? { ...prev, epics: epicsData } : null))

        // 스프린트 목록 가져오기
        const sprintsResponse = await fetch(
          `${API_BASE_URL}/sprint?projectId=${id}`,
          {
            headers: {
              Accept: '*/*',
              Authorization: `Bearer ${user?.accessToken}`,
            },
          }
        )

        if (!sprintsResponse.ok) {
          throw new Error('스프린트 목록 불러오기 실패')
        }

        const sprintsData = await sprintsResponse.json()
        setSprints(sprintsData)
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

        <div className="flex justify-between items-top mt-2">
          <h1 className="text-3xl font-bold gap-4 text-black-01">
            {loading ? <Skeleton className="h-8 w-[200px]" /> : projectTitle}
          </h1>
          {!loading && project && (
            <div className="flex items-center gap-2">
              {project.members.map((member) => (
                <button
                  key={member.userId}
                  onClick={() => {
                    setFilters((prev) => ({
                      ...prev,
                      assigneeEmails: prev.assigneeEmails.includes(member.email)
                        ? prev.assigneeEmails.filter(
                            (email) => email !== member.email
                          )
                        : [...prev.assigneeEmails, member.email],
                    }))
                  }}
                  className="flex flex-col items-center gap-1"
                >
                  <Avatar
                    className={`w-10 h-10 transition-all ${
                      filters.assigneeEmails.includes(member.email)
                        ? 'ring-2 ring-cm'
                        : 'opacity-50 hover:opacity-100'
                    }`}
                  >
                    <AvatarImage
                      src={member.profileImageUrl}
                      alt={member.name}
                    />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-center">{member.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center mb-6">
          <div className="gap-8 flex-1">
            <button
              className={`text-base font-medium mr-2 px-2 py-3.5 border-b-2 transition ${
                isToggled
                  ? 'text-cm-100 border-transparent'
                  : 'text-cm-900 border-cm-900'
              }`}
              onClick={() => setIsToggled(false)}
            >
              칸반보드
            </button>
            <button
              className={`text-base font-medium px-2 py-3.5 border-b-2 transition ${
                isToggled
                  ? 'text-cm-900 border-cm-900'
                  : 'text-cm-100 border-transparent'
              }`}
              onClick={() => setIsToggled(true)}
            >
              캘린더
            </button>
          </div>

          <div className="flex flex-row justify-end h-[36px]">
            <TaskFilter
              epics={project?.epics || []}
              sprints={sprints}
              onFilterChange={(newFilters) => {
                const combinedFilters = {
                  ...filters,
                  ...newFilters,
                  assigneeEmails: Array.from(
                    new Set([
                      ...filters.assigneeEmails,
                      ...newFilters.assigneeEmails,
                    ])
                  ),
                }

                setFilters(combinedFilters)
              }}
            />

            <div className="flex items-center relative ml-3">
              <div
                className={`flex items-center transition-all duration-300 ease-in-out ${
                  isSearchExpanded || searchText ? 'w-64' : 'w-10'
                } ${isSearchFocused ? 'w-64' : ''} bg-[#F7F7F7] rounded-full`}
                onMouseEnter={() =>
                  !isSearchExpanded && !searchText && setIsSearchFocused(true)
                }
                onMouseLeave={() =>
                  !isSearchExpanded && !searchText && setIsSearchFocused(false)
                }
              >
                <button
                  onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                  className="p-2"
                >
                  <Search size={24} className="text-gray-01 shrink-0" />
                </button>
                <input
                  type="text"
                  className={`outline-none text-black-01 text-base font-medium placeholder-gray-01 placeholder-base transition-all duration-300 ease-in-out ${
                    isSearchExpanded || isSearchFocused ? 'w-full px-3' : 'w-0'
                  }`}
                  placeholder="검색"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                {searchText && (
                  <CircleX
                    size={16}
                    className="text-gray-01 cursor-pointer shrink-0 absolute right-3"
                    onClick={() => setSearchText('')}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Task View */}
        {isToggled ? (
          <CalendarView
            projectId={projectId}
            searchText={searchText}
            filters={filters}
            members={project?.members || []}
          />
        ) : (
          <KanbanView
            projectId={projectId}
            members={project?.members || []}
            searchText={searchText}
            filters={filters}
          />
        )}
      </div>
    </div>
  )
}
