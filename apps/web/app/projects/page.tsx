'use client'

import { Navbar } from '@/components/Navbar'
import { useAuth } from '@/providers/AuthProvider'
import { getProjects } from '@cm/api/project'
import { ProjectListItem, ProjectStatus } from '@cm/types/project'
import LoadingScreen from '@cm/ui/components/common/LoadingScreen'
import { ProjectList } from '@cm/ui/components/project'
import ProjectAdd from '@cm/ui/components/project/ProjectAdd'
import { Trophy } from 'lucide-react'
import Link from 'next/link'
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
      <Navbar
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

      <Link
        href="/projects/leaderboard"
        className="fixed bottom-8 right-8 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 group"
      >
        <Trophy aria-hidden="true" className="w-8 h-8" />
        <span className="font-medium hidden sm:inline-block">리더보드</span>
      </Link>
    </>
  )
}

export default Home
