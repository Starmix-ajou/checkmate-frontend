import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Position, Stack } from '@/types/NewProjectTeamMember'
import Image from 'next/image'
import { useState } from 'react'
import CreatableSelect from 'react-select/creatable'

interface Member {
  userId: string
  name: string
  email: string
  profileImageUrl: string
  profiles: {
    stacks: string[]
    positions: string[]
    projectId: string
  }[]
  role: string
}

interface MembersListProps {
  members: Member[]
}

const getEnumOptions = (e: object) =>
  Object.values(e).map((value) => ({ label: value, value }))

const ROLE_OPTIONS = getEnumOptions(Position)
const STACK_OPTIONS = getEnumOptions(Stack)

export default function MembersList({ members }: MembersListProps) {
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set())
  const [isAllSelected, setIsAllSelected] = useState(false)
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [isAddPMOpen, setIsAddPMOpen] = useState(false)
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [newMemberStacks, setNewMemberStacks] = useState<Stack[]>([])
  const [newMemberPositions, setNewMemberPositions] = useState<Position[]>([])
  const [newPMEmail, setNewPMEmail] = useState('')
  const [editingMemberStacks, setEditingMemberStacks] = useState<
    Record<string, Stack[]>
  >({})
  const [editingMemberPositions, setEditingMemberPositions] = useState<
    Record<string, Position[]>
  >({})

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMembers(new Set(members.map((member) => member.userId)))
      setIsAllSelected(true)
    } else {
      setSelectedMembers(new Set())
      setIsAllSelected(false)
    }
  }

  const handleSelectMember = (userId: string, checked: boolean) => {
    const newSelected = new Set(selectedMembers)
    if (checked) {
      newSelected.add(userId)
    } else {
      newSelected.delete(userId)
    }
    setSelectedMembers(newSelected)
    setIsAllSelected(newSelected.size === members.length)
  }

  const handleAddMember = async () => {
    // TODO: API 호출 구현
    console.log('Add member:', {
      email: newMemberEmail,
      stacks: newMemberStacks,
      positions: newMemberPositions,
    })
    setIsAddMemberOpen(false)
    setNewMemberEmail('')
    setNewMemberStacks([])
    setNewMemberPositions([])
  }

  const handleAddPM = async () => {
    // TODO: API 호출 구현
    console.log('Add PM:', { email: newPMEmail })
    setIsAddPMOpen(false)
    setNewPMEmail('')
  }

  const handleUpdateMember = async (memberId: string) => {
    // TODO: API 호출 구현
    console.log('Update member:', {
      memberId,
      stacks: editingMemberStacks[memberId],
      positions: editingMemberPositions[memberId],
    })
  }

  const selectedMembersList = members.filter((member) =>
    selectedMembers.has(member.userId)
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Dialog open={isAddPMOpen} onOpenChange={setIsAddPMOpen}>
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
                  value={newPMEmail}
                  onChange={(e) => setNewPMEmail(e.target.value)}
                  placeholder="example@email.com"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddPM}>추가</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div className="flex gap-2">
          <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
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
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
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
                      (option) =>
                        !newMemberStacks.includes(option.value as Stack)
                    )}
                    value={null}
                    onChange={(option) => {
                      if (!option) return
                      const newStack = option.value as Stack
                      if (!newMemberStacks.includes(newStack)) {
                        setNewMemberStacks([...newMemberStacks, newStack])
                      }
                    }}
                    placeholder="스택을 추가하거나 입력하세요"
                    className="w-full"
                    isClearable
                    formatCreateLabel={(inputValue) => `"${inputValue}" 추가`}
                  />
                  <div className="flex flex-wrap gap-1 mt-2">
                    {newMemberStacks.map((stack, idx) => (
                      <Badge key={idx} className="flex items-center gap-1">
                        {stack}
                        <button
                          type="button"
                          onClick={() => {
                            setNewMemberStacks(
                              newMemberStacks.filter((item) => item !== stack)
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
                <div className="grid gap-2">
                  <label className="text-sm font-medium">포지션</label>
                  <CreatableSelect
                    menuPlacement="auto"
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                    options={ROLE_OPTIONS.filter(
                      (option) =>
                        !newMemberPositions.includes(option.value as Position)
                    )}
                    value={null}
                    onChange={(option) => {
                      if (!option) return
                      const newPosition = option.value as Position
                      if (!newMemberPositions.includes(newPosition)) {
                        setNewMemberPositions([
                          ...newMemberPositions,
                          newPosition,
                        ])
                      }
                    }}
                    placeholder="역할을 선택하거나 입력하세요"
                    className="w-full"
                    isClearable
                    formatCreateLabel={(inputValue) => `"${inputValue}" 추가`}
                  />
                  <div className="flex flex-wrap gap-1 mt-2">
                    {newMemberPositions.map((position, idx) => (
                      <Badge key={idx} className="flex items-center gap-1">
                        {position}
                        <button
                          type="button"
                          onClick={() => {
                            setNewMemberPositions(
                              newMemberPositions.filter(
                                (item) => item !== position
                              )
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

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="cmoutline" disabled={selectedMembers.size === 0}>
                선택된 멤버 정보 수정
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>멤버 정보 수정</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {selectedMembersList.map((member) => (
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
                          formatCreateLabel={(inputValue) =>
                            `"${inputValue}" 추가`
                          }
                        />
                        <div className="flex flex-wrap gap-1 mt-2">
                          {(
                            editingMemberStacks[member.userId] ||
                            member.profiles[0]?.stacks ||
                            []
                          ).map((stack, idx) => (
                            <Badge
                              key={idx}
                              className="flex items-center gap-1"
                            >
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
                                [member.userId]: [
                                  ...currentPositions,
                                  newPosition,
                                ],
                              })
                            }
                          }}
                          placeholder="역할을 선택하거나 입력하세요"
                          className="w-full"
                          isClearable
                          formatCreateLabel={(inputValue) =>
                            `"${inputValue}" 추가`
                          }
                        />
                        <div className="flex flex-wrap gap-1 mt-2">
                          {(
                            editingMemberPositions[member.userId] ||
                            member.profiles[0]?.positions ||
                            []
                          ).map((position, idx) => (
                            <Badge
                              key={idx}
                              className="flex items-center gap-1"
                            >
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
              <DialogFooter>
                <Button
                  onClick={() =>
                    selectedMembersList.forEach((member) =>
                      handleUpdateMember(member.userId)
                    )
                  }
                >
                  수정 완료
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>이름</TableHead>
            <TableHead>이메일</TableHead>
            <TableHead>기술 스택</TableHead>
            <TableHead>포지션</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.userId}>
              <TableCell>
                <Checkbox
                  checked={selectedMembers.has(member.userId)}
                  onCheckedChange={(checked) =>
                    handleSelectMember(member.userId, checked as boolean)
                  }
                />
              </TableCell>
              <TableCell className="flex items-center gap-2">
                {member.profileImageUrl && (
                  <Image
                    src={member.profileImageUrl}
                    alt={member.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                {member.name}
              </TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {member.profiles[0]?.stacks.map((stack) => (
                    <Badge key={stack} variant="secondary">
                      {stack}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {member.profiles[0]?.positions.map((position) => (
                    <Badge key={position} variant="outline">
                      {position}
                    </Badge>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
