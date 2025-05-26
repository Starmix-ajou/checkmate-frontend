'use client'

import { Member } from '@/types/project'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@cm/ui/components/ui/popover'
import { format } from 'date-fns'
import { Calendar, ChevronDown, Clock, User } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

interface MeetingNoteDetailsProps {
  createdAt: Date
  updatedAt: Date
  members: Member[]
  initialScrumMaster: Member
  onScrumMasterChange: (member: Member) => void
}

export function MeetingNoteDetails({
  createdAt,
  updatedAt,
  members,
  initialScrumMaster,
  onScrumMasterChange,
}: MeetingNoteDetailsProps) {
  const [isScrumMasterOpen, setIsScrumMasterOpen] = useState(false)
  const [selectedScrumMaster, setSelectedScrumMaster] =
    useState<Member>(initialScrumMaster)

  const handleScrumMasterChange = (member: Member) => {
    setSelectedScrumMaster(member)
    setIsScrumMasterOpen(false)
    onScrumMasterChange(member)
  }

  return (
    <div className="rounded-lg border p-4">
      <h3 className="text-lg font-semibold mb-4">세부 정보</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <p className="text-sm text-gray-500">작성일</p>
          </div>
          <p className="text-sm">{format(createdAt, 'yyyy년 MM월 dd일')}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <p className="text-sm text-gray-500">최종 편집일</p>
          </div>
          <p className="text-sm">
            {format(updatedAt, 'yyyy년 MM월 dd일 HH:mm')}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            <p className="text-sm text-gray-500">스크럼마스터</p>
          </div>
          <Popover open={isScrumMasterOpen} onOpenChange={setIsScrumMasterOpen}>
            <PopoverTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                <div className="flex items-center gap-2">
                  {selectedScrumMaster?.profileImageUrl && (
                    <Image
                      width={24}
                      height={24}
                      src={selectedScrumMaster.profileImageUrl}
                      alt={selectedScrumMaster.name}
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <span className="text-sm">{selectedScrumMaster?.name}</span>
                </div>
                <ChevronDown size={16} className="text-gray-500" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <div className="max-h-[200px] overflow-y-auto">
                {members.map((member) => (
                  <div
                    key={member.userId}
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleScrumMasterChange(member)}
                  >
                    {member.profileImageUrl && (
                      <Image
                        width={24}
                        height={24}
                        src={member.profileImageUrl}
                        alt={member.name}
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium">{member.name}</div>
                      <div className="text-xs text-gray-500">
                        {member.email}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}
