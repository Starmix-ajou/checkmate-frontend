'use client'

import LoadingCheckMate from '@/components/LoadingCheckMate'
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from '@liveblocks/react/suspense'
import { ReactNode } from 'react'

interface RoomProps {
  children: ReactNode
  roomId: string
}

export function Room({ children, roomId }: RoomProps) {
  return (
    <LiveblocksProvider
      publicApiKey={
        'pk_dev_JJsc7mR8OClG96a_IuD4Q3pJ-KCyM2cz4xoruF8k99gIHA2rL7ubXeeTBWsqqYvo'
      }
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
