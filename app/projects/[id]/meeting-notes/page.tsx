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
import { SlidersHorizontal } from 'lucide-react'

export default function MeetingNotes() {
  const { id } = useParams()

  return (
    <div className="flex min-h-screen w-full">
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
              <BreadcrumbPage>Meeting Notes</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">프로젝트 - {id}</h1>
        </div>
        <Button
          variant="default"
          className="bg-black text-white flex items-center gap-2 rounded-3xl"
        >
          <SlidersHorizontal size={20} />
          Filter
        </Button>
      </div>
    </div>
  )
}
