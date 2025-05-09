'use client'

import LoadingCheckMate from '@/components/LoadingCheckMate'
import { ProjectFilter, ProjectList } from '@/components/project/home'
import { useAuthStore } from '@/stores/useAuthStore'
import { ProjectListItem, ProjectStatus } from '@/types/project'
import { signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
const LOADING_TIMEOUT = 10000

const Home = () => {
  const user = useAuthStore((state) => state.user)
  const [filter, setFilter] = useState<ProjectStatus>('')
  const [projects, setProjects] = useState<ProjectListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.accessToken) {
      return
    }

    const loadingTimeout = setTimeout(() => {
      if (loading) {
        console.error('응답이 지연되고 있어 로그인 페이지로 이동합니다.')
        signOut({ callbackUrl: '/login' })
      }
    }, LOADING_TIMEOUT)

    const fetchProjects = async () => {
      try {
        const queryParams = new URLSearchParams()
        if (filter) {
          queryParams.append('status', filter)
        }

        const response = await fetch(`${API_BASE_URL}/project?${queryParams.toString()}`, {
          headers: {
            Accept: '*/*',
            Authorization: `Bearer ${user?.accessToken}`,
          },
        })

        if (!response.ok) {
          throw new Error('프로젝트 불러오기 실패')
        }

        const data: ProjectListItem[] = await response.json()

        setProjects(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
        clearTimeout(loadingTimeout)
      }
    }

    fetchProjects()

    return () => {
      clearTimeout(loadingTimeout)
    }
  }, [filter, user?.accessToken, loading])

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
