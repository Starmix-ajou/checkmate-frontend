'use client'

import { BlockNoteView } from '@blocknote/mantine'
import { useCreateBlockNoteWithLiveblocks } from '@liveblocks/react-blocknote'
import { useMeetingStore } from '@/stores/useMeetingStore'
import { useCallback, useEffect } from 'react'

export function Editor() {
  const setMeetingContent = useMeetingStore((state) => state.setMeetingContent)
  const clearMeetingContent = useMeetingStore((state) => state.clearMeetingContent)

  const editor = useCreateBlockNoteWithLiveblocks({})

  const onChange = useCallback(async () => {
    try {
      const markdown = await editor.blocksToMarkdownLossy(editor.document)
      setMeetingContent(markdown)
    } catch (error) {
      console.error('회의록 내용 변환 중 오류:', error)
    }
  }, [editor, setMeetingContent])

  useEffect(() => {
    onChange()
    return () => {
      clearMeetingContent()
    }
  }, [onChange, clearMeetingContent])

  return (
    <BlockNoteView 
      editor={editor} 
      className="editor h-full" 
      onChange={onChange}
    />
  )
}
