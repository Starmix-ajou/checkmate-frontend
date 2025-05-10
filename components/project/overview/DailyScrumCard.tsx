'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuthStore } from '@/stores/useAuthStore'
import { Category, DailyScrumResponse, Task } from '@/types/project'
import { Pencil, Trash2, UserIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import Select from 'react-select'

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
    todoTasks: Task[]
    doneTasks: Task[]
  }>({ todoTasks: [], doneTasks: [] })
  const [isAdding, setIsAdding] = useState<{ [key in Category]: boolean }>({
    Done: false,
    TODO: false,
  })
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

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
    if (isEditMode && dailyScrum) {
      const todoTasks = dailyScrum.todoTasks.filter(
        (task) => task.assignee.email === selectedMemberId
      )
      const doneTasks = dailyScrum.doneTasks.filter(
        (task) => task.assignee.email === selectedMemberId
      )
      setPendingChanges({ todoTasks, doneTasks })
    }
  }, [isEditMode, dailyScrum, selectedMemberId])

  const getAvailableTasksForDropdown = (currentTaskId: string) => {
    const selectedTaskIds = new Set([
      ...pendingChanges.todoTasks.map((task) => task.taskId),
      ...pendingChanges.doneTasks.map((task) => task.taskId),
    ])

    selectedTaskIds.delete(currentTaskId)

    return tasks.filter(
      (task) =>
        task.assignee.email === selectedMemberId &&
        !selectedTaskIds.has(task.taskId)
    )
  }

  const handleTaskChange = (taskId: string, newTask: Task) => {
    const isTaskAlreadySelected = [
      ...pendingChanges.todoTasks,
      ...pendingChanges.doneTasks,
    ].some((task) => task.taskId === newTask.taskId && task.taskId !== taskId)

    if (isTaskAlreadySelected) {
      setError('이미 선택된 태스크입니다.')
      return
    }

    setPendingChanges((prev) => ({
      ...prev,
      todoTasks: prev.todoTasks.map((task) =>
        task.taskId === taskId ? newTask : task
      ),
      doneTasks: prev.doneTasks.map((task) =>
        task.taskId === taskId ? newTask : task
      ),
    }))
  }

  const handleAddTask = (category: Category, task: Task) => {
    const isTaskAlreadySelected = [
      ...pendingChanges.todoTasks,
      ...pendingChanges.doneTasks,
    ].some((t) => t.taskId === task.taskId)

    if (isTaskAlreadySelected) {
      setError('이미 선택된 태스크입니다.')
      return
    }

    setPendingChanges((prev) => ({
      ...prev,
      [category === 'Done' ? 'doneTasks' : 'todoTasks']: [
        ...prev[category === 'Done' ? 'doneTasks' : 'todoTasks'],
        task,
      ],
    }))
    setIsAdding((prev) => ({
      ...prev,
      [category]: false,
    }))
  }

  const handleRemoveTask = (taskId: string, category: Category) => {
    setPendingChanges((prev) => ({
      ...prev,
      [category === 'Done' ? 'doneTasks' : 'todoTasks']: prev[
        category === 'Done' ? 'doneTasks' : 'todoTasks'
      ].filter((task) => task.taskId !== taskId),
    }))
  }

  const handleSaveChanges = async () => {
    if (!user?.accessToken) {
      setError('로그인이 필요합니다.')
      return
    }

    try {
      const todoTaskIds = pendingChanges.todoTasks
        .filter((task) => task.assignee.email === selectedMemberId)
        .map((t) => t.taskId)
      const doneTaskIds = pendingChanges.doneTasks
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
    setIsAdding({ Done: false, TODO: false })
  }

  const renderSkeleton = () => (
    <Card className="col-span-2 row-span-2">
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[1fr_2fr_2fr] gap-2 items-start">
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
          {[1, 2].map((i) => (
            <div key={i} className="px-2">
              <Skeleton className="h-6 w-full mb-2" />
              <div className="flex flex-col gap-2">
                {[1, 2, 3].map((j) => (
                  <Skeleton key={j} className="h-10 w-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

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
          <div className="text-sm text-gray-500">
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

  const isCurrentUserSelected = () => selectedMemberId === user?.email
  const hasUserDailyScrum = () => {
    if (!dailyScrum || !selectedMemberId) return false
    return (
      dailyScrum.todoTasks.some(
        (task) => task.assignee.email === selectedMemberId
      ) ||
      dailyScrum.doneTasks.some(
        (task) => task.assignee.email === selectedMemberId
      )
    )
  }

  return (
    <>
      <Card className="col-span-2 row-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
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
              {members.map((member) => {
                const isSelected = selectedMemberId === member.email
                return (
                  <button
                    key={member.email}
                    onClick={() => {
                      if (isEditMode) {
                        setError('편집 중에는 다른 멤버를 선택할 수 없습니다.')
                        return
                      }
                      setSelectedMemberId(member.email)
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
                  {(isEditMode ? pendingChanges : dailyScrum)[
                    category === 'Done' ? 'doneTasks' : 'todoTasks'
                  ]
                    .filter((task) => task.assignee.email === selectedMemberId)
                    .map((task) =>
                      isEditMode ? (
                        <div
                          key={task.taskId}
                          className="text-sm relative group"
                        >
                          <div className="flex justify-between items-center">
                            <Select
                              options={getAvailableTasksForDropdown(
                                task.taskId
                              )}
                              getOptionLabel={(option: Task) => option.title}
                              getOptionValue={(option: Task) => option.taskId}
                              value={task}
                              onChange={(newValue) =>
                                newValue &&
                                handleTaskChange(task.taskId, newValue)
                              }
                              placeholder="태스크 선택"
                              className="text-sm w-full"
                              menuPortalTarget={document.body}
                              isSearchable
                              noOptionsMessage={() =>
                                '선택 가능한 태스크가 없습니다'
                              }
                            />
                            {isCurrentUserSelected() && (
                              <button
                                onClick={() =>
                                  handleRemoveTask(task.taskId, category)
                                }
                                className="text-gray-500 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <Card
                          key={task.taskId}
                          className="text-sm px-2 py-2 shadow-none rounded-md relative group"
                        >
                          <div className="flex justify-between items-center">
                            <span>{task.title}</span>
                            {isCurrentUserSelected() &&
                              !hasUserDailyScrum() && (
                                <button
                                  onClick={() => {
                                    setIsEditMode(true)
                                  }}
                                  className="text-gray-500 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                              )}
                          </div>
                        </Card>
                      )
                    )}
                  {isAdding[category] && isCurrentUserSelected() ? (
                    <div className="flex flex-col gap-2 mt-1">
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <Select
                            options={getAvailableTasksForDropdown('new')}
                            getOptionLabel={(option: Task) => option.title}
                            getOptionValue={(option: Task) => option.taskId}
                            value={null}
                            onChange={(newValue) => {
                              if (newValue) {
                                handleAddTask(category, newValue)
                              }
                            }}
                            placeholder="태스크 선택"
                            className="text-sm"
                            isSearchable
                            noOptionsMessage={() =>
                              '선택 가능한 태스크가 없습니다'
                            }
                          />
                        </div>
                        <button
                          onClick={() => {
                            setIsAdding((prev) => ({
                              ...prev,
                              [category]: false,
                            }))
                          }}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : isCurrentUserSelected() && !hasUserDailyScrum() ? (
                    <button
                      onClick={() => {
                        if (!isEditMode) {
                          setIsEditMode(true)
                        }
                        setIsAdding((prev) => ({ ...prev, [category]: true }))
                      }}
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

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>데일리 스크럼 완료</DialogTitle>
            <DialogDescription>
              데일리 스크럼을 완료하면 더 이상 수정할 수 없습니다.
              계속하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              취소
            </Button>
            <Button
              onClick={() => {
                handleSaveChanges()
                setShowConfirmDialog(false)
              }}
            >
              완료
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
