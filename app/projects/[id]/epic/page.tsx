'use client'

import { Gantt } from '@/components/project/epic/gantt/gantt'
import { allTasks } from '@/components/project/epic/sampleTasks'
import { Task, ViewMode } from '@/types/public-types'
import { useState } from 'react'

export default function ProjectEpic() {
  const [tasks, setTasks] = useState(allTasks)

  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Week)
  const handleDateChange = (task: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === task.id
          ? { ...t, start: new Date(task.start), end: new Date(task.end) }
          : t
      )
    )
  }
  const handleProgressChange = (task: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === task.id ? { ...t, progress: task.progress } : t
      )
    )
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex gap-2">
        <button
          className="px-3 py-1 border rounded bg-gray-200"
          onClick={() => setViewMode(ViewMode.Day)}
        >
          일별 보기
        </button>
        <button
          className="px-3 py-1 border rounded bg-gray-200"
          onClick={() => setViewMode(ViewMode.Week)}
        >
          주별 보기
        </button>
        <button
          className="px-3 py-1 border rounded bg-gray-200"
          onClick={() => setViewMode(ViewMode.Month)}
        >
          월별 보기
        </button>
      </div>
      <Gantt
        tasks={tasks}
        viewMode={viewMode}
        onDateChange={handleDateChange}
        onProgressChange={handleProgressChange}
      />
    </div>
  )
}
