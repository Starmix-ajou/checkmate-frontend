import MainContent from '@/components/MainContent'
import ProjectSidebar from '@/components/project/Sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import '@blocknote/core/fonts/inter.css'
import '@blocknote/mantine/style.css'
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
      <ProjectSidebar />
      <MainContent>{children}</MainContent>
    </SidebarProvider>
  )
}
