'use client'

import LoadingCheckMate from '@/components/LoadingCheckMate'
import Navbar from '@/components/Navbar'
import { ProjectList } from '@/components/project/home'
import ProjectAdd from '@/components/project/home/ProjectAdd'
import { useAuthStore } from '@/stores/useAuthStore'
import { ProjectListItem, ProjectStatus } from '@/types/project'
import { useEffect, useState } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

const Home = () => {
  const user = useAuthStore((state) => state.user)
  const [filter, setFilter] = useState<ProjectStatus>('')
  const [projects, setProjects] = useState<ProjectListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.accessToken) {
      return
    }
    const fetchProjects = async () => {
      setLoading(true)
      try {
        const queryParams = new URLSearchParams()
        if (filter) {
          queryParams.append('status', filter)
        }

        const response = await fetch(
          `${API_BASE_URL}/project?${queryParams.toString()}`,
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

        const data: ProjectListItem[] = await response.json()

        setProjects(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [filter, user?.accessToken])

  return (
    <>
      <Navbar setFilter={setFilter} currentFilter={filter} />
      <LoadingCheckMate size={64} loading={loading} />
      <div className="p-6 w-full max-w-7xl mx-auto">
        <div className="w-full flex justify-end">
          <ProjectAdd />
        </div>
        <ProjectList projects={projects} />
      </div>
    </>
  )
}

export default Home
