import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export default function KanbanTask({
  id,
  content,
}: {
  id: string
  content: string
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={`bg-white text-black rounded-md shadow-md p-3 select-none cursor-pointer mb-2 ${
        isDragging ? 'opacity-30' : 'opacity-100'
      }`}
    >
      {content}
    </div>
  )
}
