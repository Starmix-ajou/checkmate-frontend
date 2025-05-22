import AvatarGroup from '@/components/project/overview/AvatarGroup'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Project } from '@/types/project'

interface ProjectHeaderProps {
  project: Project | null
  loading: boolean
}

export default function ProjectHeader({
  project,
  loading,
}: ProjectHeaderProps) {
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
            <Button variant="outline">멤버 추가</Button>
          </div>
        </>
      )}
    </div>
  )
}
