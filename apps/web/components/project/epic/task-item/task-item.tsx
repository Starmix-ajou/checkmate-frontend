import { BarTask } from '@cm/types/bar-task'
import { GanttEvent } from '@cm/types/gantt-task-actions'
import React, { useEffect, useRef, useState } from 'react'

import { Bar } from './bar/bar'
import styles from './task-item.module.css'

export type TaskItemProps = {
  task: BarTask
  arrowIndent: number
  taskHeight: number
  isProgressChangeable: boolean
  isDateChangeable: boolean
  isDelete: boolean
  onEventStart: (
    action: GanttEvent['action'],
    task: BarTask,
    event?: React.MouseEvent | React.KeyboardEvent
  ) => void
  isSelected: boolean
  rtl: boolean
  svg?: React.RefObject<SVGSVGElement | null>
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  arrowIndent,
  taskHeight,
  isDelete,
  isProgressChangeable,
  isDateChangeable,
  onEventStart,
  isSelected,
  rtl,
}) => {
  const textRef = useRef<SVGTextElement>(null)
  const [isTextInside, setIsTextInside] = useState(true)

  useEffect(() => {
    if (textRef.current) {
      const textWidth = textRef.current.getComputedTextLength()
      const barWidth = task.x2 - task.x1
      setIsTextInside(textWidth < barWidth)
    }
  }, [task.name, task.x1, task.x2])

  const getX = () => {
    const width = task.x2 - task.x1
    const hasChild = task.barChildren.length > 0
    if (isTextInside) {
      return task.x1 + width * 0.5
    }
    if (rtl && textRef.current) {
      return (
        task.x1 -
        textRef.current.getBBox().width -
        arrowIndent * +hasChild -
        arrowIndent * 0.2
      )
    } else {
      return task.x1 + width + arrowIndent * +hasChild + arrowIndent * 0.2
    }
  }

  return (
    <g>
      <Bar
        task={task}
        arrowIndent={arrowIndent}
        taskHeight={taskHeight}
        isDelete={isDelete}
        isProgressChangeable={isProgressChangeable}
        isDateChangeable={isDateChangeable}
        onEventStart={onEventStart}
        isSelected={isSelected}
        rtl={rtl}
      />
      <text
        ref={textRef}
        x={getX()}
        y={task.y + task.height * 0.5}
        className={`${styles.barLabel} ${!isTextInside ? styles.barLabelOutside : ''}`}
        dominantBaseline="middle"
        textAnchor={isTextInside ? 'middle' : 'start'}
        fill={isTextInside ? '#fff' : '#333'}
        style={{ pointerEvents: 'none' }}
      >
        {task.name}
      </text>
    </g>
  )
}
