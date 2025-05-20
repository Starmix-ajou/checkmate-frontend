import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Member } from '@/types/project'
import Image from 'next/image'

interface MemberTableProps {
  members: Member[]
  selectedMembers: Set<string>
  isAllSelected: boolean
  onSelectAll: (checked: boolean) => void
  onSelectMember: (userId: string, checked: boolean) => void
}

export function MemberTable({
  members,
  selectedMembers,
  isAllSelected,
  onSelectAll,
  onSelectMember,
}: MemberTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">
            <Checkbox checked={isAllSelected} onCheckedChange={onSelectAll} />
          </TableHead>
          <TableHead>이름</TableHead>
          <TableHead>이메일</TableHead>
          <TableHead>포지션</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <TableRow key={member.userId}>
            <TableCell>
              <Checkbox
                checked={selectedMembers.has(member.userId)}
                onCheckedChange={(checked) =>
                  onSelectMember(member.userId, checked as boolean)
                }
              />
            </TableCell>
            <TableCell className="flex items-center gap-2">
              {member.profileImageUrl && (
                <Image
                  src={member.profileImageUrl}
                  alt={member.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
              {member.name}
            </TableCell>
            <TableCell>{member.email}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {member.profiles[0]?.positions.map((position) => (
                  <Badge key={position} variant="outline">
                    {position}
                  </Badge>
                ))}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
