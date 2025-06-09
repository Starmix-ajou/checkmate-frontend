'use client'

import { useAuthStore } from '@/stores/useAuthStore'
import {
  MeetingResponse,
  getMeeting,
  getRoomDetails,
  updateMeeting,
} from '@cm/api/meetingNotes'
import { Member } from '@cm/types/project'
import { Button } from '@cm/ui/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@cm/ui/components/ui/dialog'
import { Input } from '@cm/ui/components/ui/input'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@cm/ui/components/ui/tooltip'
import { Sparkles } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'

import { Editor } from './Editor'
import { MeetingNoteDetails } from './MeetingNoteDetails'
import { Room } from './Room'
import { Threads } from './Threads'

export default function MeetingNotePage() {
  const params = useParams()
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const meetingId = params.meetingId as string
  const projectId = params.id as string
  const [meetingInfo, setMeetingInfo] = useState<MeetingResponse>({
    meetingId: '',
    title: '새로운 회의',
    content: '',
    master: {
      userId: '',
      name: '',
      email: '',
      profileImageUrl: '',
      profiles: [],
    },
    projectId: '',
    timestamp: new Date().toISOString(),
    summary: '',
  })
  const [members, setMembers] = useState<Member[]>([])
  const [roomInfo, setRoomInfo] = useState<{
    createdAt: Date
    updatedAt: Date
  }>({
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  const [showCompleteDialog, setShowCompleteDialog] = useState(false)
  const [showSummaryDialog, setShowSummaryDialog] = useState(false)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState('')

  const handleScrumMasterChange = async (memberId: string) => {
    if (!user?.accessToken || memberId === meetingInfo.master.userId) return

    try {
      await updateMeeting(user.accessToken, meetingId, {
        title: meetingInfo.title,
        masterId: memberId,
      })
      const updatedMeeting = await getMeeting(user.accessToken, meetingId)
      setMeetingInfo(updatedMeeting)
    } catch (error) {
      console.error('스크럼마스터 변경 실패:', error)
    }
  }

  const handleComplete = () => {
    setShowCompleteDialog(true)
  }

  const handleConfirmComplete = () => {
    router.push(`/projects/${projectId}/meeting-notes/${meetingId}/summary`)
  }

  useEffect(() => {
    if (!user?.accessToken) return

    const fetchMeetingInfo = async () => {
      try {
        const meeting = await getMeeting(user.accessToken, meetingId)
        setMeetingInfo(meeting)
      } catch (error) {
        console.error('회의 정보 조회 에러:', error)
      }
    }

    const fetchMembers = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/project/${projectId}`,
          {
            headers: {
              Accept: '*/*',
              Authorization: `Bearer ${user.accessToken}`,
            },
          }
        )

        if (!response.ok) {
          throw new Error('Failed to fetch project members')
        }

        const project = await response.json()
        setMembers(project.members)
      } catch (error) {
        console.error('Error fetching project members:', error)
      }
    }

    const fetchRoomDetails = async () => {
      try {
        const details = await getRoomDetails(meetingId)
        setRoomInfo(details)
      } catch (error) {
        console.error('Error fetching room details:', error)
      }
    }

    fetchMeetingInfo()
    fetchMembers()
    fetchRoomDetails()
  }, [projectId, meetingId, user?.accessToken])

  useEffect(() => {
    if (meetingInfo.title) {
      setEditedTitle(meetingInfo.title)
    }
  }, [meetingInfo.title])

  const handleTitleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value)
  }

  const handleTitleBlur = async () => {
    if (!user?.accessToken || editedTitle === meetingInfo.title) {
      setIsEditingTitle(false)
      return
    }

    try {
      await updateMeeting(user.accessToken, meetingId, {
        title: editedTitle,
        masterId: meetingInfo.master.userId,
      })
      setMeetingInfo((prev) => ({ ...prev, title: editedTitle }))
    } catch (error) {
      console.error('제목 업데이트 실패:', error)
      setEditedTitle(meetingInfo.title)
    }
    setIsEditingTitle(false)
  }

  return (
    <>
      <div className="flex w-full flex-col h-full">
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center gap-2">
            <Input
              value={editedTitle}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.currentTarget.blur()
                }
              }}
              className={`!text-3xl font-bold h-12 px-2 shadow-none ${
                !isEditingTitle
                  ? 'border-0 bg-transparent hover:bg-gray-100 cursor-pointer focus-visible:ring-0 focus-visible:ring-offset-0'
                  : ''
              }`}
              onClick={() => !isEditingTitle && setIsEditingTitle(true)}
              readOnly={!isEditingTitle}
            />
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        variant="cmoutline"
                        onClick={() => setShowSummaryDialog(true)}
                        disabled={!meetingInfo.summary?.trim()}
                      >
                        요약본 확인
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {!meetingInfo.summary?.trim() ? (
                      <p>AI 요약을 먼저 진행해주세요.</p>
                    ) : (
                      <p>AI가 생성한 회의록 요약본을 확인합니다.</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="cm" onClick={handleComplete}>
                      <Sparkles className="w-4 h-4" />
                      AI 요약 시작
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>AI를 통해 회의록을 요약하고 액션 아이템을 추출합니다.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
        <div className="flex h-full px-4 pb-4 gap-4">
          <Room roomId={meetingId} projectId={projectId} members={members}>
            <div className="flex-1 h-full">
              <div className="rounded-lg border h-full">
                <Editor />
              </div>
            </div>
            <div className="w-96 flex flex-col gap-4 max-h-[calc(100vh-148px)]">
              <div className="h-fit">
                <MeetingNoteDetails
                  createdAt={roomInfo.createdAt}
                  updatedAt={roomInfo.updatedAt}
                  members={members}
                  initialScrumMaster={meetingInfo.master}
                  onScrumMasterChange={handleScrumMasterChange}
                />
              </div>
              <div className="flex-1 min-h-0 rounded-lg border p-4 flex flex-col overflow-auto">
                <h3 className="text-lg font-semibold mb-4">코멘트</h3>
                <Threads />
              </div>
            </div>
          </Room>
        </div>
      </div>

      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI 요약 시작</DialogTitle>
            <DialogDescription>
              AI를 통해 회의록을 요약하고 액션 아이템을 추출하시겠습니까?
              <br />
              완료 후에는 회의록을 수정할 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="cmoutline"
              onClick={() => setShowCompleteDialog(false)}
            >
              취소
            </Button>
            <Button variant="cm" onClick={handleConfirmComplete}>
              <Sparkles className="w-4 h-4 mr-2" />
              AI 요약 시작
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSummaryDialog} onOpenChange={setShowSummaryDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>회의록 요약</DialogTitle>
            <DialogDescription>
              AI가 생성한 회의록 요약본입니다.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 p-4 bg-muted/50 rounded-lg overflow-y-auto max-h-[calc(80vh-200px)] prose prose-sm max-w-none">
            {meetingInfo.summary ? (
              <ReactMarkdown>{meetingInfo.summary}</ReactMarkdown>
            ) : (
              <p className="text-gray-500">요약본이 없습니다.</p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="cmoutline"
              onClick={() => setShowSummaryDialog(false)}
            >
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
