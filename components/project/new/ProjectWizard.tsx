'use client'

import ChatPhase from '@/components/project/new/ChatPhase'
import FormPhase from '@/components/project/new/FormPhase'
import { Phase } from '@/types/phase'
import { useState } from 'react'

import { phases } from './phases'

export default function ProjectWizard() {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState<number>(0)
  const [projectDescription, setProjectDescription] = useState('')

  const handleNextPhase = () => {
    if (currentPhaseIndex < phases.length - 1) {
      setCurrentPhaseIndex((prev) => prev + 1)
    }
  }

  const currentPhase: Phase = phases[currentPhaseIndex]

  return (
    <div className="mx-auto p-6 rounded-lg space-y-6 max-w-5xl w-full">
      {currentPhase.type === 'form' ? (
        <FormPhase
          phase={currentPhase}
          onNext={(input: string) => {
            setProjectDescription(input)
            handleNextPhase()
          }}
        />
      ) : (
        <ChatPhase
          phase={currentPhase}
          onNext={handleNextPhase}
          formPhaseInput={projectDescription}
        />
      )}
    </div>
  )
}
