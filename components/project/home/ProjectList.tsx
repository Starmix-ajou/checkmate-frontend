// components/project/home/ProjectList.tsx
import ProjectCard from '@/components/project/home/ProjectCard'

type ProjectListProps = {
  filter: string
  projects: {
    id: number
    name: string
    status: string
    startDate: string
    endDate: string
  }[]
}

const ProjectList = ({ filter, projects }: ProjectListProps) => {
  const filteredProjects = projects.filter(
    (project) => filter === 'all' || project.status === filter
  )

  return (
    <div className="flex justify-around gap-6">
      {filteredProjects.map((project) => (
        <ProjectCard
          key={project.id}
          id={project.id}
          name={project.name}
          startDate={project.startDate}
          endDate={project.endDate}
        />
      ))}
    </div>
  )
}

export default ProjectList
