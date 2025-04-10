'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
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

import KanbanView from '@/components/project/task/KanbanView'
import CalendarView from '@/components/project/task/CalendarView'

export default function TasksPage() {
  const { id } = useParams()
  const [searchText, setSearchText] = useState('')
  const [isToggled, setIsToggled] = useState(false)

  return (
    <div className="min-h-screen w-full px-4 sm:px-8">
      <div className="mx-auto w-full max-w-[1600px] py-6">
        {/* Breadcrumb */}
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

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">프로젝트 - {id}</h1>
        </div>

        {/* Filter & Search */}
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
