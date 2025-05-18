'use client'

import LoadingCheckMate from '@/components/LoadingCheckMate'
import { Member } from '@/types/project'
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from '@liveblocks/react/suspense'
import { ReactNode } from 'react'

interface RoomProps {
  children: ReactNode
  roomId: string
  projectId: string
  members: Member[]
}

export function Room({ children, roomId, projectId, members }: RoomProps) {
  const resolveUsers = async ({ userIds }: { userIds: string[] }) => {
    return userIds.map((userId) => {
      const member = members.find((m) => m.email === userId)
      if (!member) return undefined

      return {
        name: member.name,
        avatar: member.profileImageUrl || '',
        color: '#000000',
      }
    })
  }

  return (
    <LiveblocksProvider
      authEndpoint={`/api/liveblocks-auth?projectId=${projectId}&roomId=${roomId}`}
      resolveUsers={resolveUsers}
    >
      <RoomProvider id={roomId}>
        <ClientSideSuspense
          fallback={
            <div>
              <LoadingCheckMate loading={true} />
            </div>
          }
        >
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  )
}
