import { Member } from '@cm/types/project'
import { useState } from 'react'

export function useMemberSelection(members: Member[]) {
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set())
  const [isAllSelected, setIsAllSelected] = useState(false)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMembers(new Set(members.map((member) => member.userId)))
      setIsAllSelected(true)
    } else {
      setSelectedMembers(new Set())
      setIsAllSelected(false)
    }
  }

  const handleSelectMember = (userId: string, checked: boolean) => {
    const newSelected = new Set(selectedMembers)
    if (checked) {
      newSelected.add(userId)
    } else {
      newSelected.delete(userId)
    }
    setSelectedMembers(newSelected)
    setIsAllSelected(newSelected.size === members.length)
  }

  return {
    selectedMembers,
    isAllSelected,
    handleSelectAll,
    handleSelectMember,
  }
}
