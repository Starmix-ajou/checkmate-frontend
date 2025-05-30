'use client'

import { User } from '@cm/types/user'
import { ProjectStatus } from '@cm/types/project'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@cm/ui/components/ui/dropdown-menu'
import { SidebarTrigger } from '@cm/ui/components/ui/sidebar'
import { Skeleton } from '@cm/ui/components/ui/skeleton'
import { FileText, LogOut, Shield, User as UserIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export type BaseNavbarProps = {
  user: User | null
  onSignOut: () => Promise<void>
  showSidebarTrigger?: boolean
  showFilters?: boolean
  setFilter?: (filter: ProjectStatus) => void
  currentFilter?: ProjectStatus
  logoUrl?: string
  logoAlt?: string
}

export function BaseNavbar({
  user,
  onSignOut,
  showSidebarTrigger = false,
  showFilters = false,
  setFilter,
  currentFilter = '',
  logoUrl = '/logo.svg',
  logoAlt = 'logo',
}: BaseNavbarProps) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <nav className="flex fixed w-full top-0 h-12 items-center justify-between p-4 border-b bg-white z-50">
      <div className="flex items-center gap-2">
        <Link href="/projects" className="text-xl font-bold">
          <Image src={logoUrl} alt={logoAlt} width={128} height={30} priority />
        </Link>
        {showSidebarTrigger && <SidebarTrigger />}
        {showFilters && setFilter && pathname === '/projects' && (
          <div className="hidden md:flex gap-8 ml-6">
            <button
              onClick={() => setFilter('')}
              className={`text-sm font-medium h-12 border-b-2 transition-colors ${
                currentFilter === ''
                  ? 'border-cm text-cm'
                  : 'border-transparent hover:border-cm'
              }`}
            >
              전체 프로젝트
            </button>
            <button
              onClick={() => setFilter('ACTIVE')}
              className={`text-sm font-medium h-12 border-b-2 transition-colors ${
                currentFilter === 'ACTIVE'
                  ? 'border-cm text-cm'
                  : 'border-transparent hover:border-cm'
              }`}
            >
              진행중 프로젝트
            </button>
            <button
              onClick={() => setFilter('ARCHIVED')}
              className={`text-sm font-medium h-12 border-b-2 transition-colors ${
                currentFilter === 'ARCHIVED'
                  ? 'border-cm text-cm'
                  : 'border-transparent hover:border-cm'
              }`}
            >
              지난 프로젝트
            </button>
            <button
              onClick={() => setFilter('PENDING')}
              className={`text-sm font-medium h-12 border-b-2 transition-colors ${
                currentFilter === 'PENDING'
                  ? 'border-cm text-cm'
                  : 'border-transparent hover:border-cm'
              }`}
            >
              초대받은 프로젝트
            </button>
          </div>
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2">
          {!user ? (
            <Skeleton className="w-8 h-8 rounded-full" />
          ) : user.image ? (
            <Image
              src={user.image}
              alt={user.name || '프로필 이미지'}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <UserIcon className="w-8 h-8 text-gray-500" />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="flex items-center gap-2 cursor-pointer"
            onClick={onSignOut}
          >
            <LogOut className="w-4 h-4" />
            로그아웃
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push('/privacy')}
          >
            <FileText className="w-4 h-4" />
            이용약관
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push('/terms')}
          >
            <Shield className="w-4 h-4" />
            개인정보처리방침
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  )
}
