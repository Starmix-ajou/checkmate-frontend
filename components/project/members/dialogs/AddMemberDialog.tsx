import { Badge } from '@/components/ui/badge'
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
import { Position, Stack } from '@/types/NewProjectTeamMember'
import { useState } from 'react'
import CreatableSelect from 'react-select/creatable'

const getEnumOptions = (e: object) =>
  Object.values(e).map((value) => ({ label: value, value }))

const ROLE_OPTIONS = getEnumOptions(Position)
const STACK_OPTIONS = getEnumOptions(Stack)

interface AddMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddMemberDialog({ open, onOpenChange }: AddMemberDialogProps) {
  const [email, setEmail] = useState('')
  const [stacks, setStacks] = useState<Stack[]>([])
  const [positions, setPositions] = useState<Position[]>([])

  const handleAddMember = async () => {
    // TODO: API 호출 구현
    console.log('Add member:', {
      email,
      stacks,
      positions,
    })
    onOpenChange(false)
    setEmail('')
    setStacks([])
    setPositions([])
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
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">기술 스택</label>
            <CreatableSelect
              menuPlacement="auto"
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
              options={STACK_OPTIONS.filter(
                (option) => !stacks.includes(option.value as Stack)
              )}
              value={null}
              onChange={(option) => {
                if (!option) return
                const newStack = option.value as Stack
                if (!stacks.includes(newStack)) {
                  setStacks([...stacks, newStack])
                }
              }}
              placeholder="스택을 추가하거나 입력하세요"
              className="w-full"
              isClearable
              formatCreateLabel={(inputValue) => `"${inputValue}" 추가`}
            />
            <div className="flex flex-wrap gap-1 mt-2">
              {stacks.map((stack, idx) => (
                <Badge key={idx} className="flex items-center gap-1">
                  {stack}
                  <button
                    type="button"
                    onClick={() => {
                      setStacks(stacks.filter((item) => item !== stack))
                    }}
                    className="ml-1 text-xs"
                  >
                    ✕
                  </button>
                </Badge>
              ))}
            </div>
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
              formatCreateLabel={(inputValue) => `"${inputValue}" 추가`}
            />
            <div className="flex flex-wrap gap-1 mt-2">
              {positions.map((position, idx) => (
                <Badge key={idx} className="flex items-center gap-1">
                  {position}
                  <button
                    type="button"
                    onClick={() => {
                      setPositions(
                        positions.filter((item) => item !== position)
                      )
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
        <DialogFooter>
          <Button onClick={handleAddMember}>추가</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
