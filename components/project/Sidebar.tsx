'use client'

import { useParams, usePathname } from 'next/navigation'
import { useState } from 'react'
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
} from '@/components/ui/sidebar'

import {
  Home,
  Play,
  BookmarkCheck,
  NotebookPen,
  Settings,
  Bell,
  ChevronDown,
  X,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

const projects = [
  { id: 1, name: 'CheckMate' },
  { id: 2, name: 'DevSync' },
  { id: 3, name: 'AgileFlow' },
]

const notifications = [
  { id: 1, text: '새로운 태스크가 할당되었습니다.' },
  { id: 2, text: '스프린트 일정이 변경되었습니다.' },
  { id: 3, text: '코드 리뷰 요청이 있습니다.' },
]

export default function ProjectSidebar() {
  const { id } = useParams()
  const pathname = usePathname()

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
      title: 'Settings',
      url: `/projects/${id}/settings`,
      icon: Settings,
    },
  ]
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)

  return (
    <Sidebar>
      <SidebarHeader className="flex p-4 border-b">
        <div className="text-lg font-bold">CheckMate</div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex grow items-center gap-2 cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition">
                <Avatar className="w-9 h-9">
                  <AvatarImage src="/avatar1.png" />
                  <AvatarFallback>김</AvatarFallback>
                </Avatar>
                <div className="flex flex-col grow">
                  <span className="text-sm font-medium">김평주</span>
                  <span className="text-xs text-gray-500">FE Developer</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-full">
              <DropdownMenuItem>프로필 보기</DropdownMenuItem>
              <DropdownMenuItem>로그아웃</DropdownMenuItem>
              <div className="border-t my-2" />
              <div className="px-2 text-xs font-semibold text-gray-500">
                내 프로젝트
              </div>
              {projects.map((project) => (
                <DropdownMenuItem key={project.id} asChild>
                  <a href={`/projects/${project.id}`} className="w-full">
                    {project.name}
                  </a>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
          >
            <Bell className="w-5 h-5" />
          </Button>
        </div>
      </SidebarHeader>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isNotificationOpen ? 'max-h-40 border-b' : 'max-h-0'
        }`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold">Notifications</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsNotificationOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <ul className="space-y-2">
            {notifications.map((notification) => (
              <li key={notification.id} className="text-xs text-gray-700">
                {notification.text}
              </li>
            ))}
          </ul>
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
                      <a
                        href={item.url}
                        className={`flex items-center gap-2 p-2 rounded-md transition ${
                          isActive
                            ? 'font-bold text-black bg-neutral-100'
                            : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
                        }`}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
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
