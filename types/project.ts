export type Profile = {
  stacks: string[]
  positions: string[]
  projectId: string
}

export type Member = {
  userId: string
  name: string
  email: string
  profileImageUrl: string
  profiles: Profile[]
  role: string
}

export type ProjectSummary = {
  projectId: string
  title: string
  imageUrl: string
}

export type ProjectListItem = {
  project: ProjectSummary
  profile: Profile
  startDate: string
  endDate: string
  members: Member[]
  leader: Member
}

export type Project = {
  projectId: string
  title: string
  description: string
  startDate: string
  endDate: string
  members: Member[]
  leader: Member
  imageUrl: string
}

export type ProjectStatus = '' | 'ACTIVE' | 'ARCHIVED' | 'PENDING'

export interface Task {
  taskId: string
  title: string
  description: string
  status: string
  assignee: {
    email: string
    name: string
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
  priority: string
  epic: {
    epicId: string
    title: string
    description: string
    projectId: string
  }
}

export interface DailyScrumResponse {
  dailyScrumId: string
  timestamp: string
  todoTasks: Task[]
  doneTasks: Task[]
  projectId: string
}

export type Category = 'DONE' | 'TODO'
