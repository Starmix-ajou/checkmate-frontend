'use client'

import LoadingCheckMate from '@/components/LoadingCheckMate'
import MeetingNotesAdd from '@/components/project/meeting-notes/MeetingNotesAdd'
import MeetingNotesList from '@/components/project/meeting-notes/MeetingNotesList'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuthStore } from '@/stores/useAuthStore'
import { Project } from '@/types/project'
import { CircleX, Search, SlidersHorizontal } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

const mockMeetings = [
  {
    id: '1',
    title: '첫 번째 스프린트 회의',
    scrumMaster: '김평주',
    createdAt: '2024-03-20',
  },
  {
    id: '2',
    title: '두 번째 스프린트 회의',
    scrumMaster: '한도연',
    createdAt: '2024-03-21',
  },
  {
    id: '3',
    title: '세 번째 스프린트 회의',
    scrumMaster: '조성연',
    createdAt: '2024-03-22',
  },
  {
    id: '4',
    title: '네 번째 스프린트 회의',
    scrumMaster: '박승연',
    createdAt: '2024-03-23',
  },
]

export default function MeetingNotesPage() {
  const { id } = useParams()
  const user = useAuthStore((state) => state.user)
  const [searchText, setSearchText] = useState('')
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
      <LoadingCheckMate loading={loading} />
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

          {/* 필터 & 검색 & 추가 버튼 */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="default"
              className="bg-black text-white flex items-center gap-2 rounded-3xl"
            >
              <SlidersHorizontal size={20} />
              Filter
            </Button>

            <div className="flex items-center border-2 border-black rounded-lg px-3 py-2 w-80">
              <Search size={16} className="text-black" />
              <input
                type="text"
                className="flex-1 bg-transparent outline-none px-2 text-black"
                placeholder="Search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              {searchText && (
                <CircleX
                  size={16}
                  className="text-black cursor-pointer"
                  onClick={() => setSearchText('')}
                />
              )}
            </div>

            {/* 회의록 추가 버튼 */}
            <MeetingNotesAdd />
          </div>

          <MeetingNotesList meetings={mockMeetings} projectId={id as string} />
        </div>
      </div>
    </>
  )
}
