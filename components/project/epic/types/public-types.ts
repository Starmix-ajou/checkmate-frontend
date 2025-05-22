export type TaskType = 'task' | 'project' | 'milestone'

export type Task = {
  id: string
  name: string
  start: Date | null
  end: Date | null
  progress: number
  type: TaskType
  hideChildren?: boolean
  project?: string
  dependencies?: string[]
  styles?: {
    backgroundColor?: string
    backgroundSelectedColor?: string
    progressColor?: string
    progressSelectedColor?: string
  }
}
