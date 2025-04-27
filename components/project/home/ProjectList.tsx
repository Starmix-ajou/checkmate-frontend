// components/project/home/ProjectList.tsx
import ProjectCard from '@/components/project/home/ProjectCard'

type Profile = {
  stacks: string[]
  positions: string[]
  projectId: string
}

type Member = {
  name: string
  email: string
  profileImageUrl: string
  profiles: Profile[]
  role: string
  pendingProjectIds: string[]
}

type Project = {
  projectId: string
  projectTitle: string
  projectImageUrl: string
  profile: Profile
  startDate: string
  endDate: string
  members: Member[]
  leader: Member
}

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
          name={project.projectTitle}
          startDate={project.startDate}
          endDate={project.endDate}
        />
      ))}
    </div>
  )
}

export default ProjectList
