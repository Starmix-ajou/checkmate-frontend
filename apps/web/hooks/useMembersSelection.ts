import { Member } from '@cm/types/project'
import { useCallback, useState } from 'react'

interface UseMembersSelectionProps {
  members: Member[]
  leader: Member | null
  productManager: Member | null
}

interface UseMembersSelectionReturn {
  selectedMembers: Member[]
  selectedMemberIds: Set<string>
  isAllSelected: boolean
  handleSelectAll: (checked: boolean) => void
  handleSelectMember: (userId: string, checked: boolean) => void
  clearSelection: () => void
}

export function useMembersSelection({
  members,
  leader,
  productManager,
}: UseMembersSelectionProps): UseMembersSelectionReturn {
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([])

  const selectedMemberIds = new Set(
    selectedMembers.map((member) => member.userId)
  )
  
  const isAllSelected =
    members.length > 0 && selectedMemberIds.size === members.length

  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedMembers(members)
    } else {
      setSelectedMembers([])
    }
  }, [members])

  const handleSelectMember = useCallback((userId: string, checked: boolean) => {
    if (checked) {
      let member = members.find((m) => m.userId === userId)
      if (!member && productManager?.userId === userId) {
        member = productManager
      }
      if (!member && leader?.userId === userId) {
        member = leader
      }
      if (member) {
        setSelectedMembers((prev) => [...prev, member!])
      }
    } else {
      setSelectedMembers((prev) => prev.filter((m) => m.userId !== userId))
    }
  }, [members, productManager, leader])

  const clearSelection = useCallback(() => {
    setSelectedMembers([])
  }, [])

  return {
    selectedMembers,
    selectedMemberIds,
    isAllSelected,
    handleSelectAll,
    handleSelectMember,
    clearSelection,
  }
} 