export type Task = {
  taskId: string
  title: string
  description?: string
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
  assignee: {
    userId: string
    name: string
    email: string
    profileImageUrl: string
    profiles: {
      stacks: string[]
      positions: string[]
      projectId: string
    }[]
    role: string
  }
  startDate: string
  endDate: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  epic: {
    epicId: string
    title: string
    description: string
    projectId: string
  }
}

export type ColumnType = 'todo' | 'inProgress' | 'done'
