'use client'

import { Member } from '@cm/types/project'
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from '@liveblocks/react/suspense'
import { ReactNode, useCallback, useEffect } from 'react'

interface RoomProps {
  children: ReactNode
  roomId: string
  projectId: string
  members: Member[]
}

export function Room({ children, roomId, projectId, members }: RoomProps) {
  useEffect(() => {
    console.log('[Room] props changed:', {
      children,
      roomId,
      projectId,
      members,
    })
  }, [children, roomId, projectId, members])
  const resolveUsers = useCallback(
    async ({ userIds }: { userIds: string[] }) => {
      return userIds.map((userId) => {
        const member = members.find((m) => m.email === userId)
        if (!member) return undefined

        return {
          id: member.email,
          name: member.name,
          avatar: member.profileImageUrl || '',
          color: '#000000',
        }
      })
    },
    [members]
  )

  return (
    <LiveblocksProvider
      authEndpoint={`/api/liveblocks-auth?projectId=${projectId}&roomId=${roomId}`}
      resolveUsers={resolveUsers}
      unstable_streamData={true}
      lostConnectionTimeout={30000}
      backgroundKeepAliveTimeout={15 * 60 * 1000}
    >
      <RoomProvider id={roomId} initialPresence={{}}>
        <ClientSideSuspense fallback={null}>{children}</ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  )
}
