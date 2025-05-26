'use client'

import { Feature } from '@/types/project-creation'
import { Button } from '@cm/ui/components/ui/button'
import { useRouter } from 'next/navigation'

import { FeatureTable } from './FeatureTable'

interface CompletionPhaseProps {
  specifications: Feature[]
  projectId: string
}

export default function CompletionPhase({
  specifications,
  projectId,
}: CompletionPhaseProps) {
  const router = useRouter()

  const handleComplete = async () => {
    router.push(`/projects/${projectId}/overview`)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">최종 기능 명세서</h2>
        <p className="text-muted-foreground">
          프로젝트의 최종 기능 명세서를 검토해주세요.
        </p>
      </div>

      <FeatureTable data={specifications} onDataChange={() => {}} readOnly />

      <div className="flex justify-end">
        <Button
          onClick={handleComplete}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          프로젝트 생성 완료
        </Button>
      </div>
    </div>
  )
}
