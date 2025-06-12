import { useMembersSelection } from '@/hooks/useMembersSelection'
import { useAuthStore } from '@/stores/useAuthStore'
import { getProjectMembers } from '@cm/api/member'
import { Member } from '@cm/types/project'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { MemberTable } from './MemberTable'
import { AddMemberDialog } from './dialogs/AddMemberDialog'
import { AddPMDialog } from './dialogs/AddPMDialog'
import { EditMembersDialog } from './dialogs/EditMembersDialog'

interface MembersListProps {
  projectId: string
}

export default function MembersList({ projectId }: MembersListProps) {
  const user = useAuthStore((state) => state.user)
  const [members, setMembers] = useState<Member[]>([])
  const [leader, setLeader] = useState<Member | null>(null)
  const [productManager, setProductManager] = useState<Member | null>(null)
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [isAddPMOpen, setIsAddPMOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const {
    selectedMembers,
    selectedMemberIds,
    isAllSelected,
    handleSelectAll,
    handleSelectMember,
    clearSelection,
  } = useMembersSelection({
    members,
    leader,
    productManager,
  })

  const fetchMembers = useCallback(async () => {
    if (!user?.accessToken) return

    try {
      const data = await getProjectMembers(projectId, user.accessToken)
      setMembers(data.members)
      setLeader(data.leader)
      setProductManager(data.productManager)
    } catch (error) {
      console.error(error)
      toast.error('멤버 목록을 불러오는데 실패했습니다')
    } finally {
      setLoading(false)
    }
  }, [projectId, user?.accessToken])

  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  const handleMembersUpdate = useCallback(async () => {
    setLoading(true)
    await fetchMembers()
    clearSelection()
  }, [fetchMembers, clearSelection])

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <AddPMDialog
          open={isAddPMOpen}
          onOpenChange={setIsAddPMOpen}
          onMembersUpdate={handleMembersUpdate}
        />
        <div className="flex gap-2">
          <AddMemberDialog
            open={isAddMemberOpen}
            onOpenChange={setIsAddMemberOpen}
            onMembersUpdate={handleMembersUpdate}
          />
          <EditMembersDialog
            members={selectedMembers}
            disabled={selectedMembers.length === 0}
            onMembersUpdate={handleMembersUpdate}
          />
        </div>
      </div>

      <MemberTable
        members={members}
        selectedMembers={selectedMemberIds}
        isAllSelected={isAllSelected}
        onSelectAll={handleSelectAll}
        onSelectMember={handleSelectMember}
        leader={leader}
        productManager={productManager}
      />
    </div>
  )
}
