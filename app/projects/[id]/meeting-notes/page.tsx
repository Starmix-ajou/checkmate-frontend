'use client'

import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { SlidersHorizontal, Search, CircleX } from 'lucide-react'
import { useState } from 'react'
import MeetingNotes from '@/components/project/meeting-notes/MeetingNotes'

export default function MeetingNotesPage() {
  const { id } = useParams()
  const [searchText, setSearchText] = useState('')

  return (
    <div className="flex min-h-screen w-full">
      <div className="flex-1 p-6">
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
              <BreadcrumbPage>Meeting Notes</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">프로젝트 - {id}</h1>
        </div>

        {/* 필터 & 검색 */}
        <div className="flex items-center gap-4">
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
        </div>

        {/* 회의록 카드 (갤러리) */}
        <MeetingNotes />
      </div>
    </div>
  )
}
