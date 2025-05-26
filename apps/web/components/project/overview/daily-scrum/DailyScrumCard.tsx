'use client'

import { useAuthStore } from '@/stores/useAuthStore'
import { Category, DailyScrumResponse, Task } from '@/types/project'
import { Button } from '@cm/ui/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@cm/ui/components/ui/card'
import { Skeleton } from '@cm/ui/components/ui/skeleton'
import { useEffect, useMemo, useState } from 'react'

import { ConfirmDialog } from './ConfirmDialog'
import { MemberAvatar } from './MemberAvatar'
import { TaskList } from './TaskList'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

interface DailyScrumCardProps {
  projectId: string
}

export default function DailyScrumCard({ projectId }: DailyScrumCardProps) {
  const user = useAuthStore((state) => state.user)
  const [dailyScrum, setDailyScrum] = useState<DailyScrumResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [pendingChanges, setPendingChanges] = useState<{
    todoTasks: Map<string, Task>
    doneTasks: Map<string, Task>
  }>({ todoTasks: new Map(), doneTasks: new Map() })
  const [isAdding, setIsAdding] = useState<{ [key in Category]: boolean }>({
    DONE: false,
    TODO: false,
  })
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showSwitchMemberDialog, setShowSwitchMemberDialog] = useState(false)
  const [pendingMemberId, setPendingMemberId] = useState<string | null>(null)

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
    if (isEditMode && dailyScrum) {
      const todoTasksMap = new Map(
        dailyScrum.todoTasks
          .filter((task) => task.assignee.email === selectedMemberId)
          .map((task) => [task.taskId, task])
      )
      const doneTasksMap = new Map(
        dailyScrum.doneTasks
          .filter((task) => task.assignee.email === selectedMemberId)
          .map((task) => [task.taskId, task])
      )
      setPendingChanges({ todoTasks: todoTasksMap, doneTasks: doneTasksMap })
    }
  }, [isEditMode, dailyScrum, selectedMemberId])

  const getAvailableTasksForDropdown = (
    currentTaskId: string,
    category?: Category
  ) => {
    const selectedTaskIds = new Set([
      ...Array.from(pendingChanges.todoTasks.keys()),
      ...Array.from(pendingChanges.doneTasks.keys()),
    ])

    selectedTaskIds.delete(currentTaskId)

    return tasks.filter(
      (task) =>
        task.assignee.email === selectedMemberId &&
        !selectedTaskIds.has(task.taskId) &&
        !(category === 'TODO' && task.status === 'DONE')
    )
  }

  const handleTaskChange = (prevTaskId: string, newTask: Task) => {
    const isTaskAlreadySelected =
      pendingChanges.todoTasks.has(newTask.taskId) ||
      pendingChanges.doneTasks.has(newTask.taskId)

    if (isTaskAlreadySelected && newTask.taskId !== prevTaskId) {
      setError('이미 선택된 태스크입니다.')
      return
    }

    setPendingChanges((prev) => {
      const newTodoTasks = new Map(prev.todoTasks)
      const newDoneTasks = new Map(prev.doneTasks)

      if (newTodoTasks.has(prevTaskId)) {
        newTodoTasks.delete(prevTaskId)
        newTodoTasks.set(newTask.taskId, newTask)
      }
      if (newDoneTasks.has(prevTaskId)) {
        newDoneTasks.delete(prevTaskId)
        newDoneTasks.set(newTask.taskId, newTask)
      }

      return { todoTasks: newTodoTasks, doneTasks: newDoneTasks }
    })
  }

  const handleAddTask = (category: Category, task: Task) => {
    const isTaskAlreadySelected =
      pendingChanges.todoTasks.has(task.taskId) ||
      pendingChanges.doneTasks.has(task.taskId)

    if (isTaskAlreadySelected) {
      setError('이미 선택된 태스크입니다.')
      return
    }

    setPendingChanges((prev) => {
      const newMap = new Map(
        prev[category === 'DONE' ? 'doneTasks' : 'todoTasks']
      )
      newMap.set(task.taskId, task)
      return {
        ...prev,
        [category === 'DONE' ? 'doneTasks' : 'todoTasks']: newMap,
      }
    })
    setIsAdding((prev) => ({
      ...prev,
      [category]: false,
    }))
  }

  const handleRemoveTask = (taskId: string, category: Category) => {
    setPendingChanges((prev) => {
      const newMap = new Map(
        prev[category === 'DONE' ? 'doneTasks' : 'todoTasks']
      )
      newMap.delete(taskId)
      return {
        ...prev,
        [category === 'DONE' ? 'doneTasks' : 'todoTasks']: newMap,
      }
    })
  }

  const handleSaveChanges = async () => {
    if (!user?.accessToken) {
      setError('로그인이 필요합니다.')
      return
    }

    try {
      const todoTaskIds = Array.from(pendingChanges.todoTasks.values())
        .filter((task) => task.assignee.email === selectedMemberId)
        .map((t) => t.taskId)
      const doneTaskIds = Array.from(pendingChanges.doneTasks.values())
        .filter((task) => task.assignee.email === selectedMemberId)
        .map((t) => t.taskId)

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
      setIsEditMode(false)
      setError(null)
    } catch (err) {
      console.error('태스크 저장 에러:', err)
      setError(
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
      )
    }
  }

  const handleCancelEdit = () => {
    setIsEditMode(false)
    setIsAdding({ DONE: false, TODO: false })
  }

  const handleMemberSelect = (memberEmail: string) => {
    if (isEditMode) {
      setPendingMemberId(memberEmail)
      setShowSwitchMemberDialog(true)
    } else {
      setSelectedMemberId(memberEmail)
      setIsAdding({ DONE: false, TODO: false })
    }
  }

  const handleSwitchMember = () => {
    if (pendingMemberId) {
      setSelectedMemberId(pendingMemberId)
      setIsEditMode(false)
      setIsAdding({ DONE: false, TODO: false })
      setPendingMemberId(null)
    }
    setShowSwitchMemberDialog(false)
  }

  const renderSkeleton = () => (
    <Card className="col-span-2 row-span-2">
      <CardHeader>
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[1fr_2fr_2fr] gap-2 items-start min-h-[72px]">
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="h-3 w-10" />
              </div>
            ))}
          </div>
          {[1, 2].map((i) => (
            <div key={i} className="px-2">
              <Skeleton className="h-6 w-full mb-2" />
              <div className="flex flex-col gap-2">
                {[1, 2, 3].map((j) => (
                  <Skeleton key={j} className="h-12 w-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  const isCurrentUserSelected = useMemo(
    () => selectedMemberId === user?.email,
    [selectedMemberId, user?.email]
  )

  const hasUserDailyScrum = useMemo(() => {
    if (!dailyScrum || !selectedMemberId) return false
    return (
      dailyScrum.todoTasks.some(
        (task) => task.assignee.email === selectedMemberId
      ) ||
      dailyScrum.doneTasks.some(
        (task) => task.assignee.email === selectedMemberId
      )
    )
  }, [dailyScrum, selectedMemberId])

  if (loading) return renderSkeleton()
  if (error) {
    return (
      <Card className="col-span-2 row-span-2">
        <CardHeader>
          <CardTitle>데일리 스크럼</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-red-500">{error}</div>
        </CardContent>
      </Card>
    )
  }
  if (!dailyScrum) {
    return (
      <Card className="col-span-2 row-span-2">
        <CardHeader>
          <CardTitle>데일리 스크럼</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-cm-gray">
            오늘의 데일리 스크럼을 시작해보세요.
          </div>
        </CardContent>
      </Card>
    )
  }

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

  return (
    <>
      <Card className="col-span-2 row-span-2 pt-4 min-h-72">
        <CardHeader className="flex flex-row items-center justify-between h-8">
          <CardTitle>데일리 스크럼</CardTitle>
          {isEditMode && (
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setShowConfirmDialog(true)}>
                완료
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                취소
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-[1fr_2fr_2fr] gap-2 items-start">
            <div className="grid grid-cols-2 gap-2">
              {members.map((member) => (
                <MemberAvatar
                  key={member.email}
                  member={member}
                  isSelected={selectedMemberId === member.email}
                  onClick={() => handleMemberSelect(member.email)}
                />
              ))}
            </div>

            {(['DONE', 'TODO'] as Category[]).map((category) => (
              <TaskList
                key={category}
                category={category}
                tasks={Array.from(
                  (isEditMode
                    ? pendingChanges
                    : {
                        todoTasks: new Map(
                          dailyScrum.todoTasks.map((t) => [t.taskId, t])
                        ),
                        doneTasks: new Map(
                          dailyScrum.doneTasks.map((t) => [t.taskId, t])
                        ),
                      })[
                    category === 'DONE' ? 'doneTasks' : 'todoTasks'
                  ].values()
                ).filter((task) => task.assignee.email === selectedMemberId)}
                isEditMode={isEditMode}
                isCurrentUserSelected={isCurrentUserSelected}
                hasUserDailyScrum={hasUserDailyScrum}
                isAdding={isAdding[category]}
                onAdd={handleAddTask}
                onRemove={handleRemoveTask}
                onTaskChange={handleTaskChange}
                onEdit={() => setIsEditMode(true)}
                onAddClick={() => {
                  if (!isEditMode) {
                    setIsEditMode(true)
                  }
                  setIsAdding((prev) => ({ ...prev, [category]: true }))
                }}
                onCancelAdd={() => {
                  setIsAdding((prev) => ({
                    ...prev,
                    [category]: false,
                  }))
                }}
                availableTasks={getAvailableTasksForDropdown('new', category)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title="데일리 스크럼 완료"
        description="데일리 스크럼을 완료하면 더 이상 수정할 수 없습니다. 계속하시겠습니까?"
        onConfirm={() => {
          handleSaveChanges()
          setShowConfirmDialog(false)
        }}
        confirmText="완료"
      />

      <ConfirmDialog
        open={showSwitchMemberDialog}
        onOpenChange={setShowSwitchMemberDialog}
        title="멤버 변경"
        description="데일리 스크럼이 완료되지 않았습니다. 저장하지 않고 다른 멤버로 이동하시겠습니까?"
        onConfirm={handleSwitchMember}
        confirmText="이동"
      />
    </>
  )
}
