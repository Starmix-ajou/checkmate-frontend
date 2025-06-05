import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@cm/ui/components/ui/dialog'
import { KeyRound, Milestone, Swords } from 'lucide-react'
import { ChangeEvent, useState } from 'react'

interface MiniRetroDialogProps {
  isOpen: boolean
  onClose: () => void
}

export default function MiniRetroDialog({
  isOpen,
  onClose,
}: MiniRetroDialogProps) {
  const [learned, setLearned] = useState('')
  const [difficulties, setDifficulties] = useState('')
  const [nextTasks, setNextTasks] = useState('')

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
              <KeyRound size={16} className="text-[#FFD66B] mx-2" />
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
              <Swords size={16} className="text-[#F75A5A] mx-2" />
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
              <Milestone size={16} className="text-[#4DA8DA] mx-2" />
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
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            취소
          </button>
          <button
            onClick={() => {
              onClose()
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-cm rounded-md hover:bg-cm-700"
          >
            저장하기
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
