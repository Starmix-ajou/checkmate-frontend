import { useAuthStore } from '@/stores/useAuthStore'
import { Button } from '@cm/ui/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@cm/ui/components/ui/dialog'
import { Input } from '@cm/ui/components/ui/input'
import { Label } from '@cm/ui/components/ui/label'
import { useState } from 'react'

type NewEpicModalProps = {
  isOpen: boolean
  onClose: () => void
  projectId: string
  onSuccess?: () => void
}

export default function NewEpicModal({
  isOpen,
  onClose,
  projectId,
  onSuccess,
}: NewEpicModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const user = useAuthStore((state) => state.user)

  const handleSubmit = async () => {
    if (!user?.accessToken) return

    try {
      setIsSubmitting(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/epic?projectId=${projectId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.accessToken}`,
          },
          body: JSON.stringify({
            title,
            description,
          }),
        }
      )

      if (!response.ok) {
        throw new Error('에픽 생성에 실패했습니다.')
      }

      // 성공 시 모달 닫기
      onClose()
      // 입력 필드 초기화
      setTitle('')
      setDescription('')
      // 성공 콜백 호출
      onSuccess?.()
    } catch (error) {
      console.error('에픽 생성 실패:', error)
      alert('에픽 생성에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Epic</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title" className="ml-1.5">
              Title
            </Label>
            <Input
              id="title"
              placeholder="Epic 제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description" className="ml-1.5">
              Description
            </Label>
            <textarea
              id="description"
              placeholder="Epic에 대한 설명을 입력하세요"
              className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            취소
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={!title || isSubmitting}
          >
            {isSubmitting ? '생성 중...' : '생성'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
