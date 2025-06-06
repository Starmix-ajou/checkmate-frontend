import React from 'react'

import styles from './bar-display.module.css'

export type BarDisplayProps = {
  x: number
  y: number
  width: number
  height: number
  progressX: number
  progressWidth: number
  barCornerRadius: number
  styles: {
    backgroundColor: string
    progressColor: string
  }
  isSelected: boolean
  onMouseDown: (event: React.MouseEvent<SVGPolygonElement, MouseEvent>) => void
  onClick?: (event: React.MouseEvent<SVGPolygonElement, MouseEvent>) => void
}

export const BarDisplay: React.FC<BarDisplayProps> = ({
  x,
  y,
  width,
  height,
  progressX,
  progressWidth,
  barCornerRadius,
  styles: { backgroundColor, progressColor },
  isSelected,
  onMouseDown,
  onClick,
}) => {
  return (
    <g onMouseDown={onMouseDown} onClick={onClick}>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={barCornerRadius}
        ry={barCornerRadius}
        fill={backgroundColor}
        style={{ fill: backgroundColor }}
      />
      <rect
        x={progressX}
        y={y}
        width={progressWidth}
        height={height}
        rx={barCornerRadius}
        ry={barCornerRadius}
        fill={progressColor}
        style={{ fill: progressColor }}
      />
    </g>
  )
}
