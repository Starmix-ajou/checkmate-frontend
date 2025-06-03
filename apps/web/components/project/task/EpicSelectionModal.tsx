import { useAuthStore } from '@/stores/useAuthStore'
import { TaskCreateRequest } from '@cm/types/userTask'
import { Button } from '@cm/ui/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@cm/ui/components/ui/dialog'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type Epic = {
  epicId: string
  title: string
  description: string
  startDate: string
  endDate: string
  sprint: {
    sprintId: string
    title: string
    description: string
    sequence: number
    projectId: string
    startDate: string
    endDate: string
  }
}

type EpicSelectionModalProps = {
  isOpen: boolean
  onClose: () => void
  onSelect: (epicId: string, initialData: TaskCreateRequest) => void
  projectId: string
  initialData: TaskCreateRequest
}

export default function EpicSelectionModal({
  isOpen,
  onClose,
  onSelect,
  projectId,
  initialData,
}: EpicSelectionModalProps) {
  const [selectedEpicId, setSelectedEpicId] = useState<string>('')
  const [epics, setEpics] = useState<Epic[]>([])
  const [loading, setLoading] = useState(false)
  const user = useAuthStore((state) => state.user)
  const router = useRouter()

  useEffect(() => {
    const fetchEpics = async () => {
      if (!user?.accessToken) return

      try {
        setLoading(true)
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/epic?projectId=${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
            },
          }
        )

        if (!response.ok) {
          throw new Error('에픽을 불러오는데 실패했습니다.')
        }

        const data = await response.json()
        setEpics(data)
      } catch (error) {
        console.error('에픽 불러오기 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) {
      fetchEpics()
    }
  }, [isOpen, projectId, user?.accessToken])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleEscape)
    }

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>에픽 선택</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 py-4 max-h-[192px] overflow-y-auto">
          {loading ? (
            <div className="p-3 text-gray-500 text-center">로딩 중...</div>
          ) : epics && epics.length > 0 ? (
            epics.map((epic) => (
              <div
                key={epic.epicId}
                className={`p-3 rounded cursor-pointer hover:bg-cm-light transition-colors ${
                  selectedEpicId === epic.epicId ? 'bg-cm-light' : ''
                }`}
                onClick={() => setSelectedEpicId(epic.epicId)}
              >
                {epic.title}
              </div>
            ))
          ) : (
            <div className="p-3 text-gray-500 text-center">
              선택할 수 있는 에픽이 없습니다.
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => {
              router.push(`/projects/${projectId}/epic`)
              onClose()
            }}
          >
            새 에픽 생성
          </Button>
          <Button
            variant="default"
            onClick={() => {
              if (selectedEpicId) {
                onSelect(selectedEpicId, initialData)
                onClose()
              }
            }}
            disabled={!selectedEpicId}
          >
            선택
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
