import { Epic } from '@cm/types/epic'
import { useMemo } from 'react'

export const useEpicProgress = (epic: Epic) => {
  const progress = useMemo(() => {
    if (!epic.tasks || epic.tasks.length === 0) return 0

    const totalTasks = epic.tasks.length
    const completedTasks = epic.tasks.filter(
      (task) => task.status === 'DONE'
    ).length

    return Math.round((completedTasks / totalTasks) * 100)
  }, [epic.tasks])

  const formatProgress = (progress: number) => {
    return `${progress}%`
  }

  return {
    progress,
    formatProgress,
  }
}
