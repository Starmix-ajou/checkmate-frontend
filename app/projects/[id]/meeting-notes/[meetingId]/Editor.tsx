'use client'

import { BlockNoteView } from '@blocknote/mantine'
import { useCreateBlockNoteWithLiveblocks } from '@liveblocks/react-blocknote'

import { MeetingNoteDetails } from './MeetingNoteDetails'
import { Threads } from './Threads'

interface Member {
  userId: string
  name: string
  email: string
  profileImageUrl?: string
}

const mockMembers: Member[] = [
  {
    userId: '1',
    name: '홍길동',
    email: 'hong@example.com',
  },
  {
    userId: '2',
    name: '김철수',
    email: 'kim@example.com',
  },
]

export function Editor() {
  const editor = useCreateBlockNoteWithLiveblocks({})

  const handleScrumMasterChange = (member: (typeof mockMembers)[0]) => {
    // TODO: API 호출하여 스크럼마스터 변경
    console.log('스크럼마스터 변경:', member)
  }

  return (
    <div className="flex h-full px-4 pb-4 gap-4">
      <div className="flex-1 h-full">
        <div className="rounded-lg border h-full">
          <BlockNoteView editor={editor} className="editor h-full" />
        </div>
      </div>
      <div className="w-96 flex flex-col gap-4">
        <MeetingNoteDetails
          createdAt={new Date()}
          updatedAt={new Date()}
          members={mockMembers}
          initialScrumMaster={mockMembers[0]}
          onScrumMasterChange={handleScrumMasterChange}
        />
        <div className="flex-1 rounded-lg border p-4">
          <h3 className="text-lg font-semibold mb-4">코멘트</h3>
          <Threads editor={editor} />
        </div>
      </div>
    </div>
  )
}
