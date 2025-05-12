'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

const ProjectAdd = () => {
  const router = useRouter()

  const handleClick = () => {
    router.push('/projects/new')
  }

  return (
    <Button variant="cm" onClick={handleClick}>
      새 프로젝트 추가
    </Button>
  )
}

export default ProjectAdd
