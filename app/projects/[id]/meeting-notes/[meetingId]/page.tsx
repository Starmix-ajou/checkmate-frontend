'use client'

import { useParams, useSearchParams } from 'next/navigation'

import { Editor } from './Editor'
import { Room } from './Room'

export default function MeetingNotePage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const meetingId = params.meetingId as string
  const title = searchParams.get('title') || '새로운 회의'
  const roomId = searchParams.get('roomId') || meetingId

  return (
    <div className="flex w-full flex-col h-full">
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{title}</h1>
        </div>
      </div>
      <Room roomId={roomId}>
        <Editor />
      </Room>
    </div>
  )
}
