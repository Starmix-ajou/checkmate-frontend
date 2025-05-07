'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { UserIcon } from 'lucide-react'
import { useState } from 'react'

type Category = 'Done' | 'TODO'

interface Task {
  id: number
  text: string
  category: Category
  memberId: number
}

interface Member {
  id: number
  name: string
  avatar: string
}

export default function DailyScrumCard() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: '로그인 UI 구현', category: 'Done', memberId: 1 },
    { id: 2, text: '대시보드 UI 구현', category: 'TODO', memberId: 1 },
    { id: 3, text: 'PR Template 구성', category: 'Done', memberId: 2 },
    { id: 4, text: '사이드바 컴포넌트 생성', category: 'TODO', memberId: 2 },
    { id: 5, text: '유저 스토리 작성', category: 'TODO', memberId: 3 },
  ])

  const members: Member[] = [
    { id: 1, name: '한도연', avatar: '/avatars/kitty.png' },
    { id: 2, name: '김평주', avatar: '/avatars/blank.png' },
    { id: 3, name: '조성연', avatar: '/avatars/crayon.png' },
    { id: 4, name: '박승연', avatar: '/avatars/crayon.png' },
  ]

  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(
    members[0]?.id ?? null
  )
  const [newTask, setNewTask] = useState<{ [key in Category]: string }>({
    Done: '',
    TODO: '',
  })
  const [isAdding, setIsAdding] = useState<{ [key in Category]: boolean }>({
    Done: false,
    TODO: false,
  })

  const handleAddTask = (category: Category) => {
    const content = newTask[category].trim()
    if (!content || selectedMemberId === null) return

    setTasks((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        text: content,
        category,
        memberId: selectedMemberId,
      },
    ])
    setNewTask((prev) => ({ ...prev, [category]: '' }))
    setIsAdding((prev) => ({ ...prev, [category]: false }))
  }

  const filteredTasks = (category: Category) =>
    tasks.filter(
      (t) => t.category === category && t.memberId === selectedMemberId
    )

  return (
    <Card className="col-span-2 row-span-2">
      <CardHeader>
        <CardTitle>데일리 스크럼</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[1fr_2fr_2fr] gap-2 items-start">
          <div className="grid grid-cols-2 gap-2">
            {members.map((member) => {
              const isSelected = selectedMemberId === member.id
              return (
                <button
                  key={member.id}
                  onClick={() => setSelectedMemberId(member.id)}
                  className="flex flex-col items-center gap-1"
                >
                  <Avatar
                    className={`w-10 h-10 transition-all bg-cm-light ${
                      isSelected
                        ? 'ring-2 ring-cm'
                        : 'opacity-50 hover:opacity-100'
                    }`}
                  >
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>
                      <UserIcon className="w-4 h-4 text-gray-400" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-center">{member.name}</span>
                </button>
              )
            })}
          </div>

          <div className="px-2">
            <div className="text-center text-cm-green text-sm font-semibold bg-cm-green-light py-1 rounded">
              어제 한 일
            </div>
            <div className="mt-2 flex flex-col gap-2">
              {filteredTasks('Done').map((task) => (
                <Card
                  key={task.id}
                  className="text-sm px-2 py-2 shadow-none rounded-md"
                >
                  {task.text}
                </Card>
              ))}
              {isAdding['Done'] ? (
                <div className="flex gap-2 mt-1">
                  <Input
                    value={newTask['Done']}
                    onChange={(e) =>
                      setNewTask((prev) => ({ ...prev, Done: e.target.value }))
                    }
                    onKeyDown={(e) =>
                      e.key === 'Enter' && handleAddTask('Done')
                    }
                    placeholder="새로운 항목"
                  />
                  <Button size="sm" onClick={() => handleAddTask('Done')}>
                    추가
                  </Button>
                </div>
              ) : (
                <button
                  onClick={() =>
                    setIsAdding((prev) => ({ ...prev, Done: true }))
                  }
                  className="text-sm text-gray-500 hover:underline text-left"
                >
                  + Add
                </button>
              )}
            </div>
          </div>

          <div className="px-2">
            <div className="text-center text-cm-gray text-sm font-semibold bg-cm-gray-light py-1 rounded">
              오늘 할 일
            </div>
            <div className="mt-2 flex flex-col gap-2">
              {filteredTasks('TODO').map((task) => (
                <Card
                  key={task.id}
                  className="text-sm px-2 py-2 shadow-none rounded-md"
                >
                  {task.text}
                </Card>
              ))}
              {isAdding['TODO'] ? (
                <div className="flex gap-2 mt-1">
                  <Input
                    value={newTask['TODO']}
                    onChange={(e) =>
                      setNewTask((prev) => ({ ...prev, TODO: e.target.value }))
                    }
                    onKeyDown={(e) =>
                      e.key === 'Enter' && handleAddTask('TODO')
                    }
                    placeholder="새로운 항목"
                  />
                  <Button size="sm" onClick={() => handleAddTask('TODO')}>
                    추가
                  </Button>
                </div>
              ) : (
                <button
                  onClick={() =>
                    setIsAdding((prev) => ({ ...prev, TODO: true }))
                  }
                  className="text-sm text-gray-500 hover:underline text-left"
                >
                  + Add
                </button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
