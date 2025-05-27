import { Task } from '@cm/types/public-types'

export type TaskTypeInternal = 'task' | 'smalltask' | 'milestone' | 'project'

export interface BarTask extends Task {
  x1: number
  y: number
  x2: number
  index: number
  progressX: number
  progressWidth: number
  barCornerRadius: number
  handleWidth: number
  hideChildren?: boolean
  barChildren: BarTask[]
  styles: {
    backgroundColor: string
    backgroundSelectedColor: string
    progressColor: string
    progressSelectedColor: string
  }
  typeInternal: TaskTypeInternal
  height: number
}
