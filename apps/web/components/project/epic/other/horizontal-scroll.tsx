import React, { SyntheticEvent, useEffect, useRef } from 'react'

import styles from './horizontal-scroll.module.css'

export const HorizontalScroll: React.FC<{
  scroll: number
  svgWidth: number
  taskListWidth: number
  rtl: boolean
  onScroll: (event: SyntheticEvent<HTMLDivElement>) => void
}> = ({ scroll, svgWidth, taskListWidth, rtl, onScroll }) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scroll
    }
  }, [scroll])

  return (
    <div
      dir="ltr"
      style={{
        margin: '0px 0px 0px 510px',
      }}
      className={styles.scrollWrapper}
      onScroll={onScroll}
      ref={scrollRef}
    >
      <div style={{ width: svgWidth }} className={styles.scroll} />
    </div>
  )
}
