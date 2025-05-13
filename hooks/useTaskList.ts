import { useEffect, useState } from 'react'

type Task = {
  id: string
  title: string
  description: string
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  assignee?: {
    id: string
    email: string
    name: string
  }
  epic?: {
    id: string
    title: string
  }
  sprint?: {
    id: string
    title: string
  }
}

type FilterOption = {
  priority: Task['priority'] | 'ALL'
  epicTitle: string
  sprint: string
  assigneeEmails: string[]
}

export const useTaskList = (projectId: string) => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterOption>({
    priority: 'ALL',
    epicTitle: '',
    sprint: '',
    assigneeEmails: [],
  })

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      params.append('projectId', projectId)
      if (filters.priority !== 'ALL') {
        params.append('priority', filters.priority)
      }
      if (filters.epicTitle) {
        params.append('epicTitle', filters.epicTitle)
      }
      if (filters.sprint) {
        params.append('sprint', filters.sprint)
      }
      if (filters.assigneeEmails.length > 0) {
        filters.assigneeEmails.forEach((email) => {
          params.append('assigneeEmails', email)
        })
      }

      const response = await fetch(`/api/tasks?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch tasks')
      }
      const data = await response.json()
      setTasks(data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [filters, projectId])

  return {
    tasks,
    loading,
    filters,
    setFilters,
    refetch: fetchTasks,
  }
}
