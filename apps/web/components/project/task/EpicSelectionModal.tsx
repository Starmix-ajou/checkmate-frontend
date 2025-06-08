import { useAuthStore } from '@/stores/useAuthStore'
import { Epic, TaskCreateRequest } from '@cm/types/userTask'
import { Button } from '@cm/ui/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@cm/ui/components/ui/dialog'
import { Input } from '@cm/ui/components/ui/input'
import { Label } from '@cm/ui/components/ui/label'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

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
  const [step, setStep] = useState(0)
  const [selectedEpicId, setSelectedEpicId] = useState<string>('')
  const [epics, setEpics] = useState<Epic[]>([])
  const [loading, setLoading] = useState(false)
  const [newEpicTitle, setNewEpicTitle] = useState('')
  const [newEpicDescription, setNewEpicDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
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
      setStep(0)
      setSelectedEpicId('')
      setNewEpicTitle('')
      setNewEpicDescription('')
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

  const handleNewEpicSubmit = async () => {
    if (!user?.accessToken) return

    try {
      setIsSubmitting(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/epic?projectId=${projectId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.accessToken}`,
          },
          body: JSON.stringify({
            title: newEpicTitle,
            description: newEpicDescription,
          }),
        }
      )

      const responseText = await response.text()
      console.log('API Response:', responseText) // 응답 내용 확인용 로그

      if (!response.ok) {
        throw new Error(responseText || '에픽 생성에 실패했습니다.')
      }

      // 응답이 비어있지 않은 경우에만 JSON 파싱 시도
      let data: any = {}
      if (responseText) {
        try {
          data = JSON.parse(responseText)
        } catch (e) {
          console.error('JSON 파싱 실패:', e)
          // JSON 파싱에 실패해도 계속 진행
        }
      }

      // 에픽 생성 후 최신 에픽 목록 가져오기
      const epicsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/epic?projectId=${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      )

      if (!epicsResponse.ok) {
        throw new Error('에픽 목록을 불러오는데 실패했습니다.')
      }

      const updatedEpics = await epicsResponse.json()
      setEpics(updatedEpics)

      // 새로 생성된 에픽 ID로 선택
      setSelectedEpicId(data.epicId)

      // 상태 초기화
      setStep(0)
      setNewEpicTitle('')
      setNewEpicDescription('')
    } catch (error) {
      console.error('에픽 생성 실패:', error)
      alert(
        error instanceof Error ? error.message : '에픽 생성에 실패했습니다.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{step === 0 ? 'Epic' : 'New Epic'}</DialogTitle>
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
            <div className="space-y-2 py-4 min-h-[200px] max-h-[200px] overflow-y-auto">
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
              <Button variant="secondary" onClick={() => setStep(1)}>
                생성
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
          </>
        ) : (
          <>
            <div className="grid gap-4 py-2 min-h-[200px] max-h-[200px]">
              <div className="grid gap-2">
                <Label htmlFor="title" className="ml-1.5">
                  Title
                </Label>
                <Input
                  id="title"
                  placeholder="Epic 제목을 입력하세요"
                  value={newEpicTitle}
                  onChange={(e) => setNewEpicTitle(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description" className="ml-1.5">
                  Description
                </Label>
                <textarea
                  id="description"
                  placeholder="Epic에 대한 설명을 입력하세요"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] resize-none"
                  value={newEpicDescription}
                  onChange={(e) => setNewEpicDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setStep(0)}>
                이전
              </Button>
              <Button
                onClick={handleNewEpicSubmit}
                disabled={!newEpicTitle || isSubmitting}
              >
                {isSubmitting ? '생성 중...' : '생성'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
