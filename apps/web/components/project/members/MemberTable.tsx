import { Member } from '@cm/types/project'
import { Checkbox } from '@cm/ui/components/ui/checkbox'
import { PositionBadgeGroup } from '@cm/ui/components/ui/position-badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@cm/ui/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@cm/ui/components/ui/tooltip'
import { Crown } from 'lucide-react'
import Image from 'next/image'

interface MemberTableProps {
  members: Member[]
  selectedMembers: Set<string>
  isAllSelected: boolean
  onSelectAll: (checked: boolean) => void
  onSelectMember: (userId: string, checked: boolean) => void
  leader: Member | null
  productManager: Member | null
}

export function MemberTable({
  members,
  selectedMembers,
  isAllSelected,
  onSelectAll,
  onSelectMember,
  leader,
  productManager,
}: MemberTableProps) {
  const regularMembers = members.filter(
    (member) =>
      (!leader || member.userId !== leader.userId) &&
      (!productManager || member.userId !== productManager.userId)
  )

  const renderMemberRow = (member: Member, isLeader = false) => (
    <TooltipProvider key={member.userId}>
      <Tooltip>
        <TooltipTrigger asChild>
          <TableRow
            className={`${
              !member.profile.isActive ? 'opacity-50' : ''
            } transition-opacity`}
          >
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
              <div className="flex items-center gap-1">
                {member.name}
                {isLeader && (
                  <Crown
                    className="w-4 h-4 text-yellow-500"
                    strokeWidth={2.5}
                  />
                )}
              </div>
            </TableCell>
            <TableCell>{member.email}</TableCell>
            <TableCell>
              <PositionBadgeGroup positions={member.profile.positions || []} />
            </TableCell>
          </TableRow>
        </TooltipTrigger>
        {!member.profile.isActive && (
          <TooltipContent>
            <p>초대중인 멤버입니다</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )

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
        {leader && renderMemberRow(leader, true)}
        {regularMembers.map((member) => renderMemberRow(member))}
        {productManager && (
          <>
            <TableRow className="h-[1px] bg-gray-200" />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TableRow
                    className={`${
                      !productManager.profile.isActive ? 'opacity-50' : ''
                    } transition-opacity border-t-2 border-gray-200`}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedMembers.has(productManager.userId)}
                        onCheckedChange={(checked) =>
                          onSelectMember(
                            productManager.userId,
                            checked as boolean
                          )
                        }
                      />
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                      {productManager.profileImageUrl && (
                        <Image
                          src={productManager.profileImageUrl}
                          alt={productManager.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      )}
                      {productManager.name}
                    </TableCell>
                    <TableCell>{productManager.email}</TableCell>
                    <TableCell>
                      <PositionBadgeGroup
                        positions={productManager.profile.positions || []}
                      />
                    </TableCell>
                  </TableRow>
                </TooltipTrigger>
                {!productManager.profile.isActive && (
                  <TooltipContent>
                    <p>초대중인 멤버입니다</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </>
        )}
      </TableBody>
    </Table>
  )
}
