export type Profile = {
  stacks: string[]
  positions: string[]
  projectId: string
}

export type Member = {
  name: string
  email: string
  profileImageUrl: string
  profiles: Profile[]
  role: string
  pendingProjectIds: string[]
}

export type Project = {
  projectId: string
  title: string
  description: string
  startDate: string
  endDate: string
  members: Member[]
  leader: Member
}
