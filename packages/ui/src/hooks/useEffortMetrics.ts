import { Task } from '@cm/types/project'

type EffortMetrics = {
  expectedEffort: number
  actualEffort: number
  remainingEffort: number
}

export const useEffortMetrics = (tasks: Task[]): EffortMetrics => {
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.status === 'DONE').length
  const remainingTasks = totalTasks - completedTasks

  return {
    expectedEffort: totalTasks,
    actualEffort: completedTasks,
    remainingEffort: remainingTasks,
  }
} 