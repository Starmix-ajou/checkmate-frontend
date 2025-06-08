import { Task } from '@cm/types/project'

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
      .map((task) => ({
        startDate: new Date(task.startDate),
        endDate: new Date(task.endDate),
      }))
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

    const dateMap = new Map<string, { remaining: number; ideal: number }>()

    for (let i = 0; i <= totalDays; i++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + i)
      const dateStr = currentDate.toISOString().split('T')[0]
      if (dateStr) {
        dateMap.set(dateStr, {
          remaining: totalTasks,
          ideal: Math.max(0, totalTasks - idealBurndown * i),
        })
      }
    }

    validTasks.forEach((task) => {
      if (task.status === 'DONE') {
        const endDateStr = new Date(task.endDate).toISOString().split('T')[0]
        if (endDateStr) {
          const currentData = dateMap.get(endDateStr)
          if (currentData) {
            dateMap.set(endDateStr, {
              ...currentData,
              remaining: currentData.remaining - 1,
            })
          }
        }
      }
    })

    let remainingTasks = totalTasks
    const sortedDates = Array.from(dateMap.keys()).sort()

    sortedDates.forEach((date) => {
      const currentData = dateMap.get(date)
      if (currentData && currentData.remaining !== totalTasks) {
        remainingTasks = currentData.remaining
      }
      if (currentData) {
        dateMap.set(date, {
          ...currentData,
          remaining: remainingTasks,
        })
      }
    })

    return Array.from(dateMap.entries()).map(([date, data]) => ({
      date,
      remaining: data.remaining,
      ideal: Math.round(data.ideal * 100) / 100,
    }))
  }

  const today = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' })
  )
    .toISOString()
    .split('T')[0]

  return {
    burndownData: calculateBurndownData(),
    today,
  }
}
