'use client'

import { useAuth } from '@/providers/AuthProvider'
import { useAuthStore } from '@/stores/useAuthStore'
import {
  ProjectStatisticsResponse,
  getProjectStatistics,
} from '@cm/api/statistics'
import { BaseNavbar } from '@cm/ui/components/common/BaseNavbar'
import LoadingScreen from '@cm/ui/components/common/LoadingScreen'
import { Card, CardContent } from '@cm/ui/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@cm/ui/components/ui/tabs'
import { useEffect, useState } from 'react'

import { Podium } from './Podium'

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

const transformApiData = (data: ProjectStatisticsResponse): ProjectStats[] => {
  const projectMap = new Map<string, ProjectStats>()

  data.taskStatistics.forEach((stat) => {
    projectMap.set(stat.project.projectId, {
      id: stat.project.projectId,
      name: stat.project.title,
      leaderName: stat.project.leader.name,
      taskStats: {
        doneRate: stat.statistics.doneRate,
        totalTasks: stat.statistics.totalCount,
        completedTasks: stat.statistics.doneCount,
      },
      dailyScrumStats: {
        doneRate: 0,
        totalDays: 0,
        completedDays: 0,
      },
      reviewStats: {
        doneRate: 0,
        totalReviews: 0,
        completedReviews: 0,
      },
    })
  })
  data.dailyScrumStatistics.forEach((stat) => {
    const project = projectMap.get(stat.project.projectId)
    if (project) {
      project.dailyScrumStats = {
        doneRate: stat.statistics.doneRate,
        totalDays: stat.statistics.totalDays,
        completedDays: stat.statistics.doneDays,
      }
    }
  })
  data.reviewStatistics.forEach((stat) => {
    const project = projectMap.get(stat.project.projectId)
    if (project) {
      project.reviewStats = {
        doneRate: stat.statistics.doneRate,
        totalReviews: stat.statistics.totalCount,
        completedReviews: stat.statistics.doneCount,
      }
    }
  })

  return Array.from(projectMap.values())
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
            <th className="text-left p-4 font-semibold">Project</th>
            <th className="text-left p-4 font-semibold">Leader</th>
            <th className="text-right p-4 font-semibold">Task 완료율</th>
            <th className="text-right p-4 font-semibold">Daily Scrum 참여율</th>
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
  const [projects, setProjects] = useState<ProjectStats[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user, signOut } = useAuth()
  const accessToken = useAuthStore((state) => state.user?.accessToken)

  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken) {
        return
      }

      try {
        const data = await getProjectStatistics(accessToken)
        const transformedData = transformApiData(data)
        setProjects(transformedData)
      } catch (error) {
        console.error('프로젝트 통계 데이터를 불러오는데 실패했습니다:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [accessToken])

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
      <LoadingScreen loading={isLoading} />
      <BaseNavbar
        user={user}
        onSignOut={signOut}
        showSidebarTrigger={false}
        showFilters={false}
      />
      <div className="container mx-auto py-8 space-y-8 max-w-4xl">
        <Card className="shadow-none bg-gradient-to-b from-background to-muted/20">
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
                  Daily Scrum
                </TabsTrigger>
                <TabsTrigger
                  value="review"
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all"
                >
                  미니 회고
                </TabsTrigger>
              </TabsList>

              <TabsContent value={sortBy}>
                <Podium projects={projects} getScore={getScore} />
                <span className="text-sm text-muted-foreground block text-right pb-4">
                  * 리더보드 결과는 매일 한국 시간 00:00에 초기화됩니다.
                </span>
                <LeaderboardTable projects={projects} sortBy={sortBy} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
