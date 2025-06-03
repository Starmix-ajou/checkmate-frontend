export type Profile = {
  positions: string[]
  projectId: string
  role: string
  isActive: boolean
}

export type Member = {
  userId: string
  name: string
  email: string
  profileImageUrl: string
  profile: Profile
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
  epics: {
    epicId: string
    title: string
    description: string
    projectId: string
  }[]
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
    profiles: Profile[]
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
    sprint?: {
      sprintId: string
      title: string
      description: string
      sequence: number
      projectId: string
      startDate: string
      endDate: string
      epics: {
        epicId: string
        title: string
        description: string
        projectId: string
        featureId: string
        startDate: string
        endDate: string
      }[]
    }
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

export type ProjectBrief = {
  projectId: string
  title: string
  description: string
}
