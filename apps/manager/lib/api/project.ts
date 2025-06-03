import { Member, ProjectListItem as BaseProjectListItem, ProjectStatus } from '@cm/types/project'

export interface ProjectListItem extends BaseProjectListItem {
  members: Member[]
  leader: Member
}

export const getProjects = async (
  accessToken: string,
  status?: ProjectStatus
): Promise<ProjectListItem[]> => {
  const queryParams = new URLSearchParams()
  if (status) {
    queryParams.append('status', status)
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/manager/project?${queryParams.toString()}`,
    {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error('프로젝트 불러오기 실패')
  }

  const data = await response.json()
  
  return data.map((item: any) => ({
    ...item,
    members: item.members.map((member: any) => ({
      ...member,
      profile: member.profiles[0]
    })),
    leader: {
      ...item.leader,
      profile: item.leader.profiles[0]
    }
  }))
} 