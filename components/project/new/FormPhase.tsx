import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Phase } from '@/types/phase'

type FormPhaseProps = {
  phase: Phase
  onNext: () => void
}

export default function FormPhase({ phase, onNext }: FormPhaseProps) {
  const [input, setInput] = useState<string>('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onNext()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="block text-6xl font-medium">{phase.question}</div>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="프로젝트를 한 줄로 설명해주세요"
      />
      <Button type="submit" className="w-full">
        다음
      </Button>
    </form>
  )
}
