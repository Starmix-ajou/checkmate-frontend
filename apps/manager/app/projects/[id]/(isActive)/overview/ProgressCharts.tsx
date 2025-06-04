import { ProjectStatistics } from '@/lib/api/project'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@cm/ui/components/ui/card'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface ProgressChartsProps {
  statistics: ProjectStatistics
}

export default function ProgressCharts({ statistics }: ProgressChartsProps) {
  const { dailyScrumStatistics, reviewStatistics } = statistics

  const data = [
    {
      name: '데일리 스크럼',
      완료: dailyScrumStatistics.doneDays,
      전체: dailyScrumStatistics.totalDays,
      완료율: `${(dailyScrumStatistics.doneRate * 100).toFixed(1)}%`,
    },
    ...(reviewStatistics
      ? [
          {
            name: '미니 회고',
            완료: reviewStatistics.doneCount,
            전체: reviewStatistics.totalCount,
            완료율: `${(reviewStatistics.doneRate * 100).toFixed(1)}%`,
          },
        ]
      : []),
  ]

  if (data.length === 0) {
    return null
  }

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>진행률 통계</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="완료" fill="#8884d8" name="완료" />
            <Bar dataKey="전체" fill="#82ca9d" name="전체" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
