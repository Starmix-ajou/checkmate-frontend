'use client'

import DeleteEpicModal from '@/components/project/epic/DeleteEpicModal'
import NewEpicModal from '@/components/project/epic/NewEpicModal'
import { Gantt } from '@/components/project/epic/gantt/gantt'
import { useAuthStore } from '@/stores/useAuthStore'
import { Epic } from '@cm/types/epic'
import { Project } from '@cm/types/project'
import { ViewMode } from '@cm/types/public-types'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@cm/ui/components/ui/breadcrumb'
import { Button } from '@cm/ui/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@cm/ui/components/ui/dropdown-menu'
import { Skeleton } from '@cm/ui/components/ui/skeleton'
import { ChevronDown, PlusIcon, Trash2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export default function ProjectEpic() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [project, setProject] = useState<Project | null>(null)
  const [epics, setEpics] = useState<Epic[]>([])
  const [filteredEpics, setFilteredEpics] = useState<Epic[]>([])
  const [isCreateEpicDialogOpen, setIsCreateEpicDialogOpen] = useState(false)
  const [isDeleteEpicDialogOpen, setIsDeleteEpicDialogOpen] = useState(false)
  const [isSprintDropdownOpen, setIsSprintDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const user = useAuthStore((state) => state.user)

  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Week)
  const [viewType, setViewType] = useState<'EPIC' | 'SPRINT'>('EPIC')
  const [selectedSprint, setSelectedSprint] = useState<string | null>(null)
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

  useEffect(() => {
    if (!user?.accessToken || !id) return

    const fetchProjectDetails = async () => {
      try {
        setLoading(true)
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
        // API 응답을 Epic 타입에 맞게 변환
        const transformedEpics = epicsData.map((epic: any) => ({
          epicId: epic.epicId,
          title: epic.title,
          description: epic.description,
          startDate: epic.startDate || new Date().toISOString(),
          endDate: epic.endDate || new Date().toISOString(),
          sprint: epic.sprint || null,
          tasks: epic.tasks || [],
        }))
        setEpics(transformedEpics)
        setFilteredEpics(transformedEpics)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjectDetails()
  }, [id, user?.accessToken])

  // 스프린트 목록 가져오기
  useEffect(() => {
    if (!user?.accessToken || !id) return

    const fetchSprints = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/sprint?projectId=${id}`, {
          headers: {
            Accept: '*/*',
            Authorization: `Bearer ${user?.accessToken}`,
          },
        })

        if (!response.ok) {
          throw new Error('스프린트 목록 불러오기 실패')
        }

        const sprintsData = await response.json()
        setSprints(sprintsData)
      } catch (error) {
        console.error(error)
      }
    }

    fetchSprints()
  }, [id, user?.accessToken])

  // 선택된 스프린트가 변경될 때 에픽 목록 필터링
  useEffect(() => {
    if (!epics.length) return

    const filtered = selectedSprint
      ? epics.filter((epic) => epic.sprint?.sprintId === selectedSprint)
      : epics

    setFilteredEpics(filtered)
  }, [selectedSprint, epics])

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsSprintDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

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
          <div className="flex gap-2 items-center">
            <button
              className={`text-base font-medium mr-2 px-2 py-3.5 border-b-2 transition ${
                viewMode === ViewMode.Week && viewType === 'EPIC'
                  ? 'text-cm-900 border-cm-900'
                  : 'text-cm-100 border-transparent'
              }`}
              onClick={() => {
                setViewMode(ViewMode.Week)
                setViewType('EPIC')
              }}
            >
              Epic
            </button>
            <button
              className={`text-base font-medium px-2 py-3.5 border-b-2 transition ${
                viewMode === ViewMode.Day
                  ? 'text-cm-900 border-cm-900'
                  : 'text-cm-100 border-transparent'
              }`}
              onClick={() => {
                setViewMode(ViewMode.Day)
                setViewType('EPIC')
              }}
            >
              Day
            </button>
            <div className="flex items-center">
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
              {viewMode === ViewMode.Week && viewType === 'SPRINT' && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 hover:bg-gray-100 rounded-sm">
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedSprint(null)
                        setViewMode(ViewMode.Week)
                        setViewType('SPRINT')
                      }}
                      className="text-cm hover:text-cm-900"
                    >
                      ALL
                    </DropdownMenuItem>
                    {sprints.map((sprint) => (
                      <DropdownMenuItem
                        key={sprint.sprintId}
                        onClick={() => {
                          setSelectedSprint(sprint.sprintId)
                          setViewMode(ViewMode.Week)
                          setViewType('SPRINT')
                        }}
                      >
                        {sprint.title}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            <Button
              variant="secondary"
              className="ml-auto mr-3 flex items-center"
              onClick={() => setIsCreateEpicDialogOpen(true)}
            >
              <PlusIcon className="w-4 h-4" />새 에픽 생성
            </Button>
            <Button
              variant="destructive"
              className="flex items-center mr-16"
              onClick={() => setIsDeleteEpicDialogOpen(true)}
            >
              <Trash2 className="w-4 h-4" />
              에픽 삭제
            </Button>
          </div>
        </div>

        <div className="mt-4">
          {loading ? (
            <Skeleton className="h-[600px] w-full" />
          ) : (
            <Gantt
              epics={filteredEpics}
              viewMode={viewMode}
              columnWidth={viewMode === ViewMode.Day ? 40 : 60}
            />
          )}
        </div>

        <NewEpicModal
          isOpen={isCreateEpicDialogOpen}
          onClose={() => setIsCreateEpicDialogOpen(false)}
          projectId={id as string}
          onSuccess={() => {
            // 에픽 목록 새로고침
            const fetchEpics = async () => {
              if (!user?.accessToken || !id) return
              try {
                const response = await fetch(
                  `${API_BASE_URL}/epic?projectId=${id}`,
                  {
                    headers: {
                      Accept: '*/*',
                      Authorization: `Bearer ${user?.accessToken}`,
                    },
                  }
                )
                if (!response.ok) {
                  throw new Error('에픽 목록 불러오기 실패')
                }
                const data = await response.json()
                setEpics(data)
              } catch (error) {
                console.error(error)
              }
            }
            fetchEpics()
          }}
        />
        <DeleteEpicModal
          isOpen={isDeleteEpicDialogOpen}
          onClose={() => setIsDeleteEpicDialogOpen(false)}
          projectId={id as string}
          onDelete={() => {
            // 에픽 목록 새로고침
            const fetchEpics = async () => {
              if (!user?.accessToken || !id) return
              try {
                const response = await fetch(
                  `${API_BASE_URL}/epic?projectId=${id}`,
                  {
                    headers: {
                      Accept: '*/*',
                      Authorization: `Bearer ${user?.accessToken}`,
                    },
                  }
                )
                if (!response.ok) {
                  throw new Error('에픽 목록 불러오기 실패')
                }
                const data = await response.json()
                setEpics(data)
              } catch (error) {
                console.error(error)
              }
            }
            fetchEpics()
          }}
        />
      </div>
    </div>
  )
}
