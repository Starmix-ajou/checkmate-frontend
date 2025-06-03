import { useAuthStore } from '@/stores/useAuthStore'
import { addMember } from '@cm/api/member'
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
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-toastify'

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
    if (!user?.accessToken || !projectId || !email) {
      toast.error('이메일을 입력해주세요')
      return
    }

    setIsSubmitting(true)
    try {
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
      console.error(error)
      toast.error('Product Manager 추가에 실패했습니다')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="cm">Product Manager 추가</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Product Manager 추가</DialogTitle>
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
        </div>
        <DialogFooter>
          <Button onClick={handleAddPM} disabled={isSubmitting}>
            {isSubmitting ? '추가 중...' : '추가'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
