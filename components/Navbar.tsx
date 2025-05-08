'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuthStore } from '@/stores/useAuthStore'
import { LogOut, User } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const user = useAuthStore((state) => state.user)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user !== null) {
      setLoading(false)
    }
  }, [user])

  return (
    <nav className="flex fixed w-full top-0 h-12 items-center justify-between p-4 border-b bg-white z-50">
      <Link href="/projects" className="text-xl font-bold">
        <Image
          src="/logo.svg"
          alt="checkmate"
          width={128}
          height={30}
          priority
        />
      </Link>
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
            onClick={() => signOut({ callbackUrl: '/login' })}
          >
            <LogOut className="w-4 h-4" />
            로그아웃
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  )
}
