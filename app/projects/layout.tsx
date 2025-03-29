import { SidebarProvider } from '@/components/ui/sidebar'

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <SidebarProvider>{children}</SidebarProvider>
}
