import { useAuthStore } from '@/stores/useAuthStore'
import { Task } from '@cm/types/userTask'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@cm/ui/components/ui/dialog'
import { KeyRound, Milestone, Swords } from 'lucide-react'
import { ChangeEvent, useEffect, useState } from 'react'

interface MiniRetroDialogProps {
  isOpen: boolean
  onClose: () => void
  taskId: string
  onSave: () => void
  getTaskById: (taskId: string) => Promise<Task>
}

export default function MiniRetroDialog({
  isOpen,
  onClose,
  taskId,
  onSave,
  getTaskById,
}: MiniRetroDialogProps) {
  const user = useAuthStore((state) => state.user)
  const [learned, setLearned] = useState('')
  const [difficulties, setDifficulties] = useState('')
  const [nextTasks, setNextTasks] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [currentTask, setCurrentTask] = useState<Task | null>(null)

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const task = await getTaskById(taskId)
        setCurrentTask(task)
        setLearned(task.review?.learn || '')
        setDifficulties(task.review?.hardest || '')
        setNextTasks(task.review?.next || '')
      } catch (error) {
        console.error('태스크 정보를 불러오는데 실패했습니다:', error)
      }
    }

    if (isOpen && taskId) {
      fetchTask()
    }
  }, [isOpen, taskId, getTaskById])

  const handleSave = async () => {
    if (!user?.accessToken || !currentTask) {
      console.error('인증 토큰이 없거나 태스크 정보가 없습니다.')
      return
    }

    try {
      setIsSaving(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/task/${taskId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.accessToken}`,
          },
          body: JSON.stringify({
            title: currentTask.title,
            description: currentTask.description || '',
            status: currentTask.status,
            assigneeEmail: currentTask.assignee?.email || '',
            startDate: currentTask.startDate,
            endDate: currentTask.endDate,
            priority: currentTask.priority,
            epicId: currentTask.epic.epicId,
            review: {
              learn: learned,
              hardest: difficulties,
              next: nextTasks,
            },
          }),
        }
      )

      if (!response.ok) {
        throw new Error('회고록 저장에 실패했습니다.')
      }

      onSave()
      onClose()
    } catch (error) {
      console.error('회고록 저장 실패:', error)
      alert('회고록 저장에 실패했습니다.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Task를 돌아보며
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <div className="flex items-center">
              <KeyRound size={16} className="text-[#FDB748] mx-2" />
              <label
                htmlFor="learned"
                className="text-sm font-medium text-gray-700"
              >
                새롭게 배운 것이 있다면 무엇인가요?
              </label>
            </div>
            <textarea
              id="learned"
              value={learned}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setLearned(e.target.value)
              }
              placeholder="이번 Task를 통해 학습한 기술이나 개념 등 간단히 적어보세요."
              className="w-full min-h-[100px] px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cm focus:border-transparent resize-none"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <Swords size={16} className="text-[#F26673] mx-2" />
              <label
                htmlFor="difficulties"
                className="text-sm font-medium text-gray-700"
              >
                가장 어려웠거나 예상보다 시간이 걸린 부분은 무엇이었나요?
              </label>
            </div>
            <textarea
              id="difficulties"
              value={difficulties}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setDifficulties(e.target.value)
              }
              placeholder="어떤 부분에서 막혔는지, 예상보다 오래 걸린 이유가 무엇이었는지 간단히 적어보세요."
              className="w-full min-h-[100px] px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cm focus:border-transparent resize-none"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <Milestone size={16} className="text-[#5585F7] mx-2" />
              <label
                htmlFor="nextTasks"
                className="text-sm font-medium text-gray-700"
              >
                다음에 어떤 Task를 해볼 예정인가요?
              </label>
            </div>
            <textarea
              id="nextTasks"
              value={nextTasks}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setNextTasks(e.target.value)
              }
              placeholder="바로 이어서 할 Task나, 진행 중 떠오른 아이디어가 있다면 간단히 적어보세요."
              className="w-full min-h-[100px] px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cm focus:border-transparent resize-none"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer"
            disabled={isSaving}
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-cm rounded-md hover:bg-cm-700 disabled:opacity-50 cursor-pointer"
            disabled={isSaving}
          >
            {isSaving ? '저장 중...' : '저장'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
