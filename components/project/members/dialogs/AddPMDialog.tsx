import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

interface AddPMDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddPMDialog({ open, onOpenChange }: AddPMDialogProps) {
  const [email, setEmail] = useState('')

  const handleAddPM = async () => {
    // TODO: API 호출 구현
    console.log('Add PM:', { email })
    onOpenChange(false)
    setEmail('')
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
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAddPM}>추가</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
