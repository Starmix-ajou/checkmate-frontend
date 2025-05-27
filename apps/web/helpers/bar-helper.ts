import { BarTask, TaskTypeInternal } from '@cm/types/bar-task'
import { BarMoveAction } from '@cm/types/gantt-task-actions'
import { Task } from '@cm/types/public-types'

export const convertToBarTasks = (
  tasks: Task[],
  dates: Date[],
  columnWidth: number,
  rowHeight: number,
  taskHeight: number,
  barCornerRadius: number,
  handleWidth: number,
  rtl: boolean,
  barProgressColor: string,
  barProgressSelectedColor: string,
  barBackgroundColor: string,
  barBackgroundSelectedColor: string,
  projectProgressColor: string,
  projectProgressSelectedColor: string,
  projectBackgroundColor: string,
  projectBackgroundSelectedColor: string,
  milestoneBackgroundColor: string,
  milestoneBackgroundSelectedColor: string
): BarTask[] => {
  let barIndex = 0
  const barTasks = tasks.map((task) => {
    // null 날짜를 가진 태스크는 건너뛰기
    if (!task.start || !task.end) {
      return null
    }

    const barTask = convertToBarTask(
      task,
      barIndex,
      dates,
      columnWidth,
      rowHeight,
      taskHeight,
      barCornerRadius,
      handleWidth,
      rtl,
      barProgressColor,
      barProgressSelectedColor,
      barBackgroundColor,
      barBackgroundSelectedColor,
      projectProgressColor,
      projectProgressSelectedColor,
      projectBackgroundColor,
      projectBackgroundSelectedColor,
      milestoneBackgroundColor,
      milestoneBackgroundSelectedColor
    )
    if (barTask) {
      barIndex++
    }
    return barTask
  })

  return barTasks.filter((task): task is BarTask => task !== null)
}

const convertToBarTask = (
  task: Task,
  index: number,
  dates: Date[],
  columnWidth: number,
  rowHeight: number,
  taskHeight: number,
  barCornerRadius: number,
  handleWidth: number,
  rtl: boolean,
  barProgressColor: string,
  barProgressSelectedColor: string,
  barBackgroundColor: string,
  barBackgroundSelectedColor: string,
  projectProgressColor: string,
  projectProgressSelectedColor: string,
  projectBackgroundColor: string,
  projectBackgroundSelectedColor: string,
  milestoneBackgroundColor: string,
  milestoneBackgroundSelectedColor: string
): BarTask | null => {
  // null 날짜를 가진 태스크는 null 반환
  if (!task.start || !task.end) {
    return null
  }

  let barTask: BarTask
  switch (task.type) {
    case 'milestone':
      barTask = convertToMilestone(
        task,
        index,
        dates,
        columnWidth,
        rowHeight,
        taskHeight,
        barCornerRadius,
        handleWidth,
        milestoneBackgroundColor,
        milestoneBackgroundSelectedColor
      )
      break
    case 'project':
      barTask = convertToBar(
        task,
        index,
        dates,
        columnWidth,
        rowHeight,
        taskHeight,
        barCornerRadius,
        handleWidth,
        rtl,
        projectProgressColor,
        projectProgressSelectedColor,
        projectBackgroundColor,
        projectBackgroundSelectedColor
      )
      break
    default:
      barTask = convertToBar(
        task,
        index,
        dates,
        columnWidth,
        rowHeight,
        taskHeight,
        barCornerRadius,
        handleWidth,
        rtl,
        barProgressColor,
        barProgressSelectedColor,
        barBackgroundColor,
        barBackgroundSelectedColor
      )
  }
  return barTask
}

const convertToBar = (
  task: Task,
  index: number,
  dates: Date[],
  columnWidth: number,
  rowHeight: number,
  taskHeight: number,
  barCornerRadius: number,
  handleWidth: number,
  rtl: boolean,
  barProgressColor: string,
  barProgressSelectedColor: string,
  barBackgroundColor: string,
  barBackgroundSelectedColor: string
): BarTask => {
  let x1: number
  let x2: number
  if (rtl) {
    x2 = taskXCoordinateRTL(task.start, dates, columnWidth)
    x1 = taskXCoordinateRTL(task.end, dates, columnWidth)
  } else {
    x1 = taskXCoordinate(task.start, dates, columnWidth)
    x2 = taskXCoordinate(task.end, dates, columnWidth)
  }
  let typeInternal: TaskTypeInternal = task.type
  if (typeInternal === 'task' && x2 - x1 < handleWidth * 2) {
    typeInternal = 'smalltask'
    x2 = x1 + handleWidth * 2
  }

  const y = taskYCoordinate(index, rowHeight, taskHeight)
  const hideChildren = task.type === 'project' ? task.hideChildren : undefined

  const [progressWidth, progressX] = progressWithByParams(
    x1,
    x2,
    task.progress,
    rtl
  )

  return {
    ...task,
    typeInternal,
    x1,
    x2,
    y,
    index,
    progressX,
    progressWidth,
    barCornerRadius,
    handleWidth,
    hideChildren,
    barChildren: [],
    height: taskHeight,
    styles: {
      backgroundColor: barBackgroundColor,
      backgroundSelectedColor: barBackgroundSelectedColor,
      progressColor: barProgressColor,
      progressSelectedColor: barProgressSelectedColor,
      ...task.styles,
    },
  }
}

const convertToMilestone = (
  task: Task,
  index: number,
  dates: Date[],
  columnWidth: number,
  rowHeight: number,
  taskHeight: number,
  barCornerRadius: number,
  handleWidth: number,
  milestoneBackgroundColor: string,
  milestoneBackgroundSelectedColor: string
): BarTask => {
  const x = taskXCoordinate(task.start, dates, columnWidth)
  const y = taskYCoordinate(index, rowHeight, taskHeight)

  const x1 = x - taskHeight * 0.5
  const x2 = x + taskHeight * 0.5

  return {
    ...task,
    typeInternal: 'milestone',
    x1,
    x2,
    y,
    index,
    progressX: 0,
    progressWidth: 0,
    barCornerRadius,
    handleWidth,
    hideChildren: undefined,
    barChildren: [],
    height: taskHeight,
    styles: {
      backgroundColor: milestoneBackgroundColor,
      backgroundSelectedColor: milestoneBackgroundSelectedColor,
      progressColor: '',
      progressSelectedColor: '',
      ...task.styles,
    },
  }
}

const taskXCoordinate = (
  xDate: Date | null,
  dates: Date[],
  columnWidth: number
) => {
  if (!xDate) return 0
  const index = dates.findIndex((d) => d.getTime() >= xDate.getTime()) - 1
  if (index < 0) return 0

  const remainderMillis = xDate.getTime() - dates[index].getTime()
  const percentOfInterval =
    remainderMillis / (dates[index + 1].getTime() - dates[index].getTime())
  return index * columnWidth + percentOfInterval * columnWidth
}

const taskXCoordinateRTL = (
  xDate: Date | null,
  dates: Date[],
  columnWidth: number
) => {
  if (!xDate) return 0
  const index = dates.findIndex((d) => d.getTime() >= xDate.getTime()) - 1
  if (index < 0) return 0

  const remainderMillis = xDate.getTime() - dates[index].getTime()
  const percentOfInterval =
    remainderMillis / (dates[index + 1].getTime() - dates[index].getTime())
  return (
    (dates.length - 1 - index) * columnWidth - percentOfInterval * columnWidth
  )
}

const taskYCoordinate = (
  index: number,
  rowHeight: number,
  taskHeight: number
) => {
  const y = index * rowHeight
  return y + (rowHeight - taskHeight) / 2
}

export const progressWithByParams = (
  taskX1: number,
  taskX2: number,
  progress: number,
  rtl: boolean
) => {
  const progressWidth = (taskX2 - taskX1) * progress * 0.01
  let progressX: number
  if (rtl) {
    progressX = taskX2 - progressWidth
  } else {
    progressX = taskX1
  }
  return [progressWidth, progressX]
}

export const progressByProgressWidth = (
  progressWidth: number,
  barTask: BarTask
) => {
  const barWidth = barTask.x2 - barTask.x1
  const progressPercent = Math.round((progressWidth * 100) / barWidth)
  if (progressPercent >= 100) return 100
  else if (progressPercent <= 0) return 0
  else return progressPercent
}

const progressByX = (x: number, task: BarTask) => {
  if (x >= task.x2) return 100
  else if (x <= task.x1) return 0
  else {
    const barWidth = task.x2 - task.x1
    const progressPercent = Math.round(((x - task.x1) * 100) / barWidth)
    return progressPercent
  }
}
const progressByXRTL = (x: number, task: BarTask) => {
  if (x >= task.x2) return 0
  else if (x <= task.x1) return 100
  else {
    const barWidth = task.x2 - task.x1
    const progressPercent = Math.round(((task.x2 - x) * 100) / barWidth)
    return progressPercent
  }
}

export const getProgressPoint = (
  progressX: number,
  taskY: number,
  taskHeight: number
) => {
  const point = [
    progressX - 5,
    taskY + taskHeight,
    progressX + 5,
    taskY + taskHeight,
    progressX,
    taskY + taskHeight - 8.66,
  ]
  return point.join(',')
}

const startByX = (x: number, xStep: number, task: BarTask) => {
  if (x >= task.x2 - task.handleWidth * 2) {
    x = task.x2 - task.handleWidth * 2
  }
  const steps = Math.round((x - task.x1) / xStep)
  const additionalXValue = steps * xStep
  const newX = task.x1 + additionalXValue
  return newX
}

const endByX = (x: number, xStep: number, task: BarTask) => {
  if (x <= task.x1 + task.handleWidth * 2) {
    x = task.x1 + task.handleWidth * 2
  }
  const steps = Math.round((x - task.x2) / xStep)
  const additionalXValue = steps * xStep
  const newX = task.x2 + additionalXValue
  return newX
}

const moveByX = (x: number, xStep: number, task: BarTask) => {
  const steps = Math.round((x - task.x1) / xStep)
  const additionalXValue = steps * xStep
  const newX1 = task.x1 + additionalXValue
  const newX2 = newX1 + task.x2 - task.x1
  return [newX1, newX2]
}

const dateByX = (
  x: number,
  taskX: number,
  taskDate: Date,
  xStep: number,
  timeStep: number
) => {
  let newDate = new Date(((x - taskX) / xStep) * timeStep + taskDate.getTime())
  newDate = new Date(
    newDate.getTime() +
      (newDate.getTimezoneOffset() - taskDate.getTimezoneOffset()) * 60000
  )
  return newDate
}

/**
 * Method handles event in real time(mousemove) and on finish(mouseup)
 */
export const handleTaskBySVGMouseEvent = (
  svgX: number,
  action: BarMoveAction,
  selectedTask: BarTask,
  xStep: number,
  timeStep: number,
  initEventX1Delta: number,
  rtl: boolean
): { isChanged: boolean; changedTask: BarTask } => {
  let result: { isChanged: boolean; changedTask: BarTask }
  switch (selectedTask.type) {
    case 'milestone':
      result = handleTaskBySVGMouseEventForMilestone(
        svgX,
        action,
        selectedTask,
        xStep,
        timeStep,
        initEventX1Delta
      )
      break
    default:
      result = handleTaskBySVGMouseEventForBar(
        svgX,
        action,
        selectedTask,
        xStep,
        timeStep,
        initEventX1Delta,
        rtl
      )
      break
  }
  return result
}

const handleTaskBySVGMouseEventForBar = (
  svgX: number,
  action: BarMoveAction,
  selectedTask: BarTask,
  xStep: number,
  timeStep: number,
  initEventX1Delta: number,
  rtl: boolean
): { isChanged: boolean; changedTask: BarTask } => {
  const changedTask: BarTask = { ...selectedTask }
  let isChanged = false
  switch (action) {
    case 'progress':
      if (rtl) {
        changedTask.progress = progressByXRTL(svgX, selectedTask)
      } else {
        changedTask.progress = progressByX(svgX, selectedTask)
      }
      isChanged = changedTask.progress !== selectedTask.progress
      if (isChanged) {
        const [progressWidth, progressX] = progressWithByParams(
          changedTask.x1,
          changedTask.x2,
          changedTask.progress,
          rtl
        )
        changedTask.progressWidth = progressWidth
        changedTask.progressX = progressX
      }
      break
    case 'start': {
      const newX1 = startByX(svgX, xStep, selectedTask)
      changedTask.x1 = newX1
      isChanged = changedTask.x1 !== selectedTask.x1
      if (isChanged) {
        if (rtl) {
          if (selectedTask.end) {
            changedTask.end = dateByX(
              newX1,
              selectedTask.x1,
              selectedTask.end,
              xStep,
              timeStep
            )
          }
        } else {
          if (selectedTask.start) {
            changedTask.start = dateByX(
              newX1,
              selectedTask.x1,
              selectedTask.start,
              xStep,
              timeStep
            )
          }
        }
        const [progressWidth, progressX] = progressWithByParams(
          changedTask.x1,
          changedTask.x2,
          changedTask.progress,
          rtl
        )
        changedTask.progressWidth = progressWidth
        changedTask.progressX = progressX
      }
      break
    }
    case 'end': {
      const newX2 = endByX(svgX, xStep, selectedTask)
      changedTask.x2 = newX2
      isChanged = changedTask.x2 !== selectedTask.x2
      if (isChanged) {
        if (rtl) {
          if (selectedTask.start) {
            changedTask.start = dateByX(
              newX2,
              selectedTask.x2,
              selectedTask.start,
              xStep,
              timeStep
            )
          }
        } else {
          if (selectedTask.end) {
            changedTask.end = dateByX(
              newX2,
              selectedTask.x2,
              selectedTask.end,
              xStep,
              timeStep
            )
          }
        }
        const [progressWidth, progressX] = progressWithByParams(
          changedTask.x1,
          changedTask.x2,
          changedTask.progress,
          rtl
        )
        changedTask.progressWidth = progressWidth
        changedTask.progressX = progressX
      }
      break
    }
    case 'move': {
      const [newMoveX1, newMoveX2] = moveByX(
        svgX - initEventX1Delta,
        xStep,
        selectedTask
      )
      isChanged = newMoveX1 !== selectedTask.x1
      if (isChanged) {
        if (selectedTask.start && selectedTask.end) {
          changedTask.start = dateByX(
            newMoveX1,
            selectedTask.x1,
            selectedTask.start,
            xStep,
            timeStep
          )
          changedTask.end = dateByX(
            newMoveX2,
            selectedTask.x2,
            selectedTask.end,
            xStep,
            timeStep
          )
        }
        changedTask.x1 = newMoveX1
        changedTask.x2 = newMoveX2
        const [progressWidth, progressX] = progressWithByParams(
          changedTask.x1,
          changedTask.x2,
          changedTask.progress,
          rtl
        )
        changedTask.progressWidth = progressWidth
        changedTask.progressX = progressX
      }
      break
    }
  }
  return { isChanged, changedTask }
}

const handleTaskBySVGMouseEventForMilestone = (
  svgX: number,
  action: BarMoveAction,
  selectedTask: BarTask,
  xStep: number,
  timeStep: number,
  initEventX1Delta: number
): { isChanged: boolean; changedTask: BarTask } => {
  const changedTask: BarTask = { ...selectedTask }
  let isChanged = false
  switch (action) {
    case 'move': {
      const [newMoveX1, newMoveX2] = moveByX(
        svgX - initEventX1Delta,
        xStep,
        selectedTask
      )
      isChanged = newMoveX1 !== selectedTask.x1
      if (isChanged) {
        if (selectedTask.start) {
          changedTask.start = dateByX(
            newMoveX1,
            selectedTask.x1,
            selectedTask.start,
            xStep,
            timeStep
          )
          changedTask.end = changedTask.start
        }
        changedTask.x1 = newMoveX1
        changedTask.x2 = newMoveX2
      }
      break
    }
  }
  return { isChanged, changedTask }
}
