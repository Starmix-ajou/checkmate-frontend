'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Member, Profile } from '@/types/project'
import { Calendar, Heart, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

type ProjectCardProps = {
  id: string
  position: Profile['positions']
  members: Member[]
  title: string
  startDate: string
  endDate: string
  imageUrl: string
}

const ProjectCard = ({
  id,
  position,
  members,
  title,
  startDate,
  endDate,
  imageUrl,
}: ProjectCardProps) => {
  const [isFavorited, setIsFavorited] = useState(false)
  const [today, setToday] = useState<Date | null>(null)

  useEffect(() => {
    setToday(new Date())
  }, [])

  if (!today) {
    return <div>Loading...</div>
  }

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsFavorited((prev) => !prev)
  }

  const start = new Date(startDate)
  const end = new Date(endDate)

  const totalDuration = end.getTime() - start.getTime()
  const elapsedTime = today.getTime() - start.getTime()
  const progress =
    (elapsedTime / totalDuration) * 100 > 100
      ? 100
      : (elapsedTime / totalDuration) * 100

  return (
    <div className="w-90 h-50">
      <Link href={`/projects/${id}/overview`}>
        <Card className="w-full h-full cursor-pointer hover:shadow-lg transition-all ease-in-out duration-300 transform hover:scale-105">
          <CardContent className="flex items-center justify-center h-full bg-gray-200 rounded-2xl overflow-hidden">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                width={360}
                height={200}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-gray-500">image</span>
            )}
          </CardContent>
        </Card>
      </Link>

      <div className="flex justify-between items-start pt-2 ml-4">
        <div className="flex flex-col">
          <div className="text-left font-semibold text-base">{title}</div>
          <div className="text-left font-normal text-xs flex items-center text-gray-500">
            <Calendar className="mr-1" size={14} />
            {startDate} ~ {endDate}
          </div>
          <div className="text-left font-normal text-xs flex items-center text-gray-500 mt-1">
            <Users className="mr-1" size={14} />
            {members.length}명 참여 중
          </div>
          <div className="text-left font-normal text-xs flex items-center text-gray-500 mt-1">
            {position.join(', ')}
          </div>
        </div>

        <Heart
          className={`cursor-pointer ${isFavorited ? 'text-red-500' : 'text-gray-500'} mt-4 mr-4`}
          size={18}
          onClick={toggleFavorite}
        />
      </div>

      <div className="border-b border-black my-2" />

      <div className="w-full h-2 bg-gray-300 rounded-full mt-4">
        <div
          className="h-full rounded-full"
          style={{
            width: `${progress}%`,
            backgroundColor: 'black',
          }}
        />
      </div>
    </div>
  )
}

export default ProjectCard
