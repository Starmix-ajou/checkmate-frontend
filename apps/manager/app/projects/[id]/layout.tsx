import ProjectNavbar from '@/components/ProjectNavbar'
import ProjectSidebar from '@/components/Sidebar'
import MainContent from '@cm/ui/components/common/MainContent'
import { SidebarProvider } from '@cm/ui/components/ui/sidebar'

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <ProjectNavbar />
      <ProjectSidebar />
      <MainContent>{children}</MainContent>
    </SidebarProvider>
  )
}
