'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  SlidersHorizontal,
  Search,
  CircleX,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react'

const KanbanView = dynamic(
  () => import('@/components/project/task/KanbanView'),
  {
    ssr: false,
  }
)

// CalendarView는 SSR 문제 없으면 그대로 사용
import CalendarView from '@/components/project/task/CalendarView'

export default function TasksPage() {
  const { id } = useParams()
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

        <div className="flex justify-between items-center mb-6 mt-3">
          <h1 className="text-3xl font-bold gap-4 text-MainBlack">
            프로젝트 - {id}
          </h1>
        </div>

        <div className="flex items-center gap-4 mb-4">
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

          {/* Toggle View */}
          <div className="ml-6">
            <button
              onClick={() => setIsToggled(!isToggled)}
              className="hover:opacity-80 transition"
            >
              {isToggled ? (
                <ToggleRight size={48} className="text-black" />
              ) : (
                <ToggleLeft size={48} className="text-black" />
              )}
            </button>
          </div>
        </div>

        {/* Task View */}
        {isToggled ? <CalendarView /> : <KanbanView />}
      </div>
    </div>
  )
}
