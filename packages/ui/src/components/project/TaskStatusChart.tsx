import { ProjectStatistics } from '@cm/api/insight'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@cm/ui/components/ui/card'
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

const COLORS = ['#FF8042', '#0088FE', '#00C49F']

interface TaskStatusChartProps {
  statistics: ProjectStatistics
}

export default function TaskStatusChart({ statistics }: TaskStatusChartProps) {
  const { taskStatistics } = statistics
  const data = [
    { name: 'To Do', value: taskStatistics.todoCount },
    { name: 'In Progress', value: taskStatistics.inProgressCount },
    { name: 'Done', value: taskStatistics.doneCount },
  ]

  const totalTasks = data.reduce((sum, item) => sum + item.value, 0)
  if (totalTasks === 0) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Task Status</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">태스크가 없습니다.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Task Status</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, value, percent }) => {
                // 값이 0이면 라벨을 표시하지 않음
                if (value === 0) return ''
                // 값이 0이 아닌 경우에만 라벨 표시
                return `${name} ${(percent * 100).toFixed(0)}%`
              }}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => [`${value}개`, '']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
