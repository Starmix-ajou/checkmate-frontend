import CheckMateLogoSpinner from '@/components/CheckMateSpinner'
import { ReactNode } from 'react'

interface LoadingScreenProps {
  message: ReactNode
}

export default function LoadingScreen({ message }: LoadingScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px]">
      <CheckMateLogoSpinner size={64} />
      <p className="mt-2 text-2xl font-bold text-center">{message}</p>
    </div>
  )
}
