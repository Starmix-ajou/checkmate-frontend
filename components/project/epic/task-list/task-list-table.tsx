import { Task } from '@/types/public-types'
import React from 'react'

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
                <div className={styles.taskListExpander}>
                  {task.type === 'project' &&
                    task.hideChildren !== undefined &&
                    (task.tasks?.length ?? 0) > 0 && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation()
                          onExpanderClick(task)
                        }}
                      >
                        {task.hideChildren ? '▶' : '▼'}
                      </div>
                    )}
                </div>
                <div
                  style={{
                    fontWeight: task.type === 'project' ? 'bold' : 'normal',
                  }}
                >
                  {task.name}
                </div>
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
