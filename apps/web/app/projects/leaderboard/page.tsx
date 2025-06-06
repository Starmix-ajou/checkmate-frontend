'use client'

import { useAuth } from '@/providers/AuthProvider'
import { BaseNavbar } from '@cm/ui/components/common/BaseNavbar'
import { Card, CardContent } from '@cm/ui/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@cm/ui/components/ui/tabs'
import { Medal, Star, Trophy } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ProjectStats {
  id: string
  name: string
  leaderName: string
  taskStats: {
    doneRate: number
    totalTasks: number
    completedTasks: number
  }
  dailyScrumStats: {
    doneRate: number
    totalDays: number
    completedDays: number
  }
  reviewStats: {
    doneRate: number
    totalReviews: number
    completedReviews: number
  }
}

const generateMockData = (): ProjectStats[] => {
  const projectNames = [
    { name: '체크메이트', leader: '김민준' },
    { name: '프로젝트X', leader: '이서연' },
    { name: '넥스트스텝', leader: '박지훈' },
    { name: '코드마스터', leader: '최수아' },
    { name: '디벨로퍼스', leader: '정도윤' },
    { name: '테크스쿼드', leader: '강하은' },
    { name: '인노베이션', leader: '윤서준' },
    { name: '퓨처랩', leader: '임지민' },
  ]

  return projectNames.map((project, index) => ({
    id: `project-${index + 1}`,
    name: project.name,
    leaderName: project.leader,
    taskStats: {
      doneRate: Math.random() * 0.5 + 0.5,
      totalTasks: Math.floor(Math.random() * 100) + 50,
      completedTasks: Math.floor(Math.random() * 60) + 30,
    },
    dailyScrumStats: {
      doneRate: Math.random() * 0.5 + 0.5,
      totalDays: Math.floor(Math.random() * 60) + 30,
      completedDays: Math.floor(Math.random() * 40) + 20,
    },
    reviewStats: {
      doneRate: Math.random() * 0.5 + 0.5,
      totalReviews: Math.floor(Math.random() * 80) + 40,
      completedReviews: Math.floor(Math.random() * 50) + 25,
    },
  }))
}

const mockProjects = generateMockData()

const Podium = ({
  projects,
  getScore,
}: {
  projects: ProjectStats[]
  getScore: (project: ProjectStats) => number
}) => {
  const sortedProjects = [...projects].sort((a, b) => getScore(b) - getScore(a))
  const topThree = sortedProjects.slice(0, 3)

  return (
    <div className="relative h-80 mb-12">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-end justify-center gap-8">
        <div className="flex flex-col items-center">
          <div className="w-36 h-36 bg-gradient-to-b from-gray-300 to-gray-400 rounded-t-2xl flex items-center justify-center shadow-lg">
            <Medal className="w-14 h-14 text-white drop-shadow-md" />
          </div>
          <div className="mt-4 text-center">
            <div className="font-bold text-lg">{topThree[1]?.name || '-'}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {topThree[1]
                ? `${Math.round(getScore(topThree[1]) * 100)}%`
                : '-'}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              팀장: {topThree[1]?.leaderName || '-'}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-48 h-48 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-t-2xl flex items-center justify-center shadow-xl">
            <Trophy className="w-20 h-20 text-white drop-shadow-md" />
          </div>
          <div className="mt-4 text-center">
            <div className="font-bold text-xl">{topThree[0]?.name || '-'}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {topThree[0]
                ? `${Math.round(getScore(topThree[0]) * 100)}%`
                : '-'}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              팀장: {topThree[0]?.leaderName || '-'}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-28 h-28 bg-gradient-to-b from-amber-600 to-amber-700 rounded-t-2xl flex items-center justify-center shadow-lg">
            <Star className="w-10 h-10 text-white drop-shadow-md" />
          </div>
          <div className="mt-4 text-center">
            <div className="font-bold text-lg">{topThree[2]?.name || '-'}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {topThree[2]
                ? `${Math.round(getScore(topThree[2]) * 100)}%`
                : '-'}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              팀장: {topThree[2]?.leaderName || '-'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const LeaderboardTable = ({
  projects,
  sortBy,
}: {
  projects: ProjectStats[]
  sortBy: 'task' | 'scrum' | 'review'
}) => {
  const getScore = (project: ProjectStats) => {
    switch (sortBy) {
      case 'task':
        return project.taskStats.doneRate
      case 'scrum':
        return project.dailyScrumStats.doneRate
      case 'review':
        return project.reviewStats.doneRate
    }
  }

  const sortedProjects = [...projects].sort((a, b) => getScore(b) - getScore(a))

  return (
    <div className="overflow-x-auto rounded-lg border bg-card">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="text-left p-4 font-semibold">순위</th>
            <th className="text-left p-4 font-semibold">프로젝트</th>
            <th className="text-left p-4 font-semibold">팀장</th>
            <th className="text-right p-4 font-semibold">태스크 완료율</th>
            <th className="text-right p-4 font-semibold">
              데일리 스크럼 참여율
            </th>
            <th className="text-right p-4 font-semibold">미니 회고 완료율</th>
          </tr>
        </thead>
        <tbody>
          {sortedProjects.map((project, index) => (
            <tr
              key={project.id}
              className="border-b hover:bg-muted/50 transition-colors"
            >
              <td className="p-4 font-medium">{index + 1}</td>
              <td className="p-4 font-medium">{project.name}</td>
              <td className="p-4 text-muted-foreground">
                {project.leaderName}
              </td>
              <td className="p-4 text-right">
                <div className="font-medium">
                  {Math.round(project.taskStats.doneRate * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">
                  {project.taskStats.completedTasks}/
                  {project.taskStats.totalTasks}
                </div>
              </td>
              <td className="p-4 text-right">
                <div className="font-medium">
                  {Math.round(project.dailyScrumStats.doneRate * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">
                  {project.dailyScrumStats.completedDays}/
                  {project.dailyScrumStats.totalDays}일
                </div>
              </td>
              <td className="p-4 text-right">
                <div className="font-medium">
                  {Math.round(project.reviewStats.doneRate * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">
                  {project.reviewStats.completedReviews}/
                  {project.reviewStats.totalReviews}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function LeaderboardPage() {
  const categories: ('task' | 'scrum' | 'review')[] = [
    'task',
    'scrum',
    'review',
  ]
  const [sortBy, setSortBy] = useState<'task' | 'scrum' | 'review'>('task')
  const { user, signOut } = useAuth()

  useEffect(() => {
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)]
    setSortBy(randomCategory)
  }, [])

  const getScore = (project: ProjectStats) => {
    switch (sortBy) {
      case 'task':
        return project.taskStats.doneRate
      case 'scrum':
        return project.dailyScrumStats.doneRate
      case 'review':
        return project.reviewStats.doneRate
    }
  }

  return (
    <div className="w-full h-full bg-cm-light">
      <BaseNavbar
        user={user}
        onSignOut={signOut}
        showSidebarTrigger={false}
        showFilters={false}
      />
      <div className="container mx-auto py-8 space-y-8 max-w-4xl">
        <Card className=" shadow-none bg-gradient-to-b from-background to-muted/20">
          <CardContent>
            <Tabs
              value={sortBy}
              onValueChange={(value) =>
                setSortBy(value as 'task' | 'scrum' | 'review')
              }
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger
                  value="task"
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all"
                >
                  Task
                </TabsTrigger>
                <TabsTrigger
                  value="scrum"
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all"
                >
                  데일리 스크럼
                </TabsTrigger>
                <TabsTrigger
                  value="review"
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all"
                >
                  미니 회고
                </TabsTrigger>
              </TabsList>

              <TabsContent value={sortBy}>
                <Podium projects={mockProjects} getScore={getScore} />
                <span className="text-sm text-muted-foreground block text-right pb-4">
                  * 리더보드 결과는 매일 한국 시간 00:00에 초기화됩니다.
                </span>
                <LeaderboardTable projects={mockProjects} sortBy={sortBy} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
