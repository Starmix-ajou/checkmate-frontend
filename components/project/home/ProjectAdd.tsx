'use client'

import { useRouter } from 'next/navigation'
import { CirclePlus } from 'lucide-react'

const ProjectAdd = () => {
  const router = useRouter()

  const handleClick = () => {
    router.push('/projects/new')
  }

  return (
    <button
      onClick={handleClick}
      className="ml-4 p-2 rounded-full hover:bg-gray-200 transition"
    >
      <CirclePlus className="text-gray-600 hover:text-black" size={28} />
    </button>
  )
}

export default ProjectAdd
