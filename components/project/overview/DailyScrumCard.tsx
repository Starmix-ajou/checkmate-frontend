'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

type Category = 'Done' | 'TODO' | 'Issue'

export default function DailyScrumCard() {
  const [tasks, setTasks] = useState([
    { id: 1, text: '로그인 UI 구현', category: 'Done', checked: true },
    { id: 2, text: '대시보드 UI 구현', category: 'TODO', checked: false },
    { id: 3, text: '로그인 OAuth 오류', category: 'Issue', checked: false },
    { id: 4, text: 'PR Template 구성', category: 'Done', checked: true },
    { id: 5, text: '사이드바 컴포넌트 생성', category: 'TODO', checked: false },
    { id: 6, text: '모듈 충돌', category: 'Issue', checked: false },
    { id: 7, text: 'User Story Mapping', category: 'TODO', checked: false },
  ])

  const [newTask, setNewTask] = useState<{ [key in Category]: string }>({
    Done: '',
    TODO: '',
    Issue: '',
  })

  const toggleCheck = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, checked: !task.checked } : task
      )
    )
  }

  const handleAddTask = (category: Category) => {
    if (!newTask[category].trim()) return

    setTasks((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        text: newTask[category],
        category,
        checked: false,
      },
    ])
    setNewTask((prev) => ({ ...prev, [category]: '' }))
  }

  return (
    <Card className="col-span-2 row-span-2">
      <CardHeader>
        <CardTitle>Daily Scrum</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3">
          {(['Done', 'TODO', 'Issue'] as const).map((category) => (
            <div
              key={category}
              className={`px-4 ${category !== 'Issue' ? 'border-r border-gray-300' : ''}`}
            >
              <h3 className="text-lg font-semibold mb-2">{category}</h3>

              <ul className="space-y-2">
                {tasks
                  .filter((task) => task.category === category)
                  .map((task) => (
                    <li key={task.id} className="flex items-center gap-2">
                      <Checkbox
                        checked={task.checked}
                        onCheckedChange={() => toggleCheck(task.id)}
                      />
                      <span
                        className={
                          task.checked ? 'line-through text-gray-500' : ''
                        }
                      >
                        {task.text}
                      </span>
                    </li>
                  ))}
              </ul>
              <div className="mt-4 flex gap-2">
                <Input
                  placeholder={`새로운 ${category} 추가`}
                  value={newTask[category]}
                  onChange={(e) =>
                    setNewTask((prev) => ({
                      ...prev,
                      [category]: e.target.value,
                    }))
                  }
                  onKeyDown={(e) =>
                    e.key === 'Enter' && handleAddTask(category)
                  }
                />
                <Button size="sm" onClick={() => handleAddTask(category)}>
                  추가
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
