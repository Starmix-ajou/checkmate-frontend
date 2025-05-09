'use client'

// CalendarView는 SSR 문제 없으면 그대로 사용
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
import { CircleX, Search, SlidersHorizontal } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState } from 'react'

export default function TasksPage() {
  const { id } = useParams()
  const projectId = id as string
  const [searchText, setSearchText] = useState('')
  const [isToggled, setIsToggled] = useState(false)

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
                프로젝트 - {id}
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
            프로젝트 - {id}
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
        {isToggled ? <CalendarView /> : <KanbanView projectId={projectId} />}
      </div>
    </div>
  )
}
