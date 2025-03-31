'use client'

import { useState } from 'react'
import { phases } from './phases'
import FormPhase from '@/components/project/new/FormPhase'
import ChatPhase from '@/components/project/new/ChatPhase'

type Phase = {
  id: number
  title: string
  question: string
  type: 'form' | 'chat'
}

export default function ProjectWizard() {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState<number>(0)

  const handleNextPhase = () => {
    if (currentPhaseIndex < phases.length - 1) {
      setCurrentPhaseIndex((prev) => prev + 1)
    }
  }

  const currentPhase: Phase = phases[currentPhaseIndex]

  return (
    <div className="mx-auto p-6 rounded-lg space-y-6 max-w-5xl">
      {currentPhase.type === 'form' ? (
        <FormPhase phase={currentPhase} onNext={handleNextPhase} />
      ) : (
        <ChatPhase phase={currentPhase} onNext={handleNextPhase} />
      )}
    </div>
  )
}
