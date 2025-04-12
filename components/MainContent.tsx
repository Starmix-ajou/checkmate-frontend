'use client'

import { ReactNode } from 'react'
import { SidebarTrigger } from '@/components/ui/sidebar'

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
