'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Heart } from 'lucide-react'

type ProjectCardProps = {
  id: number
  name: string
  startDate: string
  endDate: string
}

const ProjectCard = ({ id, name, startDate, endDate }: ProjectCardProps) => {
  const [isFavorited, setIsFavorited] = useState(false) // 하트 클릭 상태 관리

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation() // 하트 클릭 시 페이지 이동 방지
    setIsFavorited((prev) => !prev)
  }

  // 시작일과 종료일을 Date 객체로 변환
  const start = new Date(startDate)
  const end = new Date(endDate)
  const today = new Date()

  // 프로젝트 기간 계산
  const totalDuration = end.getTime() - start.getTime()
  const elapsedTime = today.getTime() - start.getTime()
  const progress =
    (elapsedTime / totalDuration) * 100 > 100
      ? 100
      : (elapsedTime / totalDuration) * 100

  return (
    <div className="w-60 h-40">
      <Link href={`/projects/${id}/overview`}>
        <Card className="w-full h-full cursor-pointer hover:shadow-lg transition-all ease-in-out duration-300 transform hover:scale-105">
          <CardContent className="flex items-center justify-center h-full bg-gray-200 rounded-2xl overflow-hidden">
            <span className="text-gray-500">image</span>
          </CardContent>
        </Card>
      </Link>

      <div className="flex justify-between items-start pt-2 ml-4">
        <div className="flex flex-col">
          <div className="text-left font-semibold text-base">{name}</div>
          <div className="text-left font-normal text-xs flex items-center">
            <Calendar className="mr-1 text-gray-500" size={14} />
            {startDate} ~ {endDate}
          </div>
        </div>

        <Heart
          className={`cursor-pointer ${isFavorited ? 'text-red-500' : 'text-gray-500'} mt-4 mr-4`}
          size={18}
          onClick={toggleFavorite} // 클릭 시 상태 변경
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
