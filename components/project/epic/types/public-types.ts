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
  tasks?: {
    taskId: string
    title: string
    startDate: string | null
    endDate: string | null
  }[]
  styles?: {
    backgroundColor?: string
    backgroundSelectedColor?: string
    progressColor?: string
    progressSelectedColor?: string
  }
}
