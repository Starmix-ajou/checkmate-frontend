'use client'

import { UseNotificationSSE } from '@/hooks/useNotificationSSE'
import { useAuthStore } from '@/stores/useAuthStore'
import { useProjectStore } from '@/stores/useProjectStore'
import {
  Notification,
  getNotificationCount,
  getNotifications,
} from '@cm/api/notifications'
import { getProjectBrief } from '@cm/api/project'
import { ProjectBrief } from '@cm/types/project'
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
  BellIcon,
  BellRingIcon,
  BookUser,
  BookmarkCheck,
  ChartLine,
  ChevronDown,
  Home,
  NotebookPen,
  Play,
  Receipt,
  Rocket,
  Settings,
} from 'lucide-react'
import Link from 'next/link'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { NotificationPanel } from './NotificationPanel'

export default function ProjectSidebar() {
  const { id } = useParams()
  const pathname = usePathname()
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const { projects, loading, fetchProjects } = useProjectStore()
  const [totalNotifications, setTotalNotifications] = useState(0)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const observer = useRef<IntersectionObserver | null>(null)
  const PAGE_SIZE = 10
  const [projectBrief, setProjectBrief] = useState<ProjectBrief | null>(null)

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
    },
    onOpen: async () => {
      console.log('SSE 연결 성공')
    },
  })

  const loadNotificationCount = useCallback(async () => {
    if (!user?.accessToken || !id) return

    try {
      const response = await getNotificationCount(
        user.accessToken,
        id as string
      )
      setTotalNotifications(response.count)
    } catch (error) {
      console.error('알림 개수 로드 실패:', error)
      toast.error('알림 개수를 불러오는데 실패했습니다.')
    }
  }, [user?.accessToken, id])

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
    } catch (error) {
      console.error('알림 로드 실패:', error)
      toast.error('알림을 불러오는데 실패했습니다.')
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
      loadNotificationCount()
    }
  }, [user?.accessToken, id, loadNotificationCount])

  useEffect(() => {
    if (isNotificationOpen) {
      loadInitialNotifications()
    }
  }, [isNotificationOpen, loadInitialNotifications])

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

  useEffect(() => {
    if (!user?.accessToken || !id) return

    const fetchProjectBrief = async () => {
      try {
        const briefData = await getProjectBrief(id as string, user.accessToken)
        setProjectBrief(briefData)
      } catch (error) {
        console.error(error)
      }
    }

    fetchProjectBrief()
  }, [id, user?.accessToken])

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
        return `/projects/${id}/task`
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
      title: 'Insight',
      url: `/projects/${id}/insight`,
      icon: ChartLine,
    },
    ...(projectBrief?.isPremium
      ? [
          {
            title: 'Billing',
            url: `/projects/${id}/billing`,
            icon: Receipt,
          },
        ]
      : []),
    {
      title: 'Settings',
      url: `/projects/${id}/settings`,
      icon: Settings,
    },
  ]

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
              <BellIcon className="w-5 h-5" />
              {totalNotifications > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[0.7rem] rounded-full w-4 h-4 flex items-center justify-center">
                  {totalNotifications > 99 ? '99+' : totalNotifications}
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
        <NotificationPanel
          notifications={notifications}
          isLoading={isLoading}
          hasMore={hasMore}
          lastNotificationRef={lastNotificationRef}
          onClose={() => setIsNotificationOpen(false)}
          handleNotificationClick={handleNotificationClick}
          onNotificationRead={(notificationId) => {
            setNotifications((prev) =>
              prev.map((notification) =>
                notification.notificationId === notificationId
                  ? { ...notification, isRead: true }
                  : notification
              )
            )
            setTotalNotifications((prev) => Math.max(0, prev - 1))
          }}
          onNotificationDelete={(notificationId) => {
            setNotifications((prev) =>
              prev.filter(
                (notification) => notification.notificationId !== notificationId
              )
            )
            setTotalNotifications((prev) => Math.max(0, prev - 1))
          }}
        />
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
      <SidebarFooter>
        {projectBrief && !projectBrief.isPremium && (
          <Link
            href={`/projects/${id}/premium`}
            className="group relative flex items-center gap-3 p-4 bg-gradient-to-r from-[#1a237e] via-[#283593] to-[#303f9f] text-white rounded-lg m-2 hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                <Rocket className="w-5 h-5 text-blue-200" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold tracking-wide">
                  프리미엄으로 업그레이드
                </span>
                <span className="text-sm text-blue-100/90">
                  월 19,900원으로 시작하세요
                </span>
              </div>
            </div>
          </Link>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
