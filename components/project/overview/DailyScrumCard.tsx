'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/useAuthStore'
import { UserIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import Select from 'react-select'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

type Category = 'Done' | 'TODO'

interface Task {
  taskId: string
  title: string
  description: string
  status: string
  assignee: {
    email: string
    name: string
    profileImageUrl: string
    profiles: {
      stacks: string[]
      positions: string[]
      projectId: string
    }[]
    role: string
  }
  startDate: string
  endDate: string
  priority: string
  epic: {
    epicId: string
    title: string
    description: string
    projectId: string
  }
}

interface DailyScrumResponse {
  dailyScrumId: string
  timestamp: string
  todoTasks: Task[]
  doneTasks: Task[]
  projectId: string
}

interface DailyScrumCardProps {
  projectId: string
}

export default function DailyScrumCard({ projectId }: DailyScrumCardProps) {
  const user = useAuthStore((state) => state.user)
  const [dailyScrum, setDailyScrum] = useState<DailyScrumResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null)
  const [selectedMemberTasks, setSelectedMemberTasks] = useState<{
    todoTasks: Task[]
    doneTasks: Task[]
  }>({ todoTasks: [], doneTasks: [] })
  const [isAdding, setIsAdding] = useState<{ [key in Category]: boolean }>({
    Done: false,
    TODO: false,
  })

  useEffect(() => {
    if (user?.email && !selectedMemberId) {
      setSelectedMemberId(user.email)
    }
  }, [user?.email, selectedMemberId])

  useEffect(() => {
    if (!user?.accessToken) return

    const fetchTasks = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/task?projectId=${projectId}&assigneeEmail=${encodeURIComponent(user.email)}`,
          {
            headers: {
              Accept: '*/*',
              Authorization: `Bearer ${user.accessToken}`,
            },
          }
        )

        if (!response.ok) {
          throw new Error('태스크 목록을 불러오는데 실패했습니다.')
        }

        const data = await response.json()
        setTasks(data)
      } catch (err) {
        console.error('태스크 목록 로딩 에러:', err)
      }
    }

    fetchTasks()
  }, [user?.accessToken, user?.email, projectId])

  useEffect(() => {
    if (!user?.accessToken || !projectId) {
      setLoading(false)
      return
    }

    const fetchDailyScrum = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `${API_BASE_URL}/daily-scrum/today?projectId=${projectId}`,
          {
            headers: {
              Accept: '*/*',
              Authorization: `Bearer ${user.accessToken}`,
            },
          }
        )

        if (!response.ok) {
          const errorData = await response.json().catch(() => null)
          throw new Error(
            errorData?.message ||
              '데일리 스크럼 데이터를 불러오는데 실패했습니다.'
          )
        }

        const data = await response.json().catch(() => ({
          dailyScrumId: '',
          timestamp: new Date().toISOString().split('T')[0],
          todoTasks: [],
          doneTasks: [],
          projectId,
        }))

        setDailyScrum(data)
        setError(null)
      } catch (err) {
        console.error('데일리 스크럼 로딩 에러:', err)
        setError(
          err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchDailyScrum()
  }, [projectId, user?.accessToken])

  useEffect(() => {
    if (!selectedMemberId || !dailyScrum) {
      setSelectedMemberTasks({ todoTasks: [], doneTasks: [] })
      return
    }

    const todoTasks = dailyScrum.todoTasks.filter(
      (task) => task.assignee.email === selectedMemberId
    )
    const doneTasks = dailyScrum.doneTasks.filter(
      (task) => task.assignee.email === selectedMemberId
    )

    setSelectedMemberTasks({ todoTasks, doneTasks })
  }, [selectedMemberId, dailyScrum])

  const handleAddTask = async (category: Category) => {
    if (!selectedTask) {
      setError('태스크를 선택해주세요.')
      return
    }

    if (!user?.accessToken) {
      setError('로그인이 필요합니다.')
      return
    }

    const isTaskAlreadyExists =
      dailyScrum?.todoTasks.some((t) => t.taskId === selectedTask.taskId) ||
      dailyScrum?.doneTasks.some((t) => t.taskId === selectedTask.taskId)

    if (isTaskAlreadyExists) {
      setError('이미 추가된 태스크입니다.')
      return
    }

    try {
      const currentUserTodoTasks =
        dailyScrum?.todoTasks.filter(
          (task) => task.assignee.email === selectedMemberId
        ) || []
      const currentUserDoneTasks =
        dailyScrum?.doneTasks.filter(
          (task) => task.assignee.email === selectedMemberId
        ) || []

      const todoTaskIds =
        category === 'TODO'
          ? [...currentUserTodoTasks.map((t) => t.taskId), selectedTask.taskId]
          : currentUserTodoTasks.map((t) => t.taskId)

      const doneTaskIds =
        category === 'Done'
          ? [...currentUserDoneTasks.map((t) => t.taskId), selectedTask.taskId]
          : currentUserDoneTasks.map((t) => t.taskId)

      const response = await fetch(
        `${API_BASE_URL}/daily-scrum?projectId=${projectId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.accessToken}`,
          },
          body: JSON.stringify({
            todoTaskIds,
            doneTaskIds,
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(
          errorData?.message || '데일리 스크럼 업데이트에 실패했습니다.'
        )
      }

      const data = await response.json()
      setDailyScrum(data)
      setSelectedTask(null)
      setIsAdding({ Done: false, TODO: false })
      setError(null)
    } catch (err) {
      console.error('태스크 추가 에러:', err)
      setError(
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
      )
    }
  }

  if (loading) return <div>로딩 중...</div>
  if (error) return <div>에러: {error}</div>
  if (!dailyScrum) return <div>데일리 스크럼 데이터가 없습니다.</div>

  const rawMembers = [
    ...dailyScrum.todoTasks.map((task) => task.assignee),
    ...dailyScrum.doneTasks.map((task) => task.assignee),
  ]

  const membersMap = new Map(rawMembers.map((m) => [m.email, m]))
  if (user) {
    membersMap.set(user.email, {
      email: user.email,
      name: user.name,
      profileImageUrl: user.image,
      profiles: [],
      role: 'MEMBER',
    })
  }

  const members = Array.from(membersMap.values()).sort((a, b) => {
    if (a.email === user?.email) return -1
    if (b.email === user?.email) return 1
    return 0
  })

  const filteredTasks = (category: Category) => {
    if (!selectedMemberId) return []
    return category === 'Done'
      ? selectedMemberTasks.doneTasks
      : selectedMemberTasks.todoTasks
  }

  const existingTaskIds = new Set([
    ...selectedMemberTasks.todoTasks.map((t) => t.taskId),
    ...selectedMemberTasks.doneTasks.map((t) => t.taskId),
  ])

  const availableTasks = tasks.filter(
    (task) =>
      !existingTaskIds.has(task.taskId) &&
      task.assignee.email === selectedMemberId
  )

  const isCurrentUserSelected = () => selectedMemberId === user?.email

  return (
    <Card className="col-span-2 row-span-2">
      <CardHeader>
        <CardTitle>데일리 스크럼</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[1fr_2fr_2fr] gap-2 items-start">
          <div className="grid grid-cols-2 gap-2">
            {members.map((member) => {
              const isSelected = selectedMemberId === member.email
              return (
                <button
                  key={member.email}
                  onClick={() => {
                    setSelectedMemberId(member.email)
                    setSelectedTask(null)
                    setIsAdding({ Done: false, TODO: false })
                  }}
                  className="flex flex-col items-center gap-1"
                >
                  <Avatar
                    className={`w-10 h-10 transition-all bg-cm-light ${
                      isSelected
                        ? 'ring-2 ring-cm'
                        : 'opacity-50 hover:opacity-100'
                    }`}
                  >
                    <AvatarImage
                      src={member.profileImageUrl}
                      alt={member.name}
                    />
                    <AvatarFallback>
                      <UserIcon className="w-4 h-4 text-gray-400" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-center">{member.name}</span>
                </button>
              )
            })}
          </div>

          {(['Done', 'TODO'] as Category[]).map((category) => (
            <div key={category} className="px-2">
              <div
                className={`text-center text-sm font-semibold py-1 rounded ${
                  category === 'Done'
                    ? 'text-cm-green bg-cm-green-light'
                    : 'text-cm-gray bg-cm-gray-light'
                }`}
              >
                {category === 'Done' ? '어제 한 일' : '오늘 할 일'}
              </div>
              <div className="mt-2 flex flex-col gap-2">
                {filteredTasks(category).map((task) => (
                  <Card
                    key={task.taskId}
                    className="text-sm px-2 py-2 shadow-none rounded-md"
                  >
                    {task.title}
                  </Card>
                ))}
                {isAdding[category] && isCurrentUserSelected() ? (
                  <div className="flex flex-col gap-2 mt-1">
                    <Select
                      options={availableTasks}
                      getOptionLabel={(option) => option.title}
                      getOptionValue={(option) => option.taskId}
                      value={selectedTask}
                      onChange={(newValue) => setSelectedTask(newValue)}
                      placeholder="태스크 선택"
                      className="text-sm"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAddTask(category)}
                        disabled={!selectedTask}
                      >
                        추가
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedTask(null)
                          setIsAdding((prev) => ({
                            ...prev,
                            [category]: false,
                          }))
                        }}
                      >
                        취소
                      </Button>
                    </div>
                  </div>
                ) : isCurrentUserSelected() ? (
                  <button
                    onClick={() =>
                      setIsAdding((prev) => ({ ...prev, [category]: true }))
                    }
                    className="text-sm text-gray-500 hover:underline text-left"
                  >
                    + Add
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
