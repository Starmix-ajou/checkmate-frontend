import { Task } from '@cm/types/userTask'

export interface BarTask extends Task {
  index: number
  x1: number
  x2: number
  y: number
  height: number
  progressX: number
  progressWidth: number
  barCornerRadius: number
  handleWidth: number
  hideChildren?: boolean
  barChildren: BarTask[]
  typeInternal: string
  barColor: string
  progressColor: string
  styles?: {
    backgroundColor: string
    backgroundSelectedColor: string
    progressColor: string
    progressSelectedColor: string
  }
}
