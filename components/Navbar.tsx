'use client'

import { ProjectStatus } from '@/types/project'

import BaseNavbar from './BaseNavbar'

type NavbarProps = {
  setFilter?: (filter: ProjectStatus) => void
  currentFilter?: ProjectStatus
}

export default function Navbar({ setFilter, currentFilter = '' }: NavbarProps) {
  return (
    <BaseNavbar
      showFilters={true}
      setFilter={setFilter}
      currentFilter={currentFilter}
    />
  )
}
