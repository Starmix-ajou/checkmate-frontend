import { useAuthStore } from '@/stores/useAuthStore'
import { Button } from '@cm/ui/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@cm/ui/components/ui/dialog'
import { Input } from '@cm/ui/components/ui/input'
import { useEffect, useState } from 'react'

type Epic = {
  epicId: string
  title: string
  description: string
  startDate: string
  endDate: string
}

type DeleteEpicModalProps = {
  isOpen: boolean
  onClose: () => void
  projectId: string
  onDelete: () => void
}

export default function DeleteEpicModal({
  isOpen,
  onClose,
  projectId,
  onDelete,
}: DeleteEpicModalProps) {
  const [step, setStep] = useState(0)
  const [selectedEpicId, setSelectedEpicId] = useState<string>('')
  const [selectedEpicTitle, setSelectedEpicTitle] = useState<string>('')
  const [epics, setEpics] = useState<Epic[]>([])
  const [loading, setLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const user = useAuthStore((state) => state.user)

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
      setStep(0)
      setSelectedEpicId('')
      setSelectedEpicTitle('')
      setDeleteConfirmation('')
    }
  }, [isOpen, projectId, user?.accessToken])

  const handleNext = () => {
    if (step === 0 && selectedEpicId) {
      const selectedEpic = epics.find((epic) => epic.epicId === selectedEpicId)
      if (selectedEpic) {
        setSelectedEpicTitle(selectedEpic.title)
        setStep(1)
      }
    }
  }

  const handleDelete = async () => {
    if (!selectedEpicId || !user?.accessToken) return
    if (deleteConfirmation !== selectedEpicTitle) {
      alert('에픽 이름이 일치하지 않습니다.')
      return
    }

    try {
      setIsDeleting(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/epic/${selectedEpicId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('에픽 삭제에 실패했습니다.')
      }

      onDelete()
      onClose()
    } catch (error) {
      console.error('에픽 삭제 실패:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>에픽 삭제</DialogTitle>
        </DialogHeader>

        <div className="w-full flex space-x-2 justify-center">
          {[0, 1].map((s) => (
            <div
              key={s}
              className={`w-2 h-2 rounded-full ${
                s <= step ? 'bg-cm' : 'bg-cm-100/50'
              }`}
            />
          ))}
        </div>

        {step === 0 ? (
          <>
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
                  삭제할 수 있는 에픽이 없습니다.
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="secondary"
                onClick={onClose}
                className="cursor-pointer"
              >
                취소
              </Button>
              <Button
                variant="default"
                onClick={handleNext}
                className="cursor-pointer"
                disabled={!selectedEpicId}
              >
                다음
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="space-y-4 py-4">
              <div className="text-sm text-destructive">
                에픽을 삭제하면 포함된 모든 하위 태스크도 함께 삭제됩니다.
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">삭제할 에픽</div>
                <div className="p-3 bg-muted rounded-md text-cm font-semibold">
                  {selectedEpicTitle}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">에픽 이름 확인</div>
                <Input
                  placeholder="에픽을 삭제하려면 에픽 이름을 정확히 입력해주세요"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="secondary"
                onClick={() => setStep(0)}
                className="cursor-pointer"
              >
                이전
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="cursor-pointer"
                disabled={!deleteConfirmation || isDeleting}
              >
                {isDeleting ? '삭제 중...' : '삭제'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
