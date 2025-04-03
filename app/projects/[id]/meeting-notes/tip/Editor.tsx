'use client'

import { useCreateBlockNoteWithLiveblocks } from '@liveblocks/react-blocknote'
import { BlockNoteView } from '@blocknote/mantine'
import { Threads } from './Threads'

export function Editor() {
  const editor = useCreateBlockNoteWithLiveblocks({})

  return (
    <div>
      <BlockNoteView editor={editor} className="editor" />
      <Threads editor={editor} />
    </div>
  )
}
