export type Epic = {
  epicId: string
  title: string
  description: string
  startDate: string
  endDate: string
  sprint: {
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
  tasks: {
    taskId: string
    title: string
    description: string
    status: 'TODO' | 'IN_PROGRESS' | 'DONE'
    assignee: {
      userId: string
      name: string
      email: string
      profileImageUrl: string
      profiles: {
        positions: string[]
        projectId: string
        role: string
      }[]
    }
    startDate: string
    endDate: string
    priority: 'HIGH' | 'MEDIUM' | 'LOW'
    epic: {
      epicId: string
      title: string
      description: string
      projectId: string
      featureId: string
      startDate: string
      endDate: string
    }
  }[]
}
