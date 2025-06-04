'use client'

import { Member, Profile } from '@cm/types/project'
import AvatarGroup from '@cm/ui/components/project/AvatarGroup'
import { Card } from '@cm/ui/components/ui/card'
import { PositionBadgeGroup } from '@cm/ui/components/ui/position-badge'
import { Progress } from '@cm/ui/components/ui/progress'
import { useProjectColor } from '@cm/ui/hooks/useRandomColor'
import { Mail } from 'lucide-react'
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
  profile?: Profile
}

const ProjectCard = ({
  id,
  position,
  members,
  title,
  startDate,
  endDate,
  imageUrl,
  profile,
}: ProjectCardProps) => {
  const [today, setToday] = useState<Date | null>(null)
  const { backgroundColor, titleColor } = useProjectColor(title + id)
  const isInvited = profile && !profile.isActive

  useEffect(() => {
    setToday(new Date())
  }, [])

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
    <Link
      href={isInvited ? `/projects/${id}/invite` : `/projects/${id}/overview`}
    >
      <Card className="rounded-lg shadow-md transition hover:shadow-lg cursor-pointer w-full gap-0 p-0 max-w-2xl min-w-2xs">
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

          {isInvited ? (
            <div className="space-y-4">
              <div className="text-sm text-gray-500">
                {startDate} ~ {endDate}
              </div>
              <AvatarGroup users={memberAvatars} />
              <div className="flex items-center gap-2 text-cm-500 pt-2 pb-3">
                <Mail className="w-5 h-5" />
                <span className="text-sm">프로젝트 초대가 도착했습니다</span>
              </div>
            </div>
          ) : (
            <>
              <PositionBadgeGroup positions={position} />
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
                  <Progress
                    value={progress}
                    className="w-full h-1 rounded-full"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </Card>
    </Link>
  )
}

export default ProjectCard
