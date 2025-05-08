import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface ProjectMember {
  userId: string
  name: string
  email: string
  profileImageUrl: string
  profiles: Array<{
    stacks: string[]
    positions: string[]
    projectId: string
  }>
  role: string
}

interface Project {
  project: {
    projectId: string
    title: string
    imageUrl: string | null
  }
  profile: {
    stacks: string[]
    positions: string[]
    projectId: string
  }
  startDate: string
  endDate: string
  members: ProjectMember[]
  leader: ProjectMember
}

interface ProjectStore {
  projects: Project[]
  loading: boolean
  error: string | null
  setProjects: (projects: Project[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  fetchProjects: (accessToken: string) => Promise<void>
  getProjectById: (projectId: string) => Project | undefined
  getUserRoleInProject: (
    projectId: string,
    userEmail: string
  ) => string | undefined
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const useProjectStore = create<ProjectStore>()(
  devtools(
    (set, get) => ({
      projects: [],
      loading: false,
      error: null,
      setProjects: (projects) => set({ projects }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      fetchProjects: async (accessToken) => {
        set({ loading: true, error: null })
        try {
          const response = await fetch(`${API_BASE_URL}/project`, {
            headers: {
              Accept: '*/*',
              Authorization: `Bearer ${accessToken}`,
            },
          })

          if (!response.ok) {
            throw new Error('프로젝트 목록 불러오기 실패')
          }

          const data = await response.json()
          set({ projects: data })
        } catch (error) {
          console.error(error)
          set({
            error:
              error instanceof Error
                ? error.message
                : '알 수 없는 오류가 발생했습니다.',
          })
        } finally {
          set({ loading: false })
        }
      },
      getProjectById: (projectId) => {
        return get().projects.find(
          (project) => project.project.projectId === projectId
        )
      },
      getUserRoleInProject: (projectId, userEmail) => {
        const project = get().getProjectById(projectId)
        return project?.members.find((member) => member.email === userEmail)
          ?.role
      },
    }),
    {
      name: 'project-store',
    }
  )
)
