import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useRouter } from 'next/navigation'

interface MeetingNote {
  id: string
  title: string
  scrumMaster: string
  createdAt: string
}

interface MeetingNotesListProps {
  meetings: MeetingNote[]
  projectId: string
}

export default function MeetingNotesList({
  meetings,
  projectId,
}: MeetingNotesListProps) {
  const router = useRouter()

  const handleRowClick = (meetingId: string) => {
    router.push(`/projects/${projectId}/meeting-notes/${meetingId}`)
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox />
            </TableHead>
            <TableHead>제목</TableHead>
            <TableHead>스크럼매니저</TableHead>
            <TableHead>작성일</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {meetings.map((meeting) => (
            <TableRow
              key={meeting.id}
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => handleRowClick(meeting.id)}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox />
              </TableCell>
              <TableCell>{meeting.title}</TableCell>
              <TableCell>{meeting.scrumMaster}</TableCell>
              <TableCell>{meeting.createdAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
