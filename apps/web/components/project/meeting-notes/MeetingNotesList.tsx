import { Meeting } from '@cm/types/meeting'
import { Checkbox } from '@cm/ui/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@cm/ui/components/ui/table'
import { useRouter } from 'next/navigation'

interface MeetingNotesListProps {
  meetings: Meeting[]
  projectId: string
}

export default function MeetingNotesList({
  meetings,
  projectId,
}: MeetingNotesListProps) {
  const router = useRouter()

  const handleRowClick = (meeting: Meeting) => {
    router.push(
      `/projects/${projectId}/meeting-notes/${meeting.meetingId}?title=${encodeURIComponent(
        meeting.title
      )}&roomId=${meeting.meetingId}`
    )
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
              key={meeting.meetingId}
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => handleRowClick(meeting)}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox />
              </TableCell>
              <TableCell>{meeting.title}</TableCell>
              <TableCell>{meeting.master.name}</TableCell>
              <TableCell>{meeting.timestamp}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
