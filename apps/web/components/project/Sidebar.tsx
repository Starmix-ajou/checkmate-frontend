'use client'

import { UseNotificationSSE } from '@/hooks/useNotificationSSE'
import { useAuthStore } from '@/stores/useAuthStore'
import { useProjectStore } from '@/stores/useProjectStore'
import { Notification, getNotifications } from '@cm/api/notifications'
import { Button } from '@cm/ui/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@cm/ui/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@cm/ui/components/ui/sidebar'
import { Skeleton } from '@cm/ui/components/ui/skeleton'
import {
  Bell,
  BellRing,
  BellRingIcon,
  BookUser,
  BookmarkCheck,
  ChevronDown,
  Home,
  NotebookPen,
  Play,
  Settings,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export default function ProjectSidebar() {
  const { id } = useParams()
  const pathname = usePathname()
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const { projects, loading, fetchProjects } = useProjectStore()
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [totalNotifications, setTotalNotifications] = useState(0)
  const observer = useRef<IntersectionObserver | null>(null)
  const PAGE_SIZE = 10

  const { startSSE } = UseNotificationSSE({
    onNewNotification: (newNotification) => {
      toast(newNotification.title, {
        description: newNotification.description,
        icon: <BellRingIcon className="size-4" />,
        duration: 5000,
        action: (
          <Button
            variant="cm"
            onClick={() => {
              const link = getNotificationLink(newNotification)
              if (link) {
                router.push(link)
                setIsNotificationOpen(false)
              }
            }}
          >
            확인
          </Button>
        ),
      })

      setNotifications((prev) => {
        const filtered = prev.filter(
          (n) => n.notificationId !== newNotification.notificationId
        )
        return [newNotification, ...filtered]
      })
      setTotalNotifications((prev) => prev + 1)
    },
    onError: (error) => {
      console.error('SSE 알림 오류:', error)
      toast.error('알림을 받는 중 오류가 발생했습니다.')
    },
    onOpen: async () => {
      console.log('SSE 연결 성공')
    },
  })

  const loadInitialNotifications = useCallback(async () => {
    if (!user?.accessToken || !id) return

    try {
      setIsLoading(true)
      const response = await getNotifications(
        user.accessToken,
        id as string,
        0,
        PAGE_SIZE
      )
      setNotifications(response.content)
      setHasMore(!response.last)
      setPage(0)
      setTotalNotifications(response.totalElements)
    } catch (error) {
      console.error('알림 로드 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }, [user?.accessToken, id])

  const loadMoreNotifications = useCallback(async () => {
    if (!user?.accessToken || !id || isLoading || !hasMore) return

    try {
      setIsLoading(true)
      const nextPage = page + 1
      const response = await getNotifications(
        user.accessToken,
        id as string,
        nextPage,
        PAGE_SIZE
      )

      setNotifications((prev) => [...prev, ...response.content])
      setHasMore(!response.last)
      setPage(nextPage)
    } catch (error) {
      console.error('추가 알림 로드 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }, [user?.accessToken, id, page, isLoading, hasMore])

  const lastNotificationRef = useCallback(
    (node: HTMLLIElement | null) => {
      if (isLoading) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreNotifications()
        }
      })

      if (node) observer.current.observe(node)
    },
    [isLoading, hasMore, loadMoreNotifications]
  )

  useEffect(() => {
    if (user?.accessToken && id) {
      loadInitialNotifications()
    }
  }, [user?.accessToken, id, loadInitialNotifications])

  useEffect(() => {
    const eventSource = startSSE()
    return () => {
      eventSource?.close()
    }
  }, [user?.accessToken])

  useEffect(() => {
    if (!user?.accessToken) return
    fetchProjects(user.accessToken)
  }, [user?.accessToken, fetchProjects])

  const items = [
    { title: 'Overview', url: `/projects/${id}/overview`, icon: Home },
    { title: 'Epic', url: `/projects/${id}/epic`, icon: Play },
    { title: 'Task', url: `/projects/${id}/task`, icon: BookmarkCheck },
    {
      title: 'Meeting Notes',
      url: `/projects/${id}/meeting-notes`,
      icon: NotebookPen,
    },
    {
      title: 'Members',
      url: `/projects/${id}/members`,
      icon: BookUser,
    },
    {
      title: 'Settings',
      url: `/projects/${id}/settings`,
      icon: Settings,
    },
  ]

  const getNotificationLink = (notification: Notification) => {
    const { title, targetId, project } = notification

    switch (title) {
      case '프로젝트 초대 요청이 도착했어요!':
        return `/projects/${targetId}/overview`
      case '내 정보가 변경되었어요!':
        return `/projects/${targetId}/members`
      case '회의록이 추가되었어요!':
        return `/projects/${project.projectId}/meeting-notes/${targetId}`
      case '스프린트가 추가되었어요!':
        return `/projects/${targetId}/task`
      case 'Task의 담당자로 할당되었어요!':
      case 'Task에 새 댓글이 추가되었어요!':
        return `/projects/${project.projectId}/task?taskId=${targetId}`
      default:
        return null
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    const link = getNotificationLink(notification)
    if (link) {
      router.push(link)
      setIsNotificationOpen(false)
    }
  }

  return (
    <Sidebar className="mt-12 h-[calc(100svh-3rem)]">
      <SidebarHeader className="flex p-2 border-b">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex grow items-center gap-2 cursor-pointer p-2 hover:bg-cm-light rounded-lg transition">
                {loading || !user ? (
                  <>
                    <div className="flex flex-col grow gap-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <div className="flex flex-col grow">
                      <span className="text-sm font-medium text-primary">
                        {user.name}
                      </span>
                      <span className="text-xs text-cm">{user.email}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-cm" />
                  </>
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-full">
              <DropdownMenuItem>프로필 보기</DropdownMenuItem>
              <DropdownMenuItem>로그아웃</DropdownMenuItem>
              <div className="border-t my-2" />
              <div className="px-2 text-xs font-semibold text-gray-500">
                내 프로젝트
              </div>
              {loading
                ? Array.from({ length: 3 }).map((_, index) => (
                    <DropdownMenuItem key={index}>
                      <Skeleton className="h-4 w-full" />
                    </DropdownMenuItem>
                  ))
                : projects.map((project) => (
                    <DropdownMenuItem key={project.project.projectId} asChild>
                      <Link
                        href={`/projects/${project.project.projectId}/overview`}
                        className="w-full"
                      >
                        {project.project.title}
                      </Link>
                    </DropdownMenuItem>
                  ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            >
              <Bell className="w-5 h-5" />
              {totalNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {totalNotifications}
                </span>
              )}
            </Button>
          </div>
        </div>
      </SidebarHeader>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isNotificationOpen ? 'max-h-96 border-b' : 'max-h-0'
        }`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold">알림</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsNotificationOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="max-h-[calc(24rem-4rem)] overflow-y-auto pr-2">
            <ul className="divide-y divide-gray-100">
              {notifications.length === 0 ? (
                <li className="text-xs text-gray-500 text-center py-4">
                  {isLoading
                    ? '알림을 불러오는 중...'
                    : '새로운 알림이 없습니다.'}
                </li>
              ) : (
                notifications.map((notification, index) => {
                  const link = getNotificationLink(notification)
                  const NotificationContent = () => (
                    <div className="relative py-3">
                      {!notification.isRead && (
                        <div className="absolute right-2 top-4 w-2 h-2 bg-cm rounded-full" />
                      )}
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">
                          {notification.title}
                        </span>
                        <span className="mt-1 text-xs text-gray-600 break-keep">
                          {notification.description}
                        </span>
                      </div>
                    </div>
                  )

                  return (
                    <li
                      key={notification.notificationId}
                      ref={
                        index === notifications.length - 1
                          ? lastNotificationRef
                          : null
                      }
                      className={`transition ${
                        notification.isRead
                          ? 'text-gray-500 hover:bg-gray-50'
                          : 'text-black hover:bg-gray-50'
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      {link ? (
                        <Link href={link} className="block">
                          <NotificationContent />
                        </Link>
                      ) : (
                        <NotificationContent />
                      )}
                    </li>
                  )
                })
              )}
              {isLoading && (
                <li className="text-xs text-gray-500 text-center py-2">
                  알림을 불러오는 중...
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Project</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={`flex items-center gap-2 p-2 transition ${
                          isActive
                            ? 'font-bold text-black bg-cm-light'
                            : 'text-neutral-600 hover:text-black'
                        }`}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
