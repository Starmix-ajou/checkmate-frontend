import { handleTaskBySVGMouseEvent } from '@/helpers/bar-helper'
import { isKeyboardEvent } from '@/helpers/other-helper'
import { BarTask } from '@cm/types/bar-task'
import {
  BarMoveAction,
  GanttContentMoveAction,
  GanttEvent,
} from '@cm/types/gantt-task-actions'
import { EventOption } from '@cm/types/public-types'
import React, { useEffect, useState } from 'react'

import { Arrow } from '../other/arrow'
import { TaskItem } from '../task-item/task-item'

const BAR_COLORS = ['#5585F7', '#F26673', '#FDB748', '#24CD79']

// 색상의 투명도를 80%로 설정하는 함수
const setOpacity = (color: string) => {
  return color + 'CC' // CC는 16진수로 80% 투명도를 의미
}

export type TaskGanttContentProps = {
  tasks: BarTask[]
  dates: Date[]
  ganttEvent: GanttEvent
  selectedTask: BarTask | undefined
  rowHeight: number
  columnWidth: number
  timeStep: number
  svg?: React.RefObject<SVGSVGElement | null>
  svgWidth: number
  taskHeight: number
  arrowColor: string
  arrowIndent: number
  fontSize: string
  fontFamily: string
  rtl: boolean
  setGanttEvent: (value: GanttEvent) => void
  setFailedTask: (value: BarTask | null) => void
  setSelectedTask: (taskId: string) => void
} & EventOption

export const TaskGanttContent: React.FC<TaskGanttContentProps> = ({
  tasks,
  dates,
  ganttEvent,
  selectedTask,
  rowHeight,
  columnWidth,
  timeStep,
  svg,
  taskHeight,
  arrowColor,
  arrowIndent,
  fontFamily,
  fontSize,
  rtl,
  setGanttEvent,
  setFailedTask,
  setSelectedTask,
  onDateChange,
  onProgressChange,
  onDoubleClick,
  onClick,
  onDelete,
}) => {
  const point = svg?.current?.createSVGPoint()
  const [xStep, setXStep] = useState(0)
  const [initEventX1Delta, setInitEventX1Delta] = useState(0)
  const [isMoving, setIsMoving] = useState(false)

  // create xStep
  useEffect(() => {
    const dateDelta =
      dates[1].getTime() -
      dates[0].getTime() -
      dates[1].getTimezoneOffset() * 60 * 1000 +
      dates[0].getTimezoneOffset() * 60 * 1000
    const newXStep = (timeStep * columnWidth) / dateDelta
    setXStep(newXStep)
  }, [columnWidth, dates, timeStep])

  useEffect(() => {
    const handleMouseMove = async (event: MouseEvent) => {
      if (!ganttEvent.changedTask || !point || !svg?.current) return
      event.preventDefault()

      point.x = event.clientX
      const cursor = point.matrixTransform(
        svg?.current.getScreenCTM()?.inverse()
      )

      const { isChanged, changedTask } = handleTaskBySVGMouseEvent(
        cursor.x,
        ganttEvent.action as BarMoveAction,
        ganttEvent.changedTask,
        xStep,
        timeStep,
        initEventX1Delta,
        rtl
      )
      if (isChanged) {
        setGanttEvent({ action: ganttEvent.action, changedTask })
      }
    }

    const handleMouseUp = async (event: MouseEvent) => {
      const { action, originalSelectedTask, changedTask } = ganttEvent
      if (!changedTask || !point || !svg?.current || !originalSelectedTask)
        return
      event.preventDefault()

      point.x = event.clientX
      const cursor = point.matrixTransform(
        svg?.current.getScreenCTM()?.inverse()
      )
      const { changedTask: newChangedTask } = handleTaskBySVGMouseEvent(
        cursor.x,
        action as BarMoveAction,
        changedTask,
        xStep,
        timeStep,
        initEventX1Delta,
        rtl
      )

      const isNotLikeOriginal =
        originalSelectedTask.start !== newChangedTask.start ||
        originalSelectedTask.end !== newChangedTask.end ||
        originalSelectedTask.progress !== newChangedTask.progress

      // remove listeners
      svg.current.removeEventListener('mousemove', handleMouseMove)
      svg.current.removeEventListener('mouseup', handleMouseUp)
      setGanttEvent({ action: '' })
      setIsMoving(false)

      // custom operation start
      let operationSuccess = true
      if (
        (action === 'move' || action === 'end' || action === 'start') &&
        onDateChange &&
        isNotLikeOriginal
      ) {
        try {
          const result = await onDateChange(
            newChangedTask,
            newChangedTask.barChildren
          )
          if (result !== undefined) {
            operationSuccess = result
          }
        } catch (error) {
          operationSuccess = false
          console.error('에러 발생:', error)
        }
      } else if (onProgressChange && isNotLikeOriginal) {
        try {
          const result = await onProgressChange(
            newChangedTask,
            newChangedTask.barChildren
          )
          if (result !== undefined) {
            operationSuccess = result
          }
        } catch (error) {
          operationSuccess = false
          console.error('에러 발생:', error)
        }
      }

      // If operation is failed - return old state
      if (!operationSuccess) {
        setFailedTask(originalSelectedTask)
      }
    }

    if (
      !isMoving &&
      (ganttEvent.action === 'move' ||
        ganttEvent.action === 'end' ||
        ganttEvent.action === 'start' ||
        ganttEvent.action === 'progress') &&
      svg?.current
    ) {
      svg.current.addEventListener('mousemove', handleMouseMove)
      svg.current.addEventListener('mouseup', handleMouseUp)
      setIsMoving(true)
    }
  }, [
    ganttEvent,
    xStep,
    initEventX1Delta,
    onProgressChange,
    timeStep,
    onDateChange,
    svg,
    isMoving,
    point,
    rtl,
    setFailedTask,
    setGanttEvent,
  ])

  const handleBarEventStart = (
    action: GanttEvent['action'],
    selectedTask: BarTask,
    event?: React.MouseEvent | React.KeyboardEvent
  ) => {
    if (action === 'delete') {
      if (onDelete) {
        onDelete(selectedTask)
      }
      return
    }

    if (action === 'select') {
      if (onClick) {
        onClick(selectedTask)
      }
      setSelectedTask(selectedTask.id)
      return
    }

    if (action === 'dblclick') {
      if (onDoubleClick) {
        onDoubleClick(selectedTask)
      }
      return
    }

    if (action === 'progress' && onProgressChange) {
      onProgressChange(selectedTask, selectedTask.barChildren)
      return
    }

    if (action === 'move' && onDateChange) {
      onDateChange(selectedTask, selectedTask.barChildren)
      return
    }
  }

  const getY = (task: BarTask) => {
    const y = task.index * rowHeight
    return y + rowHeight / 2
  }

  // 에픽의 색상을 저장하는 Map
  const epicColors = new Map<string, string>()

  return (
    <g className="content">
      <g className="arrows" fill={arrowColor} stroke={arrowColor}>
        {tasks.map((task) => {
          return task.barChildren.map((child) => {
            return (
              <Arrow
                key={`Arrow from ${task.id} to ${tasks[child.index].id}`}
                taskFrom={task}
                taskTo={tasks[child.index]}
                rowHeight={rowHeight}
                taskHeight={taskHeight}
                arrowIndent={arrowIndent}
                rtl={rtl}
              />
            )
          })
        })}
      </g>
      <g className="bar" fontFamily={fontFamily} fontSize={fontSize}>
        {tasks.map((task, index) => {
          let colorIndex = index % BAR_COLORS.length
          let color = BAR_COLORS[colorIndex]

          // 에픽인 경우 색상을 저장
          if (task.typeInternal === 'project') {
            epicColors.set(task.id, color)
          }
          // 태스크인 경우 해당 에픽의 색상을 사용
          else if (task.project) {
            const epicColor = epicColors.get(task.project)
            if (epicColor) {
              color = setOpacity(epicColor)
            }
          }

          const taskWithColor = {
            ...task,
            barColor: color,
            progressColor: color,
            styles: {
              backgroundColor: color,
              backgroundSelectedColor: color,
              progressColor: color,
              progressSelectedColor: color,
            },
          }
          return (
            <TaskItem
              task={taskWithColor}
              arrowIndent={arrowIndent}
              taskHeight={taskHeight}
              isProgressChangeable={!!onProgressChange && !task.isDisabled}
              isDateChangeable={!!onDateChange && !task.isDisabled}
              isDelete={!task.isDisabled}
              onEventStart={handleBarEventStart}
              key={task.id}
              isSelected={!!selectedTask && task.id === selectedTask.id}
              rtl={rtl}
              svg={svg}
            />
          )
        })}
      </g>
    </g>
  )
}
