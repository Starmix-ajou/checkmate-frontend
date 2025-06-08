import { Epic } from '@cm/types/epic'

export const calculateEpicProgress = (epic: Epic): number => {
  if (!epic.tasks || epic.tasks.length === 0) {
    return 0
  }

  const totalTasks = epic.tasks.length
  const completedTasks = epic.tasks.filter(
    (task) => task.status === 'DONE'
  ).length

  return (completedTasks / totalTasks) * 100
}

export const formatProgress = (progress: number): string => {
  return `${progress.toFixed(1)}%`
}
