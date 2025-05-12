import ProjectCard from '@/components/project/home/ProjectCard'
import { ProjectListItem } from '@/types/project'

type ProjectListProps = {
  projects: ProjectListItem[]
}

const ProjectList = ({ projects }: ProjectListProps) => {
  return (
    <div className="flex justify-between gap-x-2 gap-y-8 flex-wrap p-8">
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
  )
}

export default ProjectList
