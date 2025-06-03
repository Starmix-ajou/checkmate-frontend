import { Position } from '@cm/types/NewProjectTeamMember'
import { Member } from '@cm/types/project'
import { updateMemberPositions, removeMember } from '@cm/api/member'
import { useAuthStore } from '@/stores/useAuthStore'
import { useParams } from 'next/navigation'
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
import { useState } from 'react'
import CreatableSelect from 'react-select/creatable'
import { toast } from 'react-toastify'

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
      await Promise.all(members.map((member) => handleUpdateMember(member.userId)))
      setOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="cmoutline" disabled={disabled}>
          선택된 멤버 정보 수정
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>멤버 정보 수정</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 overflow-y-auto flex-1">
          {members.map((member) => (
            <div key={member.userId} className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">{member.name}</h4>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveMember(member.userId)}
                  disabled={isSubmitting}
                >
                  삭제
                </Button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">포지션</label>
                  <CreatableSelect
                    menuPlacement="auto"
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                    options={ROLE_OPTIONS.filter(
                      (option) =>
                        !(
                          editingMemberPositions[member.userId] ||
                          member.profile.positions ||
                          []
                        ).includes(option.value as Position)
                    )}
                    value={null}
                    onChange={(option) => {
                      if (!option) return
                      const newPosition = option.value as Position
                      const currentPositions =
                        editingMemberPositions[member.userId] ||
                        member.profile.positions ||
                        []
                      if (!currentPositions.includes(newPosition)) {
                        setEditingMemberPositions({
                          ...editingMemberPositions,
                          [member.userId]: [...currentPositions, newPosition],
                        })
                      }
                    }}
                    placeholder="역할을 선택하거나 입력하세요"
                    className="w-full"
                    isClearable
                    formatCreateLabel={(inputValue) => `"${inputValue}" 추가`}
                  />
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
            </div>
          ))}
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
