import ProjectCard from '@/components/project/home/ProjectCard'
import { Project } from '@/types/project'

type ProjectListProps = {
  projects: Project[]
}

const ProjectList = ({ projects }: ProjectListProps) => {
  return (
    <div className="flex justify-around gap-6 flex-wrap">
      {projects.map((project) => (
        <ProjectCard
          key={project.projectId}
          id={project.projectId}
          position={project.profile.positions}
          members={project.members}
          title={project.projectTitle}
          startDate={project.startDate}
          endDate={project.endDate}
        />
      ))}
    </div>
  )
}

export default ProjectList
