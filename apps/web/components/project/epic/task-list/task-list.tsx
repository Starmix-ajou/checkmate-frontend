import React from 'react'

import { Task } from '../types/public-types'
import { TaskListHeader } from './task-list-header'
import { TaskListTable } from './task-list-table'
import styles from './task-list.module.css'

export type TaskListProps = {
  headerHeight: number
  rowWidth: string
  fontFamily: string
  fontSize: string
  locale: string
  tasks: Task[]
  selectedTaskId: string
  setSelectedTask: (taskId: string) => void
  onExpanderClick: (task: Task) => void
}

export const TaskList: React.FC<TaskListProps> = ({
  headerHeight,
  rowWidth,
  tasks,
  fontFamily,
  fontSize,
  locale,
  selectedTaskId,
  setSelectedTask,
  onExpanderClick,
}) => {
  return (
    <div className={styles.taskList}>
      <TaskListHeader
        headerHeight={headerHeight}
        rowWidth={rowWidth}
        fontFamily={fontFamily}
        fontSize={fontSize}
        locale={locale}
      />
      <TaskListTable
        rowHeight={headerHeight}
        rowWidth={rowWidth}
        fontFamily={fontFamily}
        fontSize={fontSize}
        locale={locale}
        tasks={tasks}
        selectedTaskId={selectedTaskId}
        setSelectedTask={setSelectedTask}
        onExpanderClick={onExpanderClick}
      />
    </div>
  )
}
