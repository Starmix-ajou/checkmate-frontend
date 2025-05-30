'use client'

import ProjectWizard from '@/components/project/new/ProjectWizard'
import { useAuth } from '@/providers/AuthProvider'
import { BaseNavbar } from '@cm/ui/components/common/BaseNavbar'

export default function ProjectCreationPage() {
  const { user, signOut } = useAuth()
  return (
    <div className="w-full h-full">
      <BaseNavbar
        user={user}
        onSignOut={signOut}
        showSidebarTrigger={false}
        showFilters={false}
      />
      <div className="mx-auto p-6 h-full flex flex-col w-full">
        <ProjectWizard />
      </div>
    </div>
  )
}
