'use client'

import { getRoomDetails } from '@/lib/api/meetingNotes'
import { Member } from '@/types/project'
import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Editor } from './Editor'
import { MeetingNoteDetails } from './MeetingNoteDetails'
import { Room } from './Room'
import { Threads } from './Threads'

export default function MeetingNotePage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const meetingId = params.meetingId as string
  const projectId = params.id as string
  const title = searchParams.get('title') || '새로운 회의'
  const roomId = searchParams.get('roomId') || meetingId
  const [members, setMembers] = useState<Member[]>([])
  const [roomInfo, setRoomInfo] = useState<{
    createdAt: Date
    updatedAt: Date
  }>({
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  const handleScrumMasterChange = (member: Member) => {
    // TODO: API 호출하여 스크럼마스터 변경
    console.log('스크럼마스터 변경:', member)
  }

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/project/${projectId}`,
          {
            headers: {
              Accept: '*/*',
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
        const details = await getRoomDetails(roomId)
        setRoomInfo(details)
      } catch (error) {
        console.error('Error fetching room details:', error)
      }
    }

    fetchMembers()
    fetchRoomDetails()
  }, [projectId, roomId])

  return (
    <div className="flex w-full flex-col h-full">
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{title}</h1>
        </div>
      </div>
      <div className="flex h-full px-4 pb-4 gap-4">
        <Room roomId={roomId} projectId={projectId} members={members}>
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
                initialScrumMaster={members[0]}
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
  )
}
