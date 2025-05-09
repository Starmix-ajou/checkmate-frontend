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

export type ProjectDetail = {
  projectId: string
  title: string
  description: string
  startDate: string
  endDate: string
  members: Member[]
  leader: Member
  imageUrl: string
}

// 기존 Project 타입은 하위 호환성을 위해 유지
export type Project = ProjectDetail
