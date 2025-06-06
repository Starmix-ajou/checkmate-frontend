import { convertToBarTasks } from '@/helpers/bar-helper'
import { ganttDateRange, seedDates } from '@/helpers/date-helper'
import { BarTask } from '@cm/types/bar-task'
import { DateSetup } from '@cm/types/date-setup'
import { Epic } from '@cm/types/epic'
import { GanttEvent } from '@cm/types/gantt-task-actions'
import { GanttProps, Task, ViewMode } from '@cm/types/public-types'
import React, {
  SyntheticEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { CalendarProps } from '../calendar/calendar'
import { GridProps } from '../grid/grid'
import { HorizontalScroll } from '../other/horizontal-scroll'
import { StandardTooltipContent, Tooltip } from '../other/tooltip'
import { VerticalScroll } from '../other/vertical-scroll'
import { TaskList, TaskListProps } from '../task-list/task-list'
import styles from './gantt.module.css'
import { TaskGantt } from './task-gantt'
import { TaskGanttContent, TaskGanttContentProps } from './task-gantt-content'

export const Gantt: React.FunctionComponent<
  Omit<GanttProps, 'tasks'> & { epics: Epic[] }
> = ({
  epics,
  headerHeight = 50,
  columnWidth = 60,
  listCellWidth = '155px',
  rowHeight = 50,
  ganttHeight = 0,
  viewMode = ViewMode.Day,
  preStepsCount = 1,
  locale = 'en-GB',
  barFill = 60,
  barCornerRadius = 4,
  barProgressColor = '#a3a3ff',
  barProgressSelectedColor = '#8282f5',
  barBackgroundColor = '#b8c2cc',
  barBackgroundSelectedColor = '#aeb8c2',
  projectProgressColor = '#7db59a',
  projectProgressSelectedColor = '#59a985',
  projectBackgroundColor = '#795548',
  projectBackgroundSelectedColor = '#f7bb53',
  milestoneBackgroundColor = '#f1c453',
  milestoneBackgroundSelectedColor = '#f29e4c',
  rtl = false,
  handleWidth = 8,
  timeStep = 300000,
  arrowColor = 'grey',
  fontFamily = 'Pretendard, sans-serif',
  fontSize = '14px',
  arrowIndent = 20,
  todayColor = 'rgba(239, 234, 232, 0.5)',
  TooltipContent = StandardTooltipContent,
  onDateChange,
  onProgressChange,
  onDoubleClick,
  onClick,
  onDelete,
  onSelect,
  onExpanderClick,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const taskListRef = useRef<HTMLDivElement>(null)
  const [expandedEpics, setExpandedEpics] = useState<Set<string>>(new Set())

  const filteredTasks = useMemo(() => {
    return epics.flatMap((epic: Epic) => {
      // Epic의 하위 태스크들 중 유효한 날짜를 가진 태스크들의 날짜 범위 계산
      const taskDates = epic.tasks
        .filter((task) => task.startDate && task.endDate)
        .map((task) => ({
          start: new Date(task.startDate!),
          end: new Date(task.endDate!),
        }))

      // Epic의 시작일과 종료일 계산
      const epicStart =
        taskDates.length > 0
          ? new Date(Math.min(...taskDates.map((d) => d.start.getTime())))
          : null
      const epicEnd =
        taskDates.length > 0
          ? new Date(Math.max(...taskDates.map((d) => d.end.getTime())))
          : null

      // Epic이 접혀있는 경우
      if (!expandedEpics.has(epic.epicId)) {
        return [
          {
            id: epic.epicId,
            name: epic.title,
            start: epicStart,
            end: epicEnd,
            progress: 0,
            type: 'project' as const,
            hideChildren: true,
            tasks: epic.tasks.map((task) => ({
              id: task.taskId,
              name: task.title,
              start: task.startDate ? new Date(task.startDate) : null,
              end: task.endDate ? new Date(task.endDate) : null,
              progress: 0,
              type: 'task' as const,
              hideChildren: true,
            })),
          } as Task,
        ]
      }

      // Epic이 펼쳐진 경우
      return [
        {
          id: epic.epicId,
          name: epic.title,
          start: epicStart,
          end: epicEnd,
          progress: 0,
          type: 'project' as const,
          hideChildren: false,
          tasks: epic.tasks.map((task) => ({
            id: task.taskId,
            name: task.title,
            start: task.startDate ? new Date(task.startDate) : null,
            end: task.endDate ? new Date(task.endDate) : null,
            progress: 0,
            type: 'task' as const,
            hideChildren: true,
          })),
        } as Task,
        // 하위 태스크들 중 유효한 날짜를 가진 태스크만 표시
        ...epic.tasks
          .filter((task) => task.startDate && task.endDate)
          .map(
            (task) =>
              ({
                id: task.taskId,
                name: task.title,
                start: new Date(task.startDate!),
                end: new Date(task.endDate!),
                progress: 0,
                type: 'task' as const,
                hideChildren: true,
              }) as Task
          ),
      ]
    })
  }, [epics, expandedEpics])

  const [dateSetup, setDateSetup] = useState<DateSetup>(() => {
    const initialTasks = epics.flatMap((epic) => {
      const taskDates = epic.tasks
        .filter((task) => task.startDate && task.endDate)
        .map((task) => ({
          start: new Date(task.startDate!),
          end: new Date(task.endDate!),
        }))

      const epicStart =
        taskDates.length > 0
          ? new Date(Math.min(...taskDates.map((d) => d.start.getTime())))
          : null
      const epicEnd =
        taskDates.length > 0
          ? new Date(Math.max(...taskDates.map((d) => d.end.getTime())))
          : null

      return [
        {
          id: epic.epicId,
          name: epic.title,
          start: epicStart,
          end: epicEnd,
          progress: 0,
          type: 'project' as const,
          hideChildren: true,
        } as Task,
      ]
    })

    const [startDate, endDate] = ganttDateRange(
      initialTasks,
      viewMode,
      preStepsCount
    )
    return { viewMode, dates: seedDates(startDate, endDate, viewMode) }
  })

  const [taskListWidth, setTaskListWidth] = useState(0)
  const [svgContainerWidth, setSvgContainerWidth] = useState(0)
  const [svgContainerHeight, setSvgContainerHeight] = useState(ganttHeight)
  const [barTasks, setBarTasks] = useState<BarTask[]>([])
  const [ganttEvent, setGanttEvent] = useState<GanttEvent>({
    action: '',
  })
  const taskHeight = useMemo(
    () => (rowHeight * barFill) / 100,
    [rowHeight, barFill]
  )

  const [selectedTask, setSelectedTask] = useState<BarTask>()
  const [failedTask, setFailedTask] = useState<BarTask | null>(null)

  const svgWidth = dateSetup.dates.length * columnWidth
  const ganttFullHeight = barTasks.length * rowHeight

  const [scrollY, setScrollY] = useState(0)
  const [scrollX, setScrollX] = useState(-1)
  const [ignoreScrollEvent, setIgnoreScrollEvent] = useState(false)

  // task change events
  useEffect(() => {
    const [startDate, endDate] = ganttDateRange(
      filteredTasks,
      viewMode,
      preStepsCount
    )
    let newDates = seedDates(startDate, endDate, viewMode)
    if (rtl) {
      newDates = newDates.reverse()
      if (scrollX === -1) {
        setScrollX(newDates.length * columnWidth)
      }
    }
    setDateSetup({ dates: newDates, viewMode })
    setBarTasks(
      convertToBarTasks(
        filteredTasks,
        newDates,
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
    )
  }, [filteredTasks, viewMode, preStepsCount, rtl, scrollX])

  // ganttEvent가 변경될 때 토글 처리
  useEffect(() => {
    if (
      ganttEvent.action === 'select' &&
      ganttEvent.changedTask?.type === 'project'
    ) {
      setExpandedEpics((prev) => {
        const newSet = new Set(prev)
        if (newSet.has(ganttEvent.changedTask!.id)) {
          newSet.delete(ganttEvent.changedTask!.id)
        } else {
          newSet.add(ganttEvent.changedTask!.id)
        }
        return newSet
      })
    }
  }, [ganttEvent])

  useEffect(() => {
    if (ganttHeight) {
      setSvgContainerHeight(ganttHeight + headerHeight)
    } else {
      setSvgContainerHeight(filteredTasks.length * rowHeight + headerHeight)
    }
  }, [ganttHeight, filteredTasks, headerHeight, rowHeight])

  useEffect(() => {
    const { changedTask, action } = ganttEvent
    if (changedTask) {
      if (action === 'delete') {
        setGanttEvent({ action: '' })
        setBarTasks(barTasks.filter((t) => t.id !== changedTask.id))
      } else if (
        action === 'move' ||
        action === 'end' ||
        action === 'start' ||
        action === 'progress'
      ) {
        const prevStateTask = barTasks.find((t) => t.id === changedTask.id)
        if (
          prevStateTask &&
          ((prevStateTask.start?.getTime() ?? 0) !==
            (changedTask.start?.getTime() ?? 0) ||
            (prevStateTask.end?.getTime() ?? 0) !==
              (changedTask.end?.getTime() ?? 0) ||
            prevStateTask.progress !== changedTask.progress)
        ) {
          // actions for change
          const newTaskList = barTasks.map((t) =>
            t.id === changedTask.id ? changedTask : t
          )
          setBarTasks(newTaskList)
        }
      }
    }
  }, [ganttEvent, barTasks])

  useEffect(() => {
    if (failedTask) {
      setBarTasks(
        barTasks.map((t) => (t.id !== failedTask.id ? t : failedTask))
      )
      setFailedTask(null)
    }
  }, [failedTask, barTasks])

  useEffect(() => {
    if (!listCellWidth) {
      setTaskListWidth(0)
    }
    if (taskListRef.current) {
      setTaskListWidth(taskListRef.current.offsetWidth)
    }
  }, [taskListRef, listCellWidth])

  useEffect(() => {
    if (wrapperRef.current) {
      setSvgContainerWidth(wrapperRef.current.offsetWidth - taskListWidth)
    }
  }, [wrapperRef, taskListWidth])

  // scroll events
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (ignoreScrollEvent) {
        return
      }

      if (event.shiftKey || event.deltaX) {
        const scrollMove = event.deltaX ? event.deltaX : event.deltaY
        let newScrollX = scrollX + scrollMove
        if (newScrollX < 0) {
          newScrollX = 0
        } else if (newScrollX > svgWidth) {
          newScrollX = svgWidth
        }
        if (newScrollX !== scrollX) {
          setIgnoreScrollEvent(true)
          setScrollX(newScrollX)
          event.preventDefault()
          setTimeout(() => setIgnoreScrollEvent(false), 50)
        }
      } else if (ganttHeight) {
        let newScrollY = scrollY + event.deltaY
        if (newScrollY < 0) {
          newScrollY = 0
        } else if (newScrollY > ganttFullHeight - ganttHeight) {
          newScrollY = ganttFullHeight - ganttHeight
        }
        if (newScrollY !== scrollY) {
          setIgnoreScrollEvent(true)
          setScrollY(newScrollY)
          event.preventDefault()
          setTimeout(() => setIgnoreScrollEvent(false), 50)
        }
      }
    }

    // subscribe if scroll is necessary
    wrapperRef.current?.addEventListener('wheel', handleWheel, {
      passive: false,
    })
    return () => {
      wrapperRef.current?.removeEventListener('wheel', handleWheel)
    }
  }, [
    wrapperRef,
    scrollY,
    scrollX,
    ganttHeight,
    svgWidth,
    rtl,
    ganttFullHeight,
    ignoreScrollEvent,
  ])

  const handleScrollY = (event: SyntheticEvent<HTMLDivElement>) => {
    if (scrollY !== event.currentTarget.scrollTop && !ignoreScrollEvent) {
      setScrollY(event.currentTarget.scrollTop)
      setIgnoreScrollEvent(true)
    } else {
      setIgnoreScrollEvent(false)
    }
  }

  const handleScrollX = (event: SyntheticEvent<HTMLDivElement>) => {
    if (scrollX !== event.currentTarget.scrollLeft && !ignoreScrollEvent) {
      setScrollX(event.currentTarget.scrollLeft)
      setIgnoreScrollEvent(true)
    } else {
      setIgnoreScrollEvent(false)
    }
  }

  /**
   * Handles arrow keys events and transform it to new scroll
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    event.preventDefault()
    let newScrollY = scrollY
    let newScrollX = scrollX
    let isX = true
    switch (event.key) {
      case 'Down': // IE/Edge specific value
      case 'ArrowDown':
        newScrollY += rowHeight
        isX = false
        break
      case 'Up': // IE/Edge specific value
      case 'ArrowUp':
        newScrollY -= rowHeight
        isX = false
        break
      case 'Left':
      case 'ArrowLeft':
        newScrollX -= columnWidth
        break
      case 'Right': // IE/Edge specific value
      case 'ArrowRight':
        newScrollX += columnWidth
        break
    }
    if (isX) {
      if (newScrollX < 0) {
        newScrollX = 0
      } else if (newScrollX > svgWidth) {
        newScrollX = svgWidth
      }
      setScrollX(newScrollX)
    } else {
      if (newScrollY < 0) {
        newScrollY = 0
      } else if (newScrollY > ganttFullHeight - ganttHeight) {
        newScrollY = ganttFullHeight - ganttHeight
      }
      setScrollY(newScrollY)
    }
    setIgnoreScrollEvent(true)
  }

  /**
   * Task select event
   */
  const handleSelectedTask = (taskId: string) => {
    const task = barTasks.find((t) => t.id === taskId)
    if (task) {
      setSelectedTask(task)
      if (onSelect) {
        onSelect(task, true)
      }
      // 에픽인 경우 토글 처리
      if (task.type === 'project' && onExpanderClick) {
        const originalTask = filteredTasks.find((t) => t.id === task.id)
        if (originalTask) {
          onExpanderClick(originalTask)
        }
      }
    }
  }
  const handleExpanderClick = (task: Task) => {
    const epicId = task.id
    setExpandedEpics((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(epicId)) {
        newSet.delete(epicId)
      } else {
        newSet.add(epicId)
      }
      return newSet
    })
  }
  const gridProps: GridProps = {
    columnWidth,
    svgWidth,
    tasks: filteredTasks,
    rowHeight,
    dates: dateSetup.dates,
    todayColor,
    rtl,
  }
  const calendarProps: CalendarProps = {
    dateSetup,
    locale,
    viewMode,
    headerHeight,
    columnWidth,
    fontFamily,
    fontSize,
    rtl,
  }
  const barProps: TaskGanttContentProps = {
    tasks: barTasks,
    dates: dateSetup.dates,
    ganttEvent,
    selectedTask,
    rowHeight,
    taskHeight,
    columnWidth,
    arrowColor,
    timeStep,
    fontFamily,
    fontSize,
    arrowIndent,
    svgWidth,
    rtl,
    setGanttEvent,
    setFailedTask,
    setSelectedTask: handleSelectedTask,
    onDateChange,
    onProgressChange,
    onDoubleClick,
    onClick,
    onDelete,
    onExpanderClick: handleExpanderClick,
  }

  const tableProps: TaskListProps = {
    headerHeight,
    rowWidth: listCellWidth,
    fontFamily,
    fontSize,
    locale,
    tasks: filteredTasks,
    selectedTaskId: selectedTask?.id || '',
    setSelectedTask: handleSelectedTask,
    onExpanderClick: handleExpanderClick,
  }

  return (
    <div className="w-[calc(100vw-22rem)]">
      <div
        className={styles.wrapper}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        ref={wrapperRef}
      >
        {listCellWidth && <TaskList {...tableProps} />}
        <TaskGantt
          gridProps={gridProps}
          calendarProps={calendarProps}
          barProps={barProps}
          ganttHeight={ganttHeight}
          scrollY={scrollY}
          scrollX={scrollX}
        />
        {ganttEvent.changedTask && (
          <Tooltip
            arrowIndent={arrowIndent}
            rowHeight={rowHeight}
            svgContainerHeight={svgContainerHeight}
            svgContainerWidth={svgContainerWidth}
            fontFamily={fontFamily}
            fontSize={fontSize}
            scrollX={scrollX}
            scrollY={scrollY}
            task={ganttEvent.changedTask}
            headerHeight={headerHeight}
            taskListWidth={taskListWidth}
            TooltipContent={TooltipContent}
            rtl={rtl}
            svgWidth={svgWidth}
          />
        )}
        <VerticalScroll
          ganttFullHeight={ganttFullHeight}
          ganttHeight={ganttHeight}
          headerHeight={headerHeight}
          scroll={scrollY}
          onScroll={handleScrollY}
          rtl={rtl}
        />
      </div>
      <HorizontalScroll
        svgWidth={svgWidth}
        taskListWidth={taskListWidth}
        scroll={scrollX}
        rtl={rtl}
        onScroll={handleScrollX}
      />
    </div>
  )
}
