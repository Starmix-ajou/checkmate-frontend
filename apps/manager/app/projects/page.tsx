'use client'

import { useAuth } from '@/providers/AuthProvider'
import { ProjectListItem, ProjectStatus } from '@cm/types/project'
import { BaseNavbar } from '@cm/ui/components/common/BaseNavbar'
import LoadingScreen from '@cm/ui/components/common/LoadingScreen'
import { ProjectList } from '@cm/ui/components/project'
import { useEffect, useState } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

const Home = () => {
  const { user, signOut } = useAuth()
  const [filter, setFilter] = useState<ProjectStatus>('')
  const [projects, setProjects] = useState<ProjectListItem[]>([])
  const [loading, setLoading] = useState(true)

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter as ProjectStatus)
  }

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
      <BaseNavbar
        user={user}
        onSignOut={signOut}
        showSidebarTrigger={false}
        showFilters={true}
        setFilter={handleFilterChange}
        currentFilter={filter}
      />
      <LoadingScreen size={64} loading={loading} />
      <div className="p-6 w-full max-w-7xl mx-auto">
        <ProjectList projects={projects} />
      </div>
    </>
  )
}

export default Home
