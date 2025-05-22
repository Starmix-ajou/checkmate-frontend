import { Profile } from './project'

export interface ProjectDefinitionBody {
  title: string
  description: string
  startDate: string
  endDate: string
  members: {
    email: string
    profile: Profile
  }[]
  definitionUrl: string
}
