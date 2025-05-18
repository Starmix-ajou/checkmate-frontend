import { Member } from './project'

export type Meeting = {
  meetingId: string
  title: string
  content: string
  participants: Member[]
  master: Member
  projectId: string
  timestamp: string
}
