'use client'

import LoadingCheckMate from '@/components/LoadingCheckMate'
import { ProjectFilter, ProjectList } from '@/components/project/home'
import { useAuthStore } from '@/stores/useAuthStore'
import { Project } from '@/types/project'
import { useEffect, useState } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

const mockProjects: Project[] = [
  {
    projectId: 'mock-1',
    projectTitle: 'Mock Project 1',
    projectImageUrl: '/images/mock1.png',
    profile: {
      stacks: ['React', 'Node.js'],
      positions: ['Frontend', 'Backend'],
      projectId: 'mock-1',
    },
    startDate: '2025-01-01',
    endDate: '2025-06-30',
    members: [],
    leader: {
      name: 'Mock Leader',
      email: 'leader@example.com',
      profileImageUrl: '/images/leader.png',
      profiles: [],
      role: 'Leader',
      pendingProjectIds: [],
    },
  },
  {
    projectId: 'mock-2',
    projectTitle: 'Mock Project 2',
    projectImageUrl: '/images/mock2.png',
    profile: {
      stacks: ['Next.js', 'Django'],
      positions: ['Fullstack'],
      projectId: 'mock-2',
    },
    startDate: '2025-02-01',
    endDate: '2025-07-31',
    members: [],
    leader: {
      name: 'Mock Leader 2',
      email: 'leader2@example.com',
      profileImageUrl: '/images/leader2.png',
      profiles: [],
      role: 'Leader',
      pendingProjectIds: [],
    },
  },
]

const Home = () => {
  const user = useAuthStore((state) => state.user)
  const [filter, setFilter] = useState('ALL')
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.accessToken) {
      return
    }

    const fetchProjects = async () => {
      try {
        console.log(filter)
        const response = await fetch(
          `${API_BASE_URL}/project?status=${filter}`,
          {
            headers: {
              Accept: '*/*',
              Authorization: `Bearer ${user?.accessToken}`,
            },
          }
        )

        if (!response.ok) {
          throw new Error('프로젝트 불러오기 실패')
        }

        const data: Project[] = await response.json()

        if (data.length === 0) {
          setProjects(mockProjects)
        } else {
          setProjects(data)
        }
      } catch (error) {
        console.error(error)
        setProjects(mockProjects)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [filter, user?.accessToken])

  return (
    <>
      <LoadingCheckMate size={64} loading={loading} />
      <div className="p-6 w-full max-w-7xl mx-auto">
        <ProjectFilter setFilter={setFilter} />
        <ProjectList projects={projects} />
      </div>
    </>
  )
}

export default Home
