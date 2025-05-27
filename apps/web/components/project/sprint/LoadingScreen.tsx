'use client'

import CheckmateSpinner from '@cm/ui/components/common/CheckMateSpinner'
import { ReactNode, useEffect, useState } from 'react'

interface LoadingScreenProps {
  message: ReactNode
}

export default function LoadingScreen({ message }: LoadingScreenProps) {
  const [showDelayMessage, setShowDelayMessage] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDelayMessage(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px]">
      <CheckmateSpinner size={64} />
      <p className="mt-2 text-2xl font-bold text-center">{message}</p>
      {showDelayMessage && (
        <p className="mt-2 text-md text-center text-cm-300">
          조금 더 걸릴 수 있어요.
        </p>
      )}
    </div>
  )
}
