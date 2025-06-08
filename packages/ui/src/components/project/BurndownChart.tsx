import { Task } from '@cm/types/project'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@cm/ui/components/ui/card'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useBurndownChart } from '@cm/ui/hooks/useBurndownChart'
import { useEffortMetrics } from '@cm/ui/hooks/useEffortMetrics'

interface BurndownChartCardProps {
  tasks: Task[]
}

export default function BurndownChartCard({ tasks }: BurndownChartCardProps) {
  const { burndownData, today } = useBurndownChart(tasks)
  const { expectedEffort, actualEffort, remainingEffort } = useEffortMetrics(tasks)

  if (burndownData.length === 0) {
    return (
      <Card className="col-span-4 row-span-2 gap-0 p-0 pt-6">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <CardTitle>Burndown 차트</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[400px] items-center justify-center">
          <p className="text-muted-foreground">태스크 데이터가 없습니다.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-4 row-span-2 gap-0 p-0 pt-6">
      <CardHeader className="flex flex-row items-center justify-between border-b">
        <CardTitle>Burndown 차트</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px] p-0">
        <div className="w-full h-full flex flex-row">
          <ResponsiveContainer className="flex-1 h-full w-full p-4">
            <LineChart
              data={burndownData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f0f0f0"
              />
              <XAxis
                dataKey="date"
                tickFormatter={(date) =>
                  format(new Date(date), 'MM/dd', { locale: ko })
                }
                padding={{ left: 20, right: 20 }}
                axisLine={{ stroke: '#e0e0e0' }}
                tickLine={false}
                tick={{ fill: '#666', fontSize: 12 }}
              />
              <YAxis
                padding={{ top: 10, bottom: 10 }}
                axisLine={{ stroke: '#e0e0e0' }}
                tickLine={false}
                tick={{ fill: '#666', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
                labelFormatter={(date) =>
                  format(new Date(date), 'yyyy년 MM월 dd일', { locale: ko })
                }
                formatter={(value: number, name: string, props: any) => {
                  const label =
                    props.dataKey === 'remaining'
                      ? '남은 작업'
                      : '이상적인 진행'
                  return [`${value}개`, label]
                }}
              />
              <Legend className="mt-4" />
              <ReferenceLine
                x={today}
                stroke="#ff7300"
                strokeWidth={2}
                strokeDasharray="3 3"
                label={{
                  value: '오늘',
                  position: 'top',
                  fill: '#ff7300',
                  fontSize: 12,
                  fontWeight: 500,
                }}
              />
              <Line
                type="linear"
                dataKey="remaining"
                stroke="#8884d8"
                strokeWidth={2.5}
                name="남은 작업"
                dot={{
                  r: 4,
                  strokeWidth: 2,
                  fill: 'white',
                  stroke: '#8884d8',
                }}
                activeDot={{
                  r: 6,
                  strokeWidth: 2,
                  fill: 'white',
                  stroke: '#8884d8',
                }}
              />
              <Line
                type="linear"
                dataKey="ideal"
                stroke="#82ca9d"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="이상적인 진행"
                dot={{
                  r: 4,
                  strokeWidth: 2,
                  fill: 'white',
                  stroke: '#82ca9d',
                }}
                activeDot={{
                  r: 6,
                  strokeWidth: 2,
                  fill: 'white',
                  stroke: '#82ca9d',
                }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="border-l h-full w-[200px] flex flex-col">
            <div className="grid grid-rows-3 h-full divide-y">
              <div className="flex flex-col items-center justify-center p-4">
                <span className="text-muted-foreground text-sm">
                  Total Effort
                </span>
                <span className="mt-1 text-2xl font-semibold">
                  {expectedEffort}개
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-4">
                <span className="text-muted-foreground text-sm">
                  Actual Effort
                </span>
                <span className="mt-1 text-2xl font-semibold text-[#4CAF50]">
                  {actualEffort}개
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-4">
                <span className="text-muted-foreground text-sm">
                  Remaining Effort
                </span>
                <span className="mt-1 text-2xl font-semibold text-[#8884d8]">
                  {remainingEffort}개
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
