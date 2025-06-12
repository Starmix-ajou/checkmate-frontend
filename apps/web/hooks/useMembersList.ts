import { useAuthStore } from '@/stores/useAuthStore'
import { getProjectMembers } from '@cm/api/member'
import { Member } from '@cm/types/project'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

interface UseMembersListProps {
  projectId: string
}

interface UseMembersListReturn {
  members: Member[]
  leader: Member | null
  productManager: Member | null
  selectedMembers: Member[]
  selectedMemberIds: Set<string>
  isAllSelected: boolean
  loading: boolean
  handleMembersUpdate: () => Promise<void>
  handleSelectAll: (checked: boolean) => void
  handleSelectMember: (userId: string, checked: boolean) => void
}

export function useMembersList({ projectId }: UseMembersListProps): UseMembersListReturn {
  const user = useAuthStore((state) => state.user)
  const [members, setMembers] = useState<Member[]>([])
  const [leader, setLeader] = useState<Member | null>(null)
  const [productManager, setProductManager] = useState<Member | null>(null)
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([])
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

  return {
    members,
    leader,
    productManager,
    selectedMembers,
    selectedMemberIds,
    isAllSelected,
    loading,
    handleMembersUpdate,
    handleSelectAll,
    handleSelectMember,
  }
} 