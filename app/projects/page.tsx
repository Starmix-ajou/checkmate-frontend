'use client'

import { useState } from 'react'
import { ProjectFilter, ProjectList } from '@/components/project/home'

const initialProjects = [
  {
    id: 1,
    name: 'Starmix',
    status: 'ongoing',
    startDate: '2025-03-01',
    endDate: '2025-06-30',
  },
  {
    id: 2,
    name: 'Haribo',
    status: 'completed',
    startDate: '2021-01-15',
    endDate: '2021-09-30',
  },
  {
    id: 3,
    name: 'CheckMate',
    status: 'ongoing',
    startDate: '2025-01-10',
    endDate: '2025-06-30',
  },
]

type Project = {
  id: number
  name: string
  status: string
  startDate: string
  endDate: string
}

const Home = () => {
  const [filter, setFilter] = useState('all')

  const [projects] = useState<Project[]>(initialProjects)

  const filteredProjects = projects.filter(
    (project) => filter === 'all' || project.status === filter
  )

  return (
    <div className="p-6 w-full max-w-7xl mx-auto">
      <ProjectFilter setFilter={setFilter} />
      <ProjectList filter={filter} projects={filteredProjects} />
    </div>
  )
}

export default Home
