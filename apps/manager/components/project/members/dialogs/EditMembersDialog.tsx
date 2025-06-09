import { useAuthStore } from '@/stores/useAuthStore'
import { removeMember, updateMemberPositions } from '@cm/api/member'
import { Position } from '@cm/types/NewProjectTeamMember'
import { Member } from '@cm/types/project'
import { Button } from '@cm/ui/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@cm/ui/components/ui/dialog'
import { selectStyles } from '@cm/ui/lib/select-styles'
import { UserPen } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import CreatableSelect from 'react-select/creatable'
import { toast } from 'sonner'

const getEnumOptions = (e: object) =>
  Object.values(e).map((value) => ({ label: value, value }))

const ROLE_OPTIONS = getEnumOptions(Position)

interface EditMembersDialogProps {
  members: Member[]
  disabled: boolean
  onMembersUpdate?: () => void
}

export function EditMembersDialog({
  members,
  disabled,
  onMembersUpdate,
}: EditMembersDialogProps) {
  const { id: projectId } = useParams()
  const user = useAuthStore((state) => state.user)
  const [editingMemberPositions, setEditingMemberPositions] = useState<
    Record<string, Position[]>
  >({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [open, setOpen] = useState(false)
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0)

  const currentMember = members[currentMemberIndex]
  const isLastMember = currentMemberIndex === members.length - 1
  const isFirstMember = currentMemberIndex === 0

  useEffect(() => {
    if (currentMember && !editingMemberPositions[currentMember.userId]) {
      setEditingMemberPositions((prev) => ({
        ...prev,
        [currentMember.userId]: [
          ...(currentMember.profile.positions || []),
        ] as Position[],
      }))
    }
  }, [currentMember, editingMemberPositions])

  const handleUpdateMember = async (memberId: string) => {
    if (!user?.accessToken || !projectId) return

    try {
      const positions = editingMemberPositions[memberId] || []
      await updateMemberPositions(
        projectId as string,
        memberId,
        positions,
        user.accessToken
      )
      toast.success('멤버 정보가 수정되었습니다')
      if (isLastMember) {
        setOpen(false)
        onMembersUpdate?.()
      } else {
        setCurrentMemberIndex((prev) => prev + 1)
      }
    } catch (error) {
      console.error(error)
      toast.error('멤버 정보 수정에 실패했습니다')
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!user?.accessToken || !projectId) return

    try {
      await removeMember(projectId as string, memberId, user.accessToken)
      toast.success('멤버가 삭제되었습니다')
      if (isLastMember) {
        setOpen(false)
        onMembersUpdate?.()
      } else {
        setCurrentMemberIndex((prev) => prev + 1)
      }
    } catch (error) {
      console.error(error)
      toast.error('멤버 삭제에 실패했습니다')
    }
  }

  const handleSubmit = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      await handleUpdateMember(currentMember.userId)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setCurrentMemberIndex(0)
      setEditingMemberPositions({})
    }
  }

  const handlePositionChange = (newValue: any) => {
    if (!currentMember) return
    const positions = newValue.map((v: any) => v.value as Position)
    setEditingMemberPositions((prev) => ({
      ...prev,
      [currentMember.userId]: positions,
    }))
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="cmoutline" disabled={disabled}>
          <UserPen className="w-4 h-4" />
          멤버 정보 수정
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            멤버 정보 수정 ({currentMemberIndex + 1}/{members.length})
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {currentMember && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">
                  {currentMember.name}
                  {currentMember.profile.role?.includes('PRODUCT_MANAGER') && (
                    <span className="ml-2 text-sm text-gray-500">
                      (Product Manager)
                    </span>
                  )}
                </h4>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveMember(currentMember.userId)}
                  disabled={isSubmitting}
                >
                  삭제
                </Button>
              </div>
              {!currentMember.profile.role?.includes('PRODUCT_MANAGER') && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">포지션</label>
                    <div className="relative">
                      <CreatableSelect
                        isMulti
                        options={ROLE_OPTIONS}
                        value={(
                          editingMemberPositions[currentMember.userId] || []
                        ).map((pos) => ({ label: pos, value: pos }))}
                        onChange={handlePositionChange}
                        placeholder="포지션을 선택하세요"
                        isDisabled={isSubmitting}
                        styles={selectStyles}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <DialogFooter className="flex justify-between">
          <Button
            variant="cmoutline"
            onClick={() => setCurrentMemberIndex((prev) => prev - 1)}
            disabled={isFirstMember || isSubmitting}
          >
            이전
          </Button>
          <Button variant="cm" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? '수정 중...' : isLastMember ? '완료' : '다음'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
