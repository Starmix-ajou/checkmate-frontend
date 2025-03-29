import ProjectSidebar from '@/components/project/Sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <ProjectSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
