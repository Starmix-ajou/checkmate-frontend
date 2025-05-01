'use client'

import { SidebarTrigger } from '@/components/ui/sidebar'
import { ReactNode } from 'react'

interface MainContentProps {
  children: ReactNode
}

export default function MainContent({ children }: MainContentProps) {
  return (
    <section className="w-full">
      <SidebarTrigger />
      {children}
    </section>
  )
}
