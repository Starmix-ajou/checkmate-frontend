import { Task } from '@/types/userTask'
import { SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'

type FilterOption = {
  priority: Task['priority'] | 'ALL'
  epicId: string
  sprint: string
  assigneeEmails: string[]
}

type TaskFilterProps = {
  epics: {
    epicId: string
    title: string
    description: string
    projectId: string
  }[]
  onFilterChange: (filters: FilterOption) => void
}

export default function TaskFilter({ epics, onFilterChange }: TaskFilterProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFixed, setIsFixed] = useState(false)
  const [activeFilter, setActiveFilter] = useState<keyof FilterOption | null>(
    null
  )
  const [filters, setFilters] = useState<FilterOption>({
    priority: 'ALL',
    epicId: '',
    sprint: '',
    assigneeEmails: [],
  })

  const handleFilterChange = (key: keyof FilterOption, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    console.log('TaskFilter - 필터 변경:', JSON.stringify(newFilters, null, 2))
    onFilterChange(newFilters)
  }

  const handleIconClick = () => {
    setIsFixed(!isFixed)
    if (!isFixed) {
      setIsHovered(true)
    }
  }

  return (
    <div className="relative flex items-center">
      <div className="flex items-center">
        <div className="relative">
          <button
            onClick={handleIconClick}
            className="flex items-center justify-center w-8 h-8"
            onMouseEnter={() => !isFixed && setIsHovered(true)}
            onMouseLeave={() => !isFixed && setIsHovered(false)}
          >
            <SlidersHorizontal
              size={20}
              className={`transition-colors ${
                isFixed ? 'text-black-01' : 'text-gray-01 hover:text-black-01'
              }`}
            />
          </button>
        </div>

        {(isHovered || isFixed) && (
          <div className="absolute right-full mr-4 flex items-center gap-4">
            <div className="relative">
              <button
                className={`text-sm whitespace-nowrap ${
                  activeFilter === 'priority' ? 'text-black-01' : 'text-gray-01'
                }`}
                onClick={() =>
                  setActiveFilter(
                    activeFilter === 'priority' ? null : 'priority'
                  )
                }
              >
                Priority
              </button>
              {activeFilter === 'priority' && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg p-2 z-10">
                  <div
                    className="px-3 py-1 hover:bg-gray-100 cursor-pointer text-sm whitespace-nowrap text-[#795548]"
                    onClick={() => handleFilterChange('priority', 'ALL')}
                  >
                    ALL
                  </div>
                  {['LOW', 'MEDIUM', 'HIGH'].map((priority) => (
                    <div
                      key={priority}
                      className={`px-3 py-1 hover:bg-gray-100 cursor-pointer text-sm whitespace-nowrap ${
                        priority === 'LOW'
                          ? 'text-[#204206]'
                          : priority === 'MEDIUM'
                            ? 'text-[#B46C00]'
                            : 'text-[#D91F11]'
                      }`}
                      onClick={() =>
                        handleFilterChange(
                          'priority',
                          priority as Task['priority']
                        )
                      }
                    >
                      {priority}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                className={`text-sm whitespace-nowrap ${
                  activeFilter === 'epicId' ? 'text-black-01' : 'text-gray-01'
                }`}
                onClick={() =>
                  setActiveFilter(activeFilter === 'epicId' ? null : 'epicId')
                }
              >
                Epic
              </button>
              {activeFilter === 'epicId' && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg p-2 z-10">
                  <div
                    className="px-3 py-1 hover:bg-gray-100 cursor-pointer text-sm whitespace-nowrap text-[#795548]"
                    onClick={() => handleFilterChange('epicId', '')}
                  >
                    ALL
                  </div>
                  {epics.map((epic) => (
                    <div
                      key={epic.epicId}
                      className="px-3 py-1 hover:bg-gray-100 cursor-pointer text-sm whitespace-nowrap"
                      onClick={() => {
                        console.log('선택된 Epic:', epic)
                        handleFilterChange('epicId', epic.epicId)
                      }}
                    >
                      {epic.title}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                className={`text-sm whitespace-nowrap ${
                  activeFilter === 'sprint' ? 'text-black-01' : 'text-gray-01'
                }`}
                onClick={() =>
                  setActiveFilter(activeFilter === 'sprint' ? null : 'sprint')
                }
              >
                Sprint
              </button>
              {activeFilter === 'sprint' && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg p-2 z-10">
                  <div
                    className="px-3 py-1 hover:bg-gray-100 cursor-pointer text-sm whitespace-nowrap text-[#795548]"
                    onClick={() => handleFilterChange('sprint', '')}
                  >
                    ALL
                  </div>
                  {['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4'].map(
                    (sprint) => (
                      <div
                        key={sprint}
                        className="px-3 py-1 hover:bg-gray-100 cursor-pointer text-sm whitespace-nowrap"
                        onClick={() => handleFilterChange('sprint', sprint)}
                      >
                        {sprint}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
