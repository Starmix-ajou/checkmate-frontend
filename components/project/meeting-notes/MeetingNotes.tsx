import MeetingNoteCard from './MeetingNoteCard'

export default function MeetingNotes() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
      <MeetingNoteCard />
    </div>
  )
}
