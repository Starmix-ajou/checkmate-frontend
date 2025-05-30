'use client'

import MainContent from '@/components/MainContent'
import ProjectSidebar from '@/components/project/Sidebar'
import { useAuth } from '@/providers/AuthProvider'
import '@blocknote/core/fonts/inter.css'
import '@blocknote/mantine/style.css'
import { BaseNavbar } from '@cm/ui/components/common/BaseNavbar'
import { SidebarProvider } from '@cm/ui/components/ui/sidebar'
import '@liveblocks/react-tiptap/styles.css'
import '@liveblocks/react-ui/styles.css'
import '@liveblocks/react-ui/styles/dark/media-query.css'

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
