import ProjectCard from '@/components/project/home/ProjectCard'
import { ProjectListItem } from '@/types/project'
import Image from 'next/image'
import Link from 'next/link'

type ProjectListProps = {
  projects: ProjectListItem[]
}

const EmptyProjectList = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-12">
      <div className="mb-4">
        <Image
          src="/placehorse.png"
          alt="빈 프로젝트 상태"
          width={224}
          height={224}
          className="object-contain"
        />
      </div>
      <div className="text-cm-700 text-lg font-bold mb-1">
        아직 생성된 프로젝트가 없습니다
      </div>
      <div className="text-cm-300 text-sm">
        <Link
          href="/projects/new"
          className="underline transition-all duration-200 hover:text-cm"
        >
          새로운 프로젝트
        </Link>
        를 시작해보세요!
      </div>
    </div>
  )
}

const ProjectList = ({ projects }: ProjectListProps) => {
  if (projects.length === 0) {
    return <EmptyProjectList />
  }

  return (
    <div className="w-full px-0 py-4 md:px-4 md:py-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard
              key={project.project.projectId}
              id={project.project.projectId}
              position={project.profile.positions}
              members={project.members}
              title={project.project.title}
              startDate={project.startDate}
              endDate={project.endDate}
              imageUrl={project.project.imageUrl}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProjectList
