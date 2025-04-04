'use client'

import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import AvatarGroup from '@/components/project/overview/AvatarGroup'
import StatusCard from '@/components/project/overview/StatusCard'
import MyTaskCard from '@/components/project/overview/MyTaskCard'
import ScheduleCard from '@/components/project/overview/ScheduleCard'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import DailyScrumCard from '@/components/project/overview/DailyScrumCard'
import SprintPeriodCard from '@/components/project/overview/SprintPeriodCard'

export default function ProjectOverview() {
  const { id } = useParams()

  const teamMembers = [
    { name: '조성연', src: '/avatar1.png' },
    { name: '김평주', src: '/avatar2.png' },
    { name: '한도연', src: '/avatar3.png' },
    { name: '박승연', src: '/avatar4.png' },
  ]

  const tasks: {
    title: string
    date: string
    status: 'Completed' | 'On Progress'
  }[] = [
    { title: '로그인 UI 구현', date: '30 Mar', status: 'Completed' },
    { title: 'PR Template 구성', date: '30 Mar', status: 'On Progress' },
    { title: '대시보드 UI 구현', date: '30 Mar', status: 'On Progress' },
  ]

  const schedules = [
    { title: 'User Story Mapping 회의', time: '15:00 to 16:15' },
    { title: 'SW 캡스톤디자인 수업', time: '16:30 to 17:45' },
  ]

  return (
    <div className="flex min-h-screen w-full">
      <div className="flex-1 p-6">
        {/* Header */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/projects">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>프로젝트 - {id}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">프로젝트 - {id}</h1>
          <div className="flex items-center gap-4">
            <Button variant="outline">+ Invite</Button>
            <AvatarGroup users={teamMembers} />
          </div>
        </div>
        {/* Grid View */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <DailyScrumCard />
          <SprintPeriodCard />
          <StatusCard />
          <MyTaskCard tasks={tasks} />
          <ScheduleCard schedules={schedules} />
        </div>
      </div>
    </div>
  )
}
