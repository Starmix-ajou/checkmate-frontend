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
import { Position, Stack } from '@/types/NewProjectTeamMember'
import { Member } from '@/types/project'
import { useState } from 'react'
import CreatableSelect from 'react-select/creatable'

const getEnumOptions = (e: object) =>
  Object.values(e).map((value) => ({ label: value, value }))

const ROLE_OPTIONS = getEnumOptions(Position)
const STACK_OPTIONS = getEnumOptions(Stack)

interface EditMembersDialogProps {
  members: Member[]
  disabled: boolean
}

export function EditMembersDialog({
  members,
  disabled,
}: EditMembersDialogProps) {
  const [editingMemberStacks, setEditingMemberStacks] = useState<
    Record<string, Stack[]>
  >({})
  const [editingMemberPositions, setEditingMemberPositions] = useState<
    Record<string, Position[]>
  >({})

  const handleUpdateMember = async (memberId: string) => {
    // TODO: API 호출 구현
    console.log('Update member:', {
      memberId,
      stacks: editingMemberStacks[memberId],
      positions: editingMemberPositions[memberId],
    })
  }

  return (
    <Dialog>
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
              <h4 className="font-medium">{member.name}</h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">기술 스택</label>
                  <CreatableSelect
                    menuPlacement="auto"
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                    options={STACK_OPTIONS.filter(
                      (option) =>
                        !(
                          editingMemberStacks[member.userId] ||
                          member.profiles[0]?.stacks ||
                          []
                        ).includes(option.value as Stack)
                    )}
                    value={null}
                    onChange={(option) => {
                      if (!option) return
                      const newStack = option.value as Stack
                      const currentStacks =
                        editingMemberStacks[member.userId] ||
                        member.profiles[0]?.stacks ||
                        []
                      if (!currentStacks.includes(newStack)) {
                        setEditingMemberStacks({
                          ...editingMemberStacks,
                          [member.userId]: [...currentStacks, newStack],
                        })
                      }
                    }}
                    placeholder="스택을 추가하거나 입력하세요"
                    className="w-full"
                    isClearable
                    formatCreateLabel={(inputValue) => `"${inputValue}" 추가`}
                  />
                  <div className="flex flex-wrap gap-1 mt-2">
                    {(
                      editingMemberStacks[member.userId] ||
                      member.profiles[0]?.stacks ||
                      []
                    ).map((stack, idx) => (
                      <Badge key={idx} className="flex items-center gap-1">
                        {stack}
                        <button
                          type="button"
                          onClick={() => {
                            const currentStacks =
                              editingMemberStacks[member.userId] ||
                              member.profiles[0]?.stacks ||
                              []
                            setEditingMemberStacks({
                              ...editingMemberStacks,
                              [member.userId]: currentStacks.filter(
                                (item) => item !== stack
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
                          member.profiles[0]?.positions ||
                          []
                        ).includes(option.value as Position)
                    )}
                    value={null}
                    onChange={(option) => {
                      if (!option) return
                      const newPosition = option.value as Position
                      const currentPositions =
                        editingMemberPositions[member.userId] ||
                        member.profiles[0]?.positions ||
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
                      member.profiles[0]?.positions ||
                      []
                    ).map((position, idx) => (
                      <Badge key={idx} className="flex items-center gap-1">
                        {position}
                        <button
                          type="button"
                          onClick={() => {
                            const currentPositions =
                              editingMemberPositions[member.userId] ||
                              member.profiles[0]?.positions ||
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
          <Button
            onClick={() =>
              members.forEach((member) => handleUpdateMember(member.userId))
            }
          >
            수정 완료
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
