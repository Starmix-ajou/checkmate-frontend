'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuthStore } from '@/stores/useAuthStore'
import { ProjectStatus } from '@/types/project'
import { FileText, LogOut, Shield, User } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

type NavbarProps = {
  setFilter?: (filter: ProjectStatus) => void
  currentFilter?: ProjectStatus
}

export default function Navbar({ setFilter, currentFilter = '' }: NavbarProps) {
  const user = useAuthStore((state) => state.user)
  const clearUser = useAuthStore((state) => state.clearUser)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (user !== null) {
      setLoading(false)
    }
  }, [user])

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false })
      clearUser()
      toast.success('로그아웃이 완료되었습니다.')
      router.push('/login')
    } catch (error) {
      toast.error('로그아웃 중 오류가 발생했습니다.')
      console.log(error)
    }
  }

  return (
    <nav className="flex fixed w-full top-0 h-12 items-center justify-between p-4 border-b bg-white z-50">
      <div className="flex items-center gap-8">
        <Link href="/projects" className="text-xl font-bold">
          <Image
            src="/logo.svg"
            alt="checkmate"
            width={128}
            height={30}
            priority
          />
        </Link>
        {setFilter && pathname === '/projects' && (
          <div className="flex gap-8">
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
          {loading ? (
            <Skeleton className="w-8 h-8 rounded-full" />
          ) : user?.image ? (
            <Image
              src={user.image}
              alt={user.name || '프로필 이미지'}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <User className="w-8 h-8 text-gray-500" />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4" />
            로그아웃
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push('/terms')}
          >
            <FileText className="w-4 h-4" />
            이용약관
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push('/privacy')}
          >
            <Shield className="w-4 h-4" />
            개인정보처리방침
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  )
}
