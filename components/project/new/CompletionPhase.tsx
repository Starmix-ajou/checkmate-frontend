'use client'

import { Button } from '@/components/ui/button'
import { FeatureTable } from './FeatureTable'
import { useAuthStore } from '@/stores/useAuthStore'
import { useRouter } from 'next/navigation'
import { Feature } from '@/types/project-creation'

interface CompletionPhaseProps {
  specifications: Feature[]
}

export default function CompletionPhase({ specifications }: CompletionPhaseProps) {
  const user = useAuthStore((state) => state.user)
  const router = useRouter()

  const handleComplete = async () => {
      router.push('/projects')
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">최종 기능 명세서</h2>
        <p className="text-muted-foreground">
          프로젝트의 최종 기능 명세서를 검토해주세요.
        </p>
      </div>

        <FeatureTable
          data={specifications}
          onDataChange={() => {}}
          readOnly
        />

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