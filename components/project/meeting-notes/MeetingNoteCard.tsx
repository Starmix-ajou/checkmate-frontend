import { Card, CardContent } from '@/components/ui/card'
import { Lightbulb } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function MeetingNoteCard() {
  const { id } = useParams()

  return (
    <div className="w-80 h-50">
      <Link href={`/projects/${id}/meeting-notes/tip`}>
        <Card className="w-full h-full border-black cursor-pointer hover:shadow-lg transition-all ease-in-out duration-300 transform hover:scale-105">
          <CardContent className="flex flex-col items-start justify-center h-full rounded-2xl overflow-hidden px-10">
            <Lightbulb size={44} className="text-yellow-500" />
            <div className="mt-6 text-left">
              <p className="text-lg font-medium">회의록 작성,</p>
              <p className="text-lg font-medium">어렵지 않아요!</p>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  )
}
