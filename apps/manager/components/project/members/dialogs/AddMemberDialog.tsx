import { useAuthStore } from '@/stores/useAuthStore'
import { addMember } from '@cm/api/member'
import { Position } from '@cm/types/NewProjectTeamMember'
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
import { selectStyles } from '@cm/ui/lib/select-styles'
import { UserPlus } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import CreatableSelect from 'react-select/creatable'
import { toast } from 'sonner'

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
    if (!user?.accessToken || !projectId) {
      toast.error('로그인이 필요합니다')
      return
    }

    if (!email || !email.includes('@')) {
      toast.error('올바른 이메일 형식이 아닙니다')
      return
    }

    if (positions.length === 0) {
      toast.error('포지션을 하나 이상 선택해주세요')
      return
    }

    setIsSubmitting(true)
    try {
      await addMember(
        projectId as string,
        email,
        positions,
        'DEVELOPER',
        user.accessToken
      )
      toast.success('멤버가 추가되었습니다')
      onOpenChange(false)
      onMembersUpdate?.()
      setEmail('')
      setPositions([])
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('멤버 추가에 실패했습니다')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="cmoutline">
          <UserPlus className="w-4 h-4" />
          멤버 추가
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 멤버 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              이메일
            </label>
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">포지션</label>
            <CreatableSelect
              isMulti
              options={ROLE_OPTIONS}
              value={positions.map((pos) => ({ label: pos, value: pos }))}
              onChange={(newValue) =>
                setPositions(newValue.map((v) => v.value as Position))
              }
              placeholder="포지션을 선택하세요"
              isDisabled={isSubmitting}
              styles={selectStyles}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="cmoutline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button
            variant="cm"
            onClick={handleAddMember}
            disabled={isSubmitting}
          >
            {isSubmitting ? '추가 중...' : '추가'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
