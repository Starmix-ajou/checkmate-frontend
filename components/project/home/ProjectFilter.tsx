// components/project/home/ProjectFilter.tsx
import ProjectAdd from '@/components/project/home/ProjectAdd'
import { Button } from '@/components/ui/button'

type ProjectFilterProps = {
  setFilter: (filter: string) => void
}

const ProjectFilter = ({ setFilter }: ProjectFilterProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex gap-4">
        <Button onClick={() => setFilter('all')} variant="outline">
          전체 프로젝트
        </Button>
        <Button onClick={() => setFilter('ongoing')} variant="outline">
          진행 중인 프로젝트
        </Button>
        <Button onClick={() => setFilter('completed')} variant="outline">
          지난 프로젝트
        </Button>
      </div>

      <div className="ml-4">
        <ProjectAdd />
      </div>
    </div>
  )
}

export default ProjectFilter
