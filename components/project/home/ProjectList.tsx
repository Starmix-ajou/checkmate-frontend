import ProjectCard from '@/components/project/home/ProjectCard'
import { ProjectListItem } from '@/types/project'

type ProjectListProps = {
  projects: ProjectListItem[]
}

const ProjectList = ({ projects }: ProjectListProps) => {
  return (
    <div className="w-full flex justify-center px-4 py-6">
      <div className="flex flex-wrap gap-x-9 gap-y-8 max-w-6xl justify-start">
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
  )
}

export default ProjectList
