'use client'

import { Member } from '@/types/project'
import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Editor } from './Editor'
import { Room } from './Room'

export default function MeetingNotePage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const meetingId = params.meetingId as string
  const projectId = params.id as string
  const title = searchParams.get('title') || '새로운 회의'
  const roomId = searchParams.get('roomId') || meetingId
  const [members, setMembers] = useState<Member[]>([])

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

    fetchMembers()
  }, [projectId])

  return (
    <div className="flex w-full flex-col h-full">
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{title}</h1>
        </div>
      </div>
      <Room roomId={roomId} projectId={projectId} members={members}>
        <Editor />
      </Room>
    </div>
  )
}
