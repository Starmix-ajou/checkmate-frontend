'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/stores/useAuthStore'
import { LogOut, User } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const user = useAuthStore((state) => state.user)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user !== null) {
      setLoading(false)
    }
  }, [user])

  if (loading) return null
  if (!user) return <p className="p-4 text-center">로그인이 필요합니다.</p>

  return (
    <nav className="flex fixed w-full top-0 h-16 items-center justify-between p-4 border-b bg-white">
      <div className="text-xl font-bold">CheckMate</div>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2">
          {0 ? (
            <Image
              src={user.image}
              alt={user.name}
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
