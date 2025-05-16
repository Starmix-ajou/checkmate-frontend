import { Editor } from './Editor'
import { Room } from './Room'

interface PageProps {
  params: {
    id: string
    meetingId: string
  }
}

async function getMeetingNote(meetingId: string) {
  // TODO: API 호출로 meeting note 데이터 가져오기
  return {
    title: '1차 정기 회의', // 임시 데이터
  }
}

export default async function Page({ params }: PageProps) {
  const meetingNote = await getMeetingNote(params.meetingId)

  return (
    <div className="flex w-full flex-col h-full">
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{meetingNote.title}</h1>
        </div>
      </div>
      <Room>
        <Editor />
      </Room>
    </div>
  )
}
