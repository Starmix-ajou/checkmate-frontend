// components/project/home/ProjectAdd.tsx
import { CirclePlus } from 'lucide-react'

const ProjectAdd = () => {
  return (
    <button className="ml-4 p-2 rounded-full hover:bg-gray-200 transition">
      <CirclePlus className="text-gray-600 hover:text-black" size={28} />
    </button>
  )
}

export default ProjectAdd
