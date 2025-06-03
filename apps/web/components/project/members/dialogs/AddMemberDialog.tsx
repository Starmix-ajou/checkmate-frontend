import { Position } from '@cm/types/NewProjectTeamMember'
import { addMember } from '@cm/api/member'
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
import { Input } from '@cm/ui/components/ui/input'
import { useState } from 'react'
import CreatableSelect from 'react-select/creatable'
import { toast } from 'react-toastify'

const getEnumOptions = (e: object) =>
  Object.values(e).map((value) => ({ label: value, value }))

const ROLE_OPTIONS = getEnumOptions(Position)

interface AddMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onMembersUpdate?: () => void
}

export function AddMemberDialog({
  open,
  onOpenChange,
  onMembersUpdate,
}: AddMemberDialogProps) {
  const { id: projectId } = useParams()
  const user = useAuthStore((state) => state.user)
  const [email, setEmail] = useState('')
  const [positions, setPositions] = useState<Position[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddMember = async () => {
    if (!user?.accessToken || !projectId || !email || positions.length === 0) {
      toast.error('이메일과 포지션을 모두 입력해주세요')
      return
    }

    setIsSubmitting(true)
    try {
      await addMember(projectId as string, email, positions, user.accessToken)
      toast.success('멤버가 추가되었습니다')
      onOpenChange(false)
      onMembersUpdate?.()
      setEmail('')
      setPositions([])
    } catch (error) {
      console.error(error)
      toast.error('멤버 추가에 실패했습니다')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="cmoutline">멤버 추가</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>새 멤버 추가</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">이메일</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              disabled={isSubmitting}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">포지션</label>
            <CreatableSelect
              menuPlacement="auto"
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
              options={ROLE_OPTIONS.filter(
                (option) => !positions.includes(option.value as Position)
              )}
              value={null}
              onChange={(option) => {
                if (!option) return
                const newPosition = option.value as Position
                if (!positions.includes(newPosition)) {
                  setPositions([...positions, newPosition])
                }
              }}
              placeholder="역할을 선택하거나 입력하세요"
              className="w-full"
              isClearable
              isDisabled={isSubmitting}
              formatCreateLabel={(inputValue) => `"${inputValue}" 추가`}
            />
            <div className="flex flex-wrap gap-1 mt-2">
              {positions.map((position, idx) => (
                <Badge key={idx} className="flex items-center gap-1">
                  {position}
                  <button
                    type="button"
                    onClick={() => {
                      if (isSubmitting) return
                      setPositions(
                        positions.filter((item) => item !== position)
                      )
                    }}
                    className="ml-1 text-xs"
                    disabled={isSubmitting}
                  >
                    ✕
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAddMember} disabled={isSubmitting}>
            {isSubmitting ? '추가 중...' : '추가'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
