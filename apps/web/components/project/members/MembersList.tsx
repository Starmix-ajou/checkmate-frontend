import { Member } from '@cm/types/project'
import { getProjectMembers } from '@cm/api/member'
import { useAuthStore } from '@/stores/useAuthStore'
import { useState, useCallback, useEffect } from 'react'
import { MemberTable } from './MemberTable'
import { AddMemberDialog } from './dialogs/AddMemberDialog'
import { AddPMDialog } from './dialogs/AddPMDialog'
import { EditMembersDialog } from './dialogs/EditMembersDialog'
import { toast } from 'react-toastify'

interface MembersListProps {
  projectId: string
}

export default function MembersList({ projectId }: MembersListProps) {
  const user = useAuthStore((state) => state.user)
  const [members, setMembers] = useState<Member[]>([])
  const [leader, setLeader] = useState<Member | null>(null)
  const [productManager, setProductManager] = useState<Member | null>(null)
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([])
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [isAddPMOpen, setIsAddPMOpen] = useState(false)
  const [loading, setLoading] = useState(true)

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
    setSelectedMembers([])
  }, [fetchMembers])

  const selectedMemberIds = new Set(selectedMembers.map((member) => member.userId))
  const isAllSelected = members.length > 0 && selectedMemberIds.size === members.length

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMembers(members)
    } else {
      setSelectedMembers([])
    }
  }

  const handleSelectMember = (userId: string, checked: boolean) => {
    if (checked) {
      const member = members.find((m) => m.userId === userId)
      if (member) {
        setSelectedMembers([...selectedMembers, member])
      }
    } else {
      setSelectedMembers(selectedMembers.filter((m) => m.userId !== userId))
    }
  }

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

      {leader && productManager && (
        <MemberTable
          members={members}
          selectedMembers={selectedMemberIds}
          isAllSelected={isAllSelected}
          onSelectAll={handleSelectAll}
          onSelectMember={handleSelectMember}
          leader={leader}
          productManager={productManager}
        />
      )}
    </div>
  )
}
