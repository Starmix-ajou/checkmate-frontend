'use client'

import Navbar from '@/components/Navbar'
import ProjectWizard from '@/components/project/new/ProjectWizard'

export default function ProjectCreationPage() {
  return (
    <div className="w-full h-full">
      <Navbar />
      <div className="mx-auto p-6 h-full flex flex-col w-full">
        <ProjectWizard />
      </div>
    </div>
  )
}
