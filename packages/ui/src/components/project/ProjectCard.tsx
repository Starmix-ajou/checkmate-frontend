'use client'

import { Member, Profile } from '@cm/types/project'
import AvatarGroup from '@cm/ui/components/project/AvatarGroup'
import { Card } from '@cm/ui/components/ui/card'
import { Progress } from '@cm/ui/components/ui/progress'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import tinycolor from 'tinycolor2'

type ProjectCardProps = {
  id: string
  position: Profile['positions']
  members: Member[]
  title: string
  startDate: string
  endDate: string
  imageUrl: string
}

const pastelColors = [
  '#F5EAEA',
  '#E9F0F6',
  '#EDF4ED',
  '#F9F6EC',
  '#EFEFF6',
  '#F6F3F0',
  '#F3F1F5',
  '#E7EFF2',
  '#F0F0F0',
  '#EBF3EC',
]

const getColorFromString = (str: string) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 11) - hash)
  }
  const index = Math.abs(hash) % pastelColors.length
  return pastelColors[index]
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
  const [today, setToday] = useState<Date | null>(null)

  useEffect(() => {
    setToday(new Date())
  }, [])

  const backgroundColor = useMemo(
    () => getColorFromString(title + id),
    [title, id]
  )

  const titleColor = useMemo(() => {
    const bg = tinycolor(backgroundColor)
    return bg.darken(20).saturate(15).toString()
  }, [backgroundColor])

  const getPositionColor = (position: string) => {
    const bgColor = getColorFromString(position)
    const textColor = tinycolor(bgColor).darken(40).saturate(40).toString()
    return { bgColor, textColor }
  }

  if (!today) return null

  const start = new Date(startDate)
  const end = new Date(endDate)
  const totalDays = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  )
  const elapsedDays = Math.ceil(
    (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  )
  const progress = Math.max(0, Math.min((elapsedDays / totalDays) * 100, 100))
  const dDay = Math.ceil(
    (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  )

  const memberAvatars = members.map((member) => ({
    name: member.name,
    src: member.profileImageUrl || '',
  }))

  return (
    <Link href={`/projects/${id}/overview`}>
      <Card className="rounded-lg shadow-md transition hover:shadow-lg cursor-pointer w-full gap-0 p-0">
        <div className="relative w-full h-40 rounded-t-lg overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover w-full h-full"
            />
          ) : (
            <div
              className="w-full h-full flex items-center"
              style={{ backgroundColor }}
            >
              <span
                className="text-4xl px-4 text-left text-nowrap"
                style={{ color: titleColor }}
              >
                {title}
              </span>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="text-lg font-semibold">{title}</div>
          <div className="flex flex-wrap gap-2">
            {position.map((pos) => {
              const { bgColor, textColor } = getPositionColor(pos)
              return (
                <div
                  key={pos}
                  className="text-xs font-medium px-2 py-1 rounded-md"
                  style={{
                    backgroundColor: bgColor,
                    color: textColor,
                  }}
                >
                  {pos}
                </div>
              )
            })}
          </div>
          <div className="text-sm text-gray-500">
            {startDate} ~ {endDate}
          </div>

          <div className="flex flex-col gap-2 pt-4">
            <div className="flex items-center justify-between">
              <AvatarGroup users={memberAvatars} />
              <div className="text-xs text-gray-500">
                {dDay < 0 ? 'Done' : `D-${dDay}`}
              </div>
            </div>
            <div className="w-full">
              <div className="relative h-5">
                <Image
                  src="/tabler-run.svg"
                  alt="run"
                  width={20}
                  height={20}
                  className="text-cm-blue absolute"
                  style={{
                    left: `${progress}%`,
                    transform: 'translateX(-50%)',
                  }}
                />
              </div>
              <Progress value={progress} className="w-full h-1 rounded-full" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}

export default ProjectCard
