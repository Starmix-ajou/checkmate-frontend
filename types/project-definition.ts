export interface ProjectDefinitionBody {
  title: string
  description: string
  startDate: string
  endDate: string
  members: {
    email: string
    profile: {
      stacks: string[]
      positions: string[]
      projectId: string
    }
  }[]
  definitionUrl: string
} 