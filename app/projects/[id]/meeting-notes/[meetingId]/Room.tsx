'use client'

import LoadingCheckMate from '@/components/LoadingCheckMate'
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from '@liveblocks/react/suspense'
import { ReactNode } from 'react'

export function Room({ children }: { children: ReactNode }) {
  return (
    <LiveblocksProvider
      publicApiKey={
        'pk_dev_JJsc7mR8OClG96a_IuD4Q3pJ-KCyM2cz4xoruF8k99gIHA2rL7ubXeeTBWsqqYvo'
      }
    >
      <RoomProvider id="my-room">
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
