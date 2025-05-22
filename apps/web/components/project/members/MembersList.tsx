import { useMemberSelection } from '@/hooks/useMemberSelection'
import { Member } from '@/types/project'
import { useState } from 'react'

import { MemberTable } from './MemberTable'
import { AddMemberDialog } from './dialogs/AddMemberDialog'
import { AddPMDialog } from './dialogs/AddPMDialog'
import { EditMembersDialog } from './dialogs/EditMembersDialog'

interface MembersListProps {
  members: Member[]
}

export default function MembersList({ members }: MembersListProps) {
  const {
    selectedMembers,
    isAllSelected,
    handleSelectAll,
    handleSelectMember,
  } = useMemberSelection(members)
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [isAddPMOpen, setIsAddPMOpen] = useState(false)

  const selectedMembersList = members.filter((member) =>
    selectedMembers.has(member.userId)
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <AddPMDialog open={isAddPMOpen} onOpenChange={setIsAddPMOpen} />
        <div className="flex gap-2">
          <AddMemberDialog
            open={isAddMemberOpen}
            onOpenChange={setIsAddMemberOpen}
          />
          <EditMembersDialog
            members={selectedMembersList}
            disabled={selectedMembers.size === 0}
          />
        </div>
      </div>

      <MemberTable
        members={members}
        selectedMembers={selectedMembers}
        isAllSelected={isAllSelected}
        onSelectAll={handleSelectAll}
        onSelectMember={handleSelectMember}
      />
    </div>
  )
}
