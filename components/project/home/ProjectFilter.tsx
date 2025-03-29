import { Button } from '@/components/ui/button'

type ProjectFilterProps = {
  setFilter: (filter: string) => void
}

const ProjectFilter = ({ setFilter }: ProjectFilterProps) => {
  return (
    <div className="flex gap-4 mb-6">
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
  )
}

export default ProjectFilter
