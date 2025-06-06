'use client'

import ChatPhase from '@/components/project/new/ChatPhase'
import CompletionPhase from '@/components/project/new/CompletionPhase'
import FormPhase from '@/components/project/new/FormPhase'
import { Feature, Phase } from '@cm/types/project-creation'
import { useState } from 'react'

import { phases } from './phases'

export default function ProjectWizard() {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState<number>(0)
  const [projectDescription, setProjectDescription] = useState('')
  const [finalSpecifications, setFinalSpecifications] = useState<Feature[]>([])
  const [projectId, setProjectId] = useState<string>('')

  const handleNextPhase = () => {
    if (currentPhaseIndex < phases.length - 1) {
      setCurrentPhaseIndex((prev) => prev + 1)
    }
  }

  const currentPhase: Phase = phases[currentPhaseIndex]

  if (currentPhase.id === 8) {
    return (
      <div className="mx-auto p-6 space-y-6 max-w-4xl w-full h-full">
        <CompletionPhase
          specifications={finalSpecifications}
          projectId={projectId}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto p-2 space-y-6 max-w-4xl w-full h-full">
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
          onSpecificationsComplete={(specifications, id) => {
            setFinalSpecifications(specifications)
            setProjectId(id)
          }}
        />
      )}
    </div>
  )
}
