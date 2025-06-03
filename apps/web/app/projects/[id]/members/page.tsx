'use client'

import MembersList from '@/components/project/members/MembersList'
import { useAuthStore } from '@/stores/useAuthStore'
import { ProjectBrief } from '@cm/types/project'
import { getProjectBrief } from '@cm/api/project'
import LoadingScreen from '@cm/ui/components/common/LoadingScreen'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@cm/ui/components/ui/breadcrumb'
import { Skeleton } from '@cm/ui/components/ui/skeleton'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function MembersPage() {
  const { id } = useParams()
  const user = useAuthStore((state) => state.user)
  const [projectBrief, setProjectBrief] = useState<ProjectBrief | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.accessToken || !id) return

    const fetchProjectBrief = async () => {
      try {
        const briefData = await getProjectBrief(id as string, user.accessToken)
        setProjectBrief(briefData)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjectBrief()
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
                  <BreadcrumbLink href={`/projects/${id}/overview`}>
                    {projectBrief?.title}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Members</BreadcrumbPage>
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
                <h1 className="text-3xl font-bold">{projectBrief?.title}</h1>
              </>
            )}
          </div>
          <MembersList projectId={id as string} />
        </div>
      </div>
    </>
  )
}
