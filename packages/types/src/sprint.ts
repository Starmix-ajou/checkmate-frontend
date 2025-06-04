import { Task } from "./project"

export type IncompletedTask = {
  id: number
  title: string
  position: string
  selected: boolean
  taskId: string
}

export interface Epic {
  epicId: string
  title: string
  description: string
  projectId: string
  featureId: string
  startDate: string
  endDate: string
}

export interface Sprint {
  sprintId: string
  title: string
  description: string
  sequence: number
  projectId: string
  startDate: string
  endDate: string
  epics: Epic[]
}

export type SprintResponse = {
  epic: {
    epicId: string
    title: string
    description: string
    projectId: string
    featureId: string
    startDate: string | null
    endDate: string | null
  }
  tasks: {
    taskId: string | null
    title: string
    description: string
    status: string
    assignee: {
      userId: string
      name: string
      email: string
      profileImageUrl: string
      profiles: Array<{
        positions: string[]
        projectId: string
        role: string
      }>
    }
    startDate: string
    endDate: string
    priority: string
    epic: {
      epicId: string
      title: string
      description: string
      projectId: string
      featureId: string
      startDate: string | null
      endDate: string | null
    }
  }[]
}

export type TaskResponse = {
  taskId: string
  title: string
  assignee?: {
    profiles?: Array<{
      positions?: string[]
    }>
  }
}

export type TaskRow = {
  title: string
  position: string
  assignee: string
  startDate: string
  endDate: string
  description?: string
  priority?: string
  status?: string
}

export type SprintUpdateRequest = {
  epicId: string
  tasks: {
    title: string
    description: string
    status: string
    assigneeEmail: string
    startDate: string
    endDate: string
    priority: string
  }[]
}
