'use client'

import MeetingNotesAdd from '@/components/project/meeting-notes/MeetingNotesAdd'
import MeetingNotesList from '@/components/project/meeting-notes/MeetingNotesList'
import { useAuthStore } from '@/stores/useAuthStore'
import { getMeetings } from '@cm/api/meetingNotes'
import { Meeting } from '@cm/types/meeting'
import { Project } from '@cm/types/project'
import LoadingScreen from '@cm/ui/components/common/LoadingScreen'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@cm/ui/components/ui/breadcrumb'
import { Button } from '@cm/ui/components/ui/button'
import { Skeleton } from '@cm/ui/components/ui/skeleton'
import { CircleX, SearchIcon, SlidersHorizontalIcon } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export default function MeetingNotesPage() {
  const { id } = useParams()
  const user = useAuthStore((state) => state.user)
  const [searchText, setSearchText] = useState('')
  const [project, setProject] = useState<Project | null>(null)
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.accessToken || !id) {
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        const [projectResponse, meetingsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/project/${id}`, {
            headers: {
              Accept: '*/*',
              Authorization: `Bearer ${user.accessToken}`,
            },
          }),
          getMeetings(user.accessToken, id as string),
        ])

        if (!projectResponse.ok) {
          throw new Error('프로젝트 상세 정보 불러오기 실패')
        }

        const projectData = await projectResponse.json()
        setProject(projectData)
        setMeetings(meetingsResponse)
      } catch (error) {
        console.error('데이터 로딩 중 오류 발생:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, user?.accessToken])

  return (
    <>
      <LoadingScreen loading={loading} />
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
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Meeting Notes</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex justify-between items-center mt-2 mb-4">
            {loading ? (
              <>
                <Skeleton className="h-8 w-[200px]" />
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold">{project?.title}</h1>
              </>
            )}
          </div>

          <div className="flex items-center justify-between gap-4 mb-6">
            <MeetingNotesAdd />
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                className="flex items-center justify-center w-8 h-8"
              >
                <SlidersHorizontalIcon />
              </Button>
              <div
                className={`flex items-center transition-all duration-300 ease-in-out bg-[#F7F7F7] rounded-full`}
              >
                <button className="p-2">
                  <SearchIcon />
                </button>
                <input
                  type="text"
                  className={`outline-none text-black-01 text-base font-medium placeholder-gray-01 placeholder-base transition-all duration-300 ease-in-out`}
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

          <MeetingNotesList meetings={meetings} projectId={id as string} />
        </div>
      </div>
    </>
  )
}
