import { Medal, Star, Trophy } from 'lucide-react'

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

interface PodiumProps {
  projects: ProjectStats[]
  getScore: (project: ProjectStats) => number
}

export const Podium = ({ projects, getScore }: PodiumProps) => {
  const sortedProjects = [...projects].sort((a, b) => getScore(b) - getScore(a))
  const topThree = sortedProjects.slice(0, 3)

  return (
    <div className="relative h-80 mb-12">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-end justify-center gap-8">
        <div className="flex flex-col items-center">
          <div className="w-36 h-36 bg-gradient-to-b from-gray-300 to-gray-400 rounded-t-2xl flex items-center justify-center shadow-lg">
            <Medal
              aria-hidden="true"
              className="w-14 h-14 text-white drop-shadow-md"
            />
          </div>
          <div className="mt-4 text-center">
            <div className="font-bold text-lg">{topThree[1]?.name || '-'}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {topThree[1]
                ? `${Math.round(getScore(topThree[1]) * 100)}%`
                : '-'}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Leader: {topThree[1]?.leaderName || '-'}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-48 h-48 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-t-2xl flex items-center justify-center shadow-xl">
            <Trophy
              aria-hidden="true"
              className="w-20 h-20 text-white drop-shadow-md"
            />
          </div>
          <div className="mt-4 text-center">
            <div className="font-bold text-xl">{topThree[0]?.name || '-'}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {topThree[0]
                ? `${Math.round(getScore(topThree[0]) * 100)}%`
                : '-'}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Leader: {topThree[0]?.leaderName || '-'}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-28 h-28 bg-gradient-to-b from-amber-600 to-amber-700 rounded-t-2xl flex items-center justify-center shadow-lg">
            <Star
              aria-hidden="true"
              className="w-10 h-10 text-white drop-shadow-md"
            />
          </div>
          <div className="mt-4 text-center">
            <div className="font-bold text-lg">{topThree[2]?.name || '-'}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {topThree[2]
                ? `${Math.round(getScore(topThree[2]) * 100)}%`
                : '-'}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Leader: {topThree[2]?.leaderName || '-'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
