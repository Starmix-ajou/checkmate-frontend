import { Task } from '@cm/types/project'
import { addHours, format } from 'date-fns'

type BurndownData = {
  date: string
  remaining: number
  ideal: number
}

export const useBurndownChart = (tasks: Task[]) => {
  const calculateBurndownData = (): BurndownData[] => {
    if (tasks.length === 0) {
      return []
    }

    const validTasks = tasks.filter(
      (task): task is Task & { startDate: string; endDate: string } =>
        task.startDate !== null &&
        task.endDate !== null &&
        task.startDate !== '' &&
        task.endDate !== '' &&
        !isNaN(new Date(task.startDate).getTime()) &&
        !isNaN(new Date(task.endDate).getTime())
    )

    if (validTasks.length === 0) {
      return []
    }

    const dates = validTasks
      .map((task) => {
        const startDate = new Date(task.startDate)
        const endDate = new Date(task.endDate)
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          return null
        }
        return { startDate, endDate, task }
      })
      .filter(
        (date): date is { startDate: Date; endDate: Date; task: Task } =>
          date !== null
      )
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())

    if (dates.length === 0) {
      return []
    }

    const [firstDate] = dates
    const lastDate = dates[dates.length - 1]

    if (!firstDate || !lastDate) {
      return []
    }

    const startDate = firstDate.startDate
    const endDate = lastDate.endDate
    const totalDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    )
    const totalTasks = validTasks.length
    const idealBurndown = totalTasks / totalDays

    const completedTasksByDate = new Map<string, number>()
    const allDates = new Set<string>()

    for (let i = 0; i <= totalDays; i++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + i)
      const dateStr = currentDate.toISOString().split('T')[0]
      if (dateStr) {
        allDates.add(dateStr)
        completedTasksByDate.set(dateStr, 0)
      }
    }

    validTasks.forEach((task) => {
      let completionDate: Date | null = null

      if (task.doneDate) {
        const doneDate = new Date(task.doneDate)
        if (!isNaN(doneDate.getTime())) {
          completionDate = doneDate
        }
      } else if (task.status === 'DONE') {
        const endDate = new Date(task.endDate)
        if (!isNaN(endDate.getTime())) {
          completionDate = endDate
        }
      }

      if (completionDate) {
        const completionDateStr = completionDate.toISOString().split('T')[0]
        if (completionDateStr) {
          for (const date of allDates) {
            if (date >= completionDateStr) {
              completedTasksByDate.set(
                date,
                (completedTasksByDate.get(date) || 0) + 1
              )
            }
          }
        }
      }
    })

    const burndownData = Array.from(allDates)
      .sort()
      .map((date) => {
        const completedTasks = completedTasksByDate.get(date) || 0
        const dayIndex = Math.floor(
          (new Date(date).getTime() - startDate.getTime()) /
            (1000 * 60 * 60 * 24)
        )

        return {
          date,
          remaining: Math.max(0, totalTasks - completedTasks),
          ideal: Math.max(
            0,
            Math.round((totalTasks - idealBurndown * dayIndex) * 100) / 100
          ),
        }
      })

    return burndownData
  }

  const today = format(addHours(new Date(), 9), 'yyyy-MM-dd')

  return {
    burndownData: calculateBurndownData(),
    today,
  }
}
