import { Sprint } from '@cm/types/userTask'
import { Button } from '@cm/ui/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@cm/ui/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'

interface EpicSprintFilterProps {
  sprints: Sprint[]
  selectedSprintId: string | null
  onSprintSelect: (sprintId: string | null) => void
}

export const EpicSprintFilter = ({
  sprints,
  selectedSprintId,
  onSprintSelect,
}: EpicSprintFilterProps) => {
  const selectedSprint = sprints.find(
    (sprint) => sprint.sprintId === selectedSprintId
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-[400px] justify-between ml-3 mt-1"
        >
          <span className={!selectedSprint ? 'text-cm' : ''}>
            {selectedSprint ? selectedSprint.title : 'ALL'}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[400px]">
        <DropdownMenuItem
          onClick={() => {
            onSprintSelect(null)
          }}
          className="!text-cm"
        >
          ALL
        </DropdownMenuItem>
        {sprints.map((sprint) => (
          <DropdownMenuItem
            key={sprint.sprintId}
            onClick={() => {
              onSprintSelect(sprint.sprintId)
            }}
          >
            <div className="flex items-center gap-2">
              <span>{sprint.title}</span>
              <span className="text-xs text-cm-gray">
                {new Date(sprint.startDate)
                  .toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })
                  .replace(/\. /g, '. ')
                  .replace(/\.$/, '')}{' '}
                ~{' '}
                {new Date(sprint.endDate)
                  .toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })
                  .replace(/\. /g, '. ')
                  .replace(/\.$/, '')}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
