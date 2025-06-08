import { ProjectStatistics } from '@/lib/api/project'
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
    { name: '할 일', value: taskStatistics.todoCount },
    { name: '진행 중', value: taskStatistics.inProgressCount },
    { name: '완료', value: taskStatistics.doneCount },
  ]

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>태스크 상태</CardTitle>
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
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
