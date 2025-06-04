'use client'

import ProjectSidebar from '@/components/Sidebar'
import { useAuth } from '@/providers/AuthProvider'
import { BaseNavbar } from '@cm/ui/components/common/BaseNavbar'
import MainContent from '@cm/ui/components/common/MainContent'
import { SidebarProvider } from '@cm/ui/components/ui/sidebar'

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, signOut } = useAuth()

  return (
    <SidebarProvider>
      <BaseNavbar
        user={user}
        onSignOut={signOut}
        showSidebarTrigger={true}
        showFilters={false}
      />
      <ProjectSidebar />
      <MainContent>{children}</MainContent>
    </SidebarProvider>
  )
}
