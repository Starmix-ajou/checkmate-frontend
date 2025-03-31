'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'
import Image from 'next/image'
import { User } from 'lucide-react'

export default function Navbar() {
  const user = useAuthStore((state) => state.user)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (user !== null) {
      setLoading(false)
    }
  }, [user])
  if (loading) {
    return null
  }
  if (!user) {
    return <p className="p-4 text-center">로그인이 필요합니다.</p>
  }

  return (
    <nav className="flex items-center justify-between p-4 border-b bg-white">
      <div className="text-xl font-bold">CheckMate</div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">{user.name}</span>
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
      </div>
    </nav>
  )
}
