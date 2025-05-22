'use client'

import { ReactNode } from 'react'

interface MainContentProps {
  children: ReactNode
}

export default function MainContent({ children }: MainContentProps) {
  return <section className="w-full">{children}</section>
}
