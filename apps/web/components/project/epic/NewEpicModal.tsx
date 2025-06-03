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

type NewEpicModalProps = {
  isOpen: boolean
  onClose: () => void
  projectId: string
}

export default function NewEpicModal({
  isOpen,
  onClose,
  projectId,
}: NewEpicModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>새 에픽 생성</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">제목</Label>
            <Input id="title" placeholder="에픽 제목을 입력하세요" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">설명</Label>
            <Input
              id="description"
              placeholder="에픽에 대한 설명을 입력하세요"
              className="min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            취소
          </Button>
          <Button type="submit">생성</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
