'use client'

import { useAuthStore } from '@/stores/useAuthStore'
import { useProjectStore } from '@/stores/useProjectStore'
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
import { useParams, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Notification {
  id: number
  text: string
}

const notifications: Notification[] = [
  { id: 1, text: '새로운 태스크가 할당되었습니다.' },
  { id: 2, text: '스프린트 일정이 변경되었습니다.' },
  { id: 3, text: '코드 리뷰 요청이 있습니다.' },
]

export default function ProjectSidebar() {
  const { id } = useParams()
  const pathname = usePathname()
  const user = useAuthStore((state) => state.user)
  const { projects, loading, fetchProjects } = useProjectStore()

  useEffect(() => {
    if (!user?.accessToken) return
    fetchProjects(user.accessToken)
  }, [user?.accessToken, fetchProjects])

  const items = [
    { title: 'Overview', url: `/projects/${id}/overview`, icon: Home },
    { title: 'Task', url: `/projects/${id}/task`, icon: BookmarkCheck },
    {
      title: 'Members',
      url: `/projects/${id}/members`,
      icon: BookUser,
    },
  ]

  const currentProject = projects.find(
    (project) => project.project.projectId === id
  )
  const currentUserRole = currentProject?.members.find(
    (member) => member.email === user?.email
  )?.role

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
                      <span className="text-sm font-medium">{user.name}</span>
                      <span className="text-xs text-gray-500">
                        {currentUserRole}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </>
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-full">
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
        </div>
      </SidebarHeader>

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
