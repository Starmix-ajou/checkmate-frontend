import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UserIcon } from 'lucide-react'

interface Member {
  email: string
  name: string
  profileImageUrl: string
}

interface MemberAvatarProps {
  member: Member
  isSelected: boolean
  onClick: () => void
}

export function MemberAvatar({
  member,
  isSelected,
  onClick,
}: MemberAvatarProps) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1">
      <Avatar
        className={`w-10 h-10 transition-all bg-cm-light ${
          isSelected ? 'ring-2 ring-cm' : 'opacity-50 hover:opacity-100'
        }`}
      >
        <AvatarImage src={member.profileImageUrl} alt={member.name} />
        <AvatarFallback>
          <UserIcon className="w-4 h-4 text-gray-400" />
        </AvatarFallback>
      </Avatar>
      <span className="text-xs text-center">{member.name}</span>
    </button>
  )
}
