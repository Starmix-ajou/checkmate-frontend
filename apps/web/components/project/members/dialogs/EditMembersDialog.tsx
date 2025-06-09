import { useAuthStore } from '@/stores/useAuthStore'
import { removeMember, updateMemberPositions } from '@cm/api/member'
import { Position } from '@cm/types/NewProjectTeamMember'
import { Member } from '@cm/types/project'
import { Badge } from '@cm/ui/components/ui/badge'
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
import { useState } from 'react'
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
      onMembersUpdate?.()
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
      setOpen(false)
      onMembersUpdate?.()
    } catch (error) {
      console.error(error)
      toast.error('멤버 삭제에 실패했습니다')
    }
  }

  const handleSubmit = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      await Promise.all(
        members.map((member) => handleUpdateMember(member.userId))
      )
      setOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="cmoutline" disabled={disabled}>
          <UserPen className="w-4 h-4" />
          멤버 정보 수정
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>멤버 정보 수정</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 overflow-y-auto flex-1">
          {members.map((member) => {
            const isProductManager =
              member.profile.role?.includes('PRODUCT_MANAGER')
            return (
              <div key={member.userId} className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">
                    {member.name}
                    {isProductManager && (
                      <span className="ml-2 text-sm text-gray-500">
                        (Product Manager)
                      </span>
                    )}
                  </h4>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveMember(member.userId)}
                    disabled={isSubmitting}
                  >
                    삭제
                  </Button>
                </div>
                {!isProductManager && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">포지션</label>
                      <div className="relative z-[9999]">
                        <CreatableSelect
                          isMulti
                          options={ROLE_OPTIONS}
                          value={
                            editingMemberPositions[member.userId]?.map(
                              (pos) => ({ label: pos, value: pos })
                            ) || []
                          }
                          onChange={(newValue) =>
                            setEditingMemberPositions({
                              ...editingMemberPositions,
                              [member.userId]: newValue.map(
                                (v) => v.value as Position
                              ),
                            })
                          }
                          placeholder="포지션을 선택하세요"
                          isDisabled={isSubmitting}
                          styles={selectStyles}
                        />
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {(
                          editingMemberPositions[member.userId] ||
                          member.profile.positions ||
                          []
                        ).map((position, idx) => (
                          <Badge key={idx} className="flex items-center gap-1">
                            {position}
                            <button
                              type="button"
                              onClick={() => {
                                const currentPositions =
                                  editingMemberPositions[member.userId] ||
                                  member.profile.positions ||
                                  []
                                setEditingMemberPositions({
                                  ...editingMemberPositions,
                                  [member.userId]: currentPositions.filter(
                                    (item) => item !== position
                                  ),
                                })
                              }}
                              className="ml-1 text-xs"
                            >
                              ✕
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <DialogFooter className="flex-shrink-0">
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? '수정 중...' : '수정 완료'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
