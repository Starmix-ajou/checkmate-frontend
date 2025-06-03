import React from 'react'

import styles from './task-list-header.module.css'

export const TaskListHeader: React.FC<{
  headerHeight: number
  rowWidth: string
  fontFamily: string
  fontSize: string
  locale: string
}> = ({ headerHeight, rowWidth, fontFamily, fontSize, locale }) => {
  return (
    <div
      className={styles.ganttTable}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
      }}
    >
      <div
        className={styles.ganttTable_Header}
        style={{
          height: headerHeight - 2,
        }}
      >
        <div
          className={styles.ganttTable_HeaderItem}
          style={{
            minWidth: '250px',
          }}
        >
          &nbsp;{locale === 'ko' ? '작업명' : 'Task Name'}
        </div>
        <div
          className={styles.ganttTable_HeaderSeparator}
          style={{
            height: headerHeight * 0.5,
            marginTop: headerHeight * 0.2,
          }}
        />
        <div
          className={styles.ganttTable_HeaderItem}
          style={{
            minWidth: '130px',
          }}
        >
          &nbsp;{locale === 'ko' ? '시작일' : 'Start Date'}
        </div>
        <div
          className={styles.ganttTable_HeaderSeparator}
          style={{
            height: headerHeight * 0.5,
            marginTop: headerHeight * 0.25,
          }}
        />
        <div
          className={styles.ganttTable_HeaderItem}
          style={{
            minWidth: '130px',
          }}
        >
          &nbsp;{locale === 'ko' ? '종료일' : 'End Date'}
        </div>
      </div>
    </div>
  )
}
