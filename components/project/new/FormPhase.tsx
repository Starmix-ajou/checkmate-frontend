import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Phase } from '@/types/phase'
import { useState } from 'react'
import { TypeAnimation } from 'react-type-animation'

type FormPhaseProps = {
  phase: Phase
  onNext: (input: string) => void
}

export default function FormPhase({ phase, onNext }: FormPhaseProps) {
  const [input, setInput] = useState<string>('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onNext(input)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <TypeAnimation
        sequence={[phase.question, 1000]}
        wrapper="p"
        speed={50}
        repeat={Infinity}
        className="text-8xl font-bold whitespace-pre-line h-64"
      />
      <div className="text-2xl text-gray-500">
        프로젝트를 한 줄로 설명해주세요
      </div>

      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="간단하게 입력하세요"
      />

      <Button type="submit" className="w-full">
        다음
      </Button>
    </form>
  )
}
