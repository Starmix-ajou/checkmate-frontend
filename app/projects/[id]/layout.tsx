import ProjectSidebar from '@/components/project/Sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import '@blocknote/core/fonts/inter.css'
import '@blocknote/mantine/style.css'
import '@liveblocks/react-ui/styles.css'
import '@liveblocks/react-ui/styles/dark/media-query.css'
import '@liveblocks/react-tiptap/styles.css'

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
