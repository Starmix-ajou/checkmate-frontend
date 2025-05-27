import { useAuthStore } from '@/stores/useAuthStore'
import { getCreateMeeting } from '@cm/api/meetingNotes'
import { Button } from '@cm/ui/components/ui/button'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'

const MeetingNotesAdd = () => {
  const router = useRouter()
  const params = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const user = useAuthStore((state) => state.user)

  const handleCreateMeeting = async () => {
    if (!user?.accessToken) return

    try {
      setIsLoading(true)
      const meetingNote = await getCreateMeeting(
        user.accessToken,
        params.id as string
      )

      await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId: meetingNote.meetingId }),
      })

      router.push(
        `/projects/${params.id}/meeting-notes/${meetingNote.meetingId}?title=${encodeURIComponent(
          meetingNote.title
        )}&roomId=${meetingNote.meetingId}`
      )
    } catch (error) {
      console.error('회의 생성 중 오류가 발생했습니다:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="cm"
      className="px-4"
      onClick={handleCreateMeeting}
      disabled={isLoading}
    >
      {isLoading ? '생성 중...' : '회의록 작성'}
    </Button>
  )
}

export default MeetingNotesAdd
