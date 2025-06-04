import { Task } from '@cm/types/project'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@cm/ui/components/ui/card'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type BurndownData = {
  date: string
  remaining: number
  ideal: number
}

const hasSprint = (
  task: Task
): task is Task & { epic: { sprint: NonNullable<Task['epic']['sprint']> } } => {
  return !!task.epic?.sprint
}

const calculateBurndownData = (tasks: Task[]): BurndownData[] => {
  const sprintDates = tasks
    .filter(hasSprint)
    .map((task) => ({
      startDate: new Date(task.epic.sprint.startDate),
      endDate: new Date(task.epic.sprint.endDate),
    }))
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())

  if (sprintDates.length === 0) {
    return []
  }

  const startDate = sprintDates[0].startDate
  const endDate = sprintDates[sprintDates.length - 1].endDate
  const totalDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  )
  const totalTasks = tasks.length
  const idealBurndown = totalTasks / totalDays

  const dates: { [key: string]: { remaining: number; ideal: number } } = {}

  for (let i = 0; i <= totalDays; i++) {
    const currentDate = new Date(startDate)
    currentDate.setDate(startDate.getDate() + i)
    const dateStr = currentDate.toISOString().split('T')[0]
    dates[dateStr] = {
      remaining: totalTasks,
      ideal: Math.max(0, totalTasks - idealBurndown * i),
    }
  }

  tasks.forEach((task) => {
    if (task.status === 'DONE' && task.endDate) {
      const endDate = new Date(task.endDate).toISOString().split('T')[0]
      if (dates[endDate]) {
        dates[endDate].remaining--
      }
    }
  })

  let remainingTasks = totalTasks
  Object.keys(dates).forEach((date) => {
    if (dates[date].remaining !== totalTasks) {
      remainingTasks = dates[date].remaining
    }
    dates[date].remaining = remainingTasks
  })

  return Object.entries(dates).map(([date, data]) => ({
    date,
    remaining: data.remaining,
    ideal: Math.round(data.ideal * 100) / 100,
  }))
}

interface BurndownChartCardProps {
  tasks: Task[]
}

export default function BurndownChartCard({ tasks }: BurndownChartCardProps) {
  const burndownData = calculateBurndownData(tasks)

  if (burndownData.length === 0) {
    return (
      <Card className="col-span-4 row-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>번다운차트</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center">
          <p className="text-muted-foreground">스프린트 데이터가 없습니다.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-4 row-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>번다운차트</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={burndownData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="remaining"
              stroke="#8884d8"
              strokeWidth="2"
              name="남은 작업"
            />
            <Line
              type="monotone"
              dataKey="ideal"
              stroke="#82ca9d"
              strokeWidth="2"
              strokeDasharray="5 5"
              name="이상적인 진행"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
