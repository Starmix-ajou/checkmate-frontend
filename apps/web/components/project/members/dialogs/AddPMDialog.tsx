import { useAuthStore } from '@/stores/useAuthStore'
import { addMember, getProjectMembers } from '@cm/api/member'
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
import { ShieldUser } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

interface AddPMDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onMembersUpdate?: () => void
}

export function AddPMDialog({
  open,
  onOpenChange,
  onMembersUpdate,
}: AddPMDialogProps) {
  const { id: projectId } = useParams()
  const user = useAuthStore((state) => state.user)
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddPM = async () => {
    if (!user?.accessToken || !projectId) {
      toast.error('로그인이 필요합니다')
      return
    }

    if (!email || !email.includes('@')) {
      toast.error('올바른 이메일 형식이 아닙니다')
      return
    }

    setIsSubmitting(true)
    try {
      const { members, leader, productManager } = await getProjectMembers(
        projectId as string,
        user.accessToken
      )

      const isAlreadyMember = [...members, leader, productManager].some(
        (member) => member?.email.toLowerCase() === email.toLowerCase()
      )

      if (isAlreadyMember) {
        toast.error('이미 프로젝트 팀원인 사용자입니다')
        return
      }

      await addMember(
        projectId as string,
        email,
        [],
        'PRODUCT_MANAGER',
        user.accessToken
      )
      toast.success('Product Manager가 추가되었습니다')
      onOpenChange(false)
      onMembersUpdate?.()
      setEmail('')
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Product Manager 추가에 실패했습니다')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="cm">
          <ShieldUser className="w-4 h-4" />
          Product Manager 추가
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Product Manager 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              이메일
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              disabled={isSubmitting}
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
          <Button variant="cm" onClick={handleAddPM} disabled={isSubmitting}>
            {isSubmitting ? '추가 중...' : '추가'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
