'use client'

import { UseNotificationSSE } from '@/hooks/useNotificationSSE'
import { useAuthStore } from '@/stores/useAuthStore'
import { useProjectStore } from '@/stores/useProjectStore'
import { getNotification } from '@cm/api/notifications'
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
import { useEffect, useState } from 'react'

interface Notification {
  notificationId: string
  userId: string
  title: string
  description: string
  targetId: string
  isRead: boolean
  project: {
    projectId: string
    title: string
    description: string
    startDate: string
    endDate: string
    members: Array<{
      userId: string
      name: string
      email: string
      profileImageUrl: string
      profiles: Array<{
        positions: string[]
        projectId: string
        role: string
        isActive: boolean
      }>
    }>
    leader: {
      userId: string
      name: string
      email: string
      profileImageUrl: string
      profiles: Array<{
        positions: string[]
        projectId: string
        role: string
        isActive: boolean
      }>
    }
    productManager: {
      userId: string
      name: string
      email: string
      profileImageUrl: string
      profiles: Array<{
        positions: string[]
        projectId: string
        role: string
        isActive: boolean
      }>
    }
    imageUrl: string | null
    archived: boolean
  }
}

export default function ProjectSidebar() {
  const { id } = useParams()
  const pathname = usePathname()
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const { projects, loading, fetchProjects } = useProjectStore()
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])

  const { startSSE } = UseNotificationSSE({
    onGetNotifications: (notifications) => {
      setNotifications(notifications)
    },
    onError: (error) => {
      console.error('SSE 알림 오류:', error)
    },
    onOpen: async () => {
      console.log('SSE 연결 성공, 알림 데이터 요청 시작')
      if (user?.accessToken && id) {
        try {
          await getNotification(user.accessToken, id as string)
        } catch (error) {
          console.error('알림 데이터 요청 실패:', error)
        }
      }
    },
  })

  useEffect(() => {
    if (!user?.accessToken) return
    fetchProjects(user.accessToken)
  }, [user?.accessToken, fetchProjects])

  useEffect(() => {
    const eventSource = startSSE()
    return () => {
      eventSource?.close()
    }
  }, [user?.accessToken])

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
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {notifications.length}
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
            <ul className="space-y-2">
              {notifications.length === 0 ? (
                <li className="text-xs text-gray-500 text-center py-2">
                  새로운 알림이 없습니다.
                </li>
              ) : (
                notifications.map((notification) => {
                  const link = getNotificationLink(notification)
                  const NotificationContent = () => (
                    <div className="flex flex-col">
                      <span className="font-medium">{notification.title}</span>
                      <span className="mt-1">{notification.description}</span>
                    </div>
                  )

                  return (
                    <li
                      key={notification.notificationId}
                      className={`text-xs p-2 rounded-md transition cursor-pointer ${
                        notification.isRead
                          ? 'text-gray-500 hover:bg-gray-50'
                          : 'text-black bg-gray-50 hover:bg-gray-100'
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
