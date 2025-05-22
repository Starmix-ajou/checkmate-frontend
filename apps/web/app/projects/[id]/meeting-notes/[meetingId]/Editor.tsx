'use client'

import { BlockNoteView } from '@blocknote/mantine'
import { useCreateBlockNoteWithLiveblocks } from '@liveblocks/react-blocknote'

export function Editor() {
  const editor = useCreateBlockNoteWithLiveblocks({})

  return <BlockNoteView editor={editor} className="editor h-full" />
}
