import React from 'react'

import { Task } from '../types/public-types'
import styles from './task-list-table.module.css'

const formatDate = (date: string | null) => {
  if (!date) return '-'
  const [year, month, day] = date.split('-')
  return `${year}. ${month}. ${day}`
}

export const TaskListTable: React.FC<{
  rowHeight: number
  rowWidth: string
  fontFamily: string
  fontSize: string
  locale: string
  tasks: Task[]
  selectedTaskId: string
  setSelectedTask: (taskId: string) => void
  onExpanderClick: (task: Task) => void
}> = ({
  rowHeight,
  rowWidth,
  tasks,
  fontFamily,
  fontSize,
  onExpanderClick,
}) => {
  return (
    <div
      className={styles.taskListWrapper}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
      }}
    >
      {tasks.map((task) => {
        const expanderSymbol = task.hideChildren ? '▶' : '▼'
        const isEpic = task.type === 'project'

        return (
          <div
            className={styles.taskListTableRow}
            style={{ height: rowHeight }}
            key={task.id}
          >
            <div
              className={styles.taskListCell}
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
              title={task.name}
            >
              <div className={styles.taskListNameWrapper}>
                {isEpic ? (
                  <div
                    className={styles.taskListExpander}
                    onClick={() => onExpanderClick(task)}
                  >
                    {expanderSymbol}
                  </div>
                ) : (
                  <div className={styles.taskListEmptyExpander} />
                )}
                <div>{task.name}</div>
              </div>
            </div>
            <div
              className={styles.taskListCell}
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
            >
              &nbsp;
              {formatDate(task.start?.toISOString().split('T')[0] || null)}
            </div>
            <div
              className={styles.taskListCell}
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
            >
              &nbsp;{formatDate(task.end?.toISOString().split('T')[0] || null)}
            </div>
          </div>
        )
      })}
    </div>
  )
}
