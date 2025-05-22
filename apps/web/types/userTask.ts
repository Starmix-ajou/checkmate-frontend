import { Profile } from './project'

export type Sprint = {
  sprintId: string
  title: string
  description: string
  sequence: number
  projectId: string
  startDate: string
  endDate: string
}

export type Epic = {
  epicId: string
  title: string
  description: string
  projectId: string
  sprint: Sprint
}

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
    profiles: Profile[]
    role: string
  }
  startDate: string
  endDate: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  epic: Epic
}

export type TaskCreateRequest = {
  title: string
  description: string
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
  assigneeEmail: string
  startDate: string
  endDate: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  projectId: string
  epicId: string
}

export type ColumnType = 'todo' | 'inProgress' | 'done'
