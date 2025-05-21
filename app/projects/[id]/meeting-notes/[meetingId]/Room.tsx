'use client'

import LoadingCheckMate from '@/components/LoadingCheckMate'
import { Member } from '@/types/project'
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
  useRoom,
} from '@liveblocks/react/suspense'
import { ReactNode, useCallback, useEffect } from 'react'
import { toast } from 'react-toastify'

interface RoomProps {
  children: ReactNode
  roomId: string
  projectId: string
  members: Member[]
}

function RoomConnectionManager() {
  const room = useRoom()

  useEffect(() => {
    const unsubscribe = room.subscribe('status', (status) => {
      if (status === 'disconnected') {
        toast.error('연결이 끊어졌습니다. 재연결을 시도합니다.')
        room.reconnect()
      } else if (status === 'connected') {
        toast.success('연결되었습니다.')
      }
    })

    return () => {
      unsubscribe()
    }
  }, [room])

  return null
}

export function Room({ children, roomId, projectId, members }: RoomProps) {
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
    >
      <RoomProvider id={roomId} initialPresence={{}}>
        <RoomConnectionManager />
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
