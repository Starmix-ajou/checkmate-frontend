import { BlockNoteEditor } from '@blocknote/core'
import { useCreateThread } from '@liveblocks/react'
import { Thread } from '@liveblocks/react-ui'
import { Composer } from '@liveblocks/react-ui/primitives'
import { useThreads } from '@liveblocks/react/suspense'
import { ArrowUp } from 'lucide-react'

export function Threads({ editor }: { editor: BlockNoteEditor | null }) {
  const { threads } = useThreads({ query: { resolved: false } })
  const createThread = useCreateThread()

  if (!editor) {
    return null
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="space-y-4">
        {threads.map((thread) => (
          <Thread key={thread.id} thread={thread} />
        ))}
      </div>
      <div className="mt-4">
        <Composer.Form
          onComposerSubmit={({ body }, event) => {
            event.preventDefault()
            createThread({
              body,
              metadata: {},
            })
          }}
          className="bg-cm-light/50 rounded-3xl p-2 flex flex-row justify-center"
        >
          <Composer.Editor
            placeholder="코멘트 입력"
            className="flex-1 focus:outline-none px-2 py-1"
          />
          <Composer.Submit className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full w-8 h-8 flex items-center justify-center disabled:opacity-50">
            <ArrowUp className="h-4 w-4" />
          </Composer.Submit>
        </Composer.Form>
      </div>
    </div>
  )
}
