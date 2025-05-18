'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Editor } from './Editor'
import { Room } from './Room'

interface MeetingNote {
  title: string
}

async function getMeetingNote(meetingId: string): Promise<MeetingNote> {
  console.log(meetingId)
  return {
    title: '1차 정기 회의',
  }
}

export default function MeetingNotePage() {
  const params = useParams()
  const meetingId = params.meetingId as string
  const [meetingNote, setMeetingNote] = useState<MeetingNote | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMeetingNote = async () => {
      try {
        const data = await getMeetingNote(meetingId)
        setMeetingNote(data)
      } catch (error) {
        console.error('Failed to fetch meeting note:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMeetingNote()
  }, [meetingId])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex w-full flex-col h-full">
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{meetingNote?.title}</h1>
        </div>
      </div>
      <Room>
        <Editor />
      </Room>
    </div>
  )
}
