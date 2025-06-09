import { Project } from '@cm/types/project'
import AvatarGroup from '@cm/ui/components/project/AvatarGroup'
import { Skeleton } from '@cm/ui/components/ui/skeleton'
import { useState } from 'react'

import { AddMemberDialog } from '../members/dialogs/AddMemberDialog'

interface ProjectHeaderProps {
  project: Project | null
  loading: boolean
  onMembersUpdate?: () => void
}

export default function ProjectHeader({
  project,
  loading,
  onMembersUpdate,
}: ProjectHeaderProps) {
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const teamMembers =
    project?.members.map((member) => ({
      name: member.name,
      src: member.profileImageUrl,
    })) || []

  return (
    <div className="flex justify-between items-center mt-2 mb-4">
      {loading ? (
        <>
          <Skeleton className="h-8 w-[200px]" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-[100px]" />
            <Skeleton className="h-9 w-[120px] rounded-full" />
          </div>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold">{project?.title}</h1>
          <div className="flex items-center gap-4">
            <AvatarGroup users={teamMembers} />
            <AddMemberDialog
              open={isAddMemberOpen}
              onOpenChange={setIsAddMemberOpen}
              onMembersUpdate={onMembersUpdate}
            />
          </div>
        </>
      )}
    </div>
  )
}
