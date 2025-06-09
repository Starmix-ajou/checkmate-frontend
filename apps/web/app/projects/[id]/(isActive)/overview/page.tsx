'use client'

import MyTaskCard from '@/components/project/overview/MyTaskCard'
import ProjectHeader from '@/components/project/overview/ProjectHeader'
import ScheduleCard from '@/components/project/overview/ScheduleCard'
import SprintPeriodCard from '@/components/project/overview/SprintPeriodCard'
import DailyScrumCard from '@/components/project/overview/daily-scrum/DailyScrumCard'
import { useAuthStore } from '@/stores/useAuthStore'
import { getSprints } from '@cm/api/sprint'
import { Project } from '@cm/types/project'
import { Sprint } from '@cm/types/sprint'
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '@cm/ui/components/ui/dialog'
import { Skeleton } from '@cm/ui/components/ui/skeleton'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export default function ProjectOverview() {
  const { id } = useParams()
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const [project, setProject] = useState<Project | null>(null)
  const [sprints, setSprints] = useState<Sprint[]>([])
  const [loading, setLoading] = useState(true)
  const [showSprintDialog, setShowSprintDialog] = useState(false)

  const fetchProjectAndSprintDetails = async () => {
    if (!user?.accessToken) return

    try {
      const [projectResponse, sprintResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/project/${id}`, {
          headers: {
            Accept: '*/*',
            Authorization: `Bearer ${user.accessToken}`,
          },
        }),
        getSprints(id as string, user.accessToken),
      ])

      if (!projectResponse.ok) {
        throw new Error('프로젝트 상세 정보 불러오기 실패')
      }

      const projectData = await projectResponse.json()
      setProject(projectData)
      setSprints(sprintResponse.sprints)

      if (sprintResponse.sprints.length === 0) {
        setShowSprintDialog(true)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user?.accessToken || !id) return
    fetchProjectAndSprintDetails()
  }, [id, user?.accessToken])

  const handleMembersUpdate = () => {
    fetchProjectAndSprintDetails()
  }

  const handleSprintReconfigure = () => {
    router.push(`/projects/${id}/newsprint`)
  }

  return (
    <>
      <LoadingScreen size={64} loading={loading} />
      <Dialog open={showSprintDialog} onOpenChange={setShowSprintDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>스프린트 구성이 필요합니다</DialogTitle>
            <DialogDescription>
              현재 프로젝트에 구성된 스프린트가 없습니다. 스프린트 재구성
              페이지로 이동하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>
              <Button variant="cmoutline">나중에</Button>
            </DialogClose>
            <Button variant="cm" onClick={handleSprintReconfigure}>
              스프린트 구성
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
            </BreadcrumbList>
          </Breadcrumb>

          <ProjectHeader
            project={project}
            loading={loading}
            onMembersUpdate={handleMembersUpdate}
          />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <DailyScrumCard projectId={id as string} />
            <SprintPeriodCard
              sprints={sprints}
              loading={loading}
              projectId={id as string}
            />
            <MyTaskCard projectId={id as string} />
            <ScheduleCard projectId={id as string} />
          </div>
        </div>
      </div>
    </>
  )
}
