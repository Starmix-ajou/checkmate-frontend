'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface AvatarGroupProps {
  users: { name: string; src: string }[]
  className?: string
}

export default function AvatarGroup({ users, className }: AvatarGroupProps) {
  return (
    <div className={`flex -space-x-2 ${className}`}>
      {users.map((user, index) => (
        <Avatar key={index}>
          <AvatarImage src={user.src} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
      ))}
      <Avatar className="border border-white bg-gray-200">
        <AvatarFallback>+{users.length - 3}</AvatarFallback>
      </Avatar>
    </div>
  )
}
