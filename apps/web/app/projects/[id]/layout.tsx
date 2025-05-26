import MainContent from '@/components/MainContent'
import ProjectNavbar from '@/components/project/ProjectNavbar'
import ProjectSidebar from '@/components/project/Sidebar'
import '@blocknote/core/fonts/inter.css'
import '@blocknote/mantine/style.css'
import { SidebarProvider } from '@cm/ui/components/ui/sidebar'
import '@liveblocks/react-tiptap/styles.css'
import '@liveblocks/react-ui/styles.css'
import '@liveblocks/react-ui/styles/dark/media-query.css'

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
