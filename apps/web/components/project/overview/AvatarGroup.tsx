'use client'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@cm/ui/components/ui/avatar'

interface AvatarGroupProps {
  users: { name: string; src: string }[]
  className?: string
}

export default function AvatarGroup({ users, className }: AvatarGroupProps) {
  const displayedUsers = users.slice(0, 4)
  const remainingUsers = users.length - displayedUsers.length
  return (
    <div className={`flex -space-x-2 ${className}`}>
      {displayedUsers.map((user, index) => (
        <Avatar key={index}>
          <AvatarImage src={user.src} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
      ))}
      {remainingUsers > 0 && (
        <Avatar className="border border-white bg-gray-200">
          <AvatarFallback>+{remainingUsers}</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
