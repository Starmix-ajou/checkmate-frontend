'use client'

import { useAuth } from '@/providers/AuthProvider'
import { getProjects } from '@cm/api/project'
import { ProjectListItem, ProjectStatus } from '@cm/types/project'
import { BaseNavbar } from '@cm/ui/components/common/BaseNavbar'
import LoadingScreen from '@cm/ui/components/common/LoadingScreen'
import { ProjectList } from '@cm/ui/components/project'
import ProjectAdd from '@cm/ui/components/project/ProjectAdd'
import { useEffect, useState } from 'react'

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
        const data = await getProjects(user.accessToken, filter)
        setProjects(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [filter, user?.accessToken, user?.email])

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
        <div className="w-full flex justify-end">
          <ProjectAdd />
        </div>
        <ProjectList projects={projects} />
      </div>
    </>
  )
}

export default Home
