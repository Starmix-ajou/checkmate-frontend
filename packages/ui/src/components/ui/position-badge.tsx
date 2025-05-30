import { getPositionColor } from '@cm/ui/hooks/useRandomColor'

interface PositionBadgeProps {
  position: string
  className?: string
}

export const PositionBadge = ({ position, className = '' }: PositionBadgeProps) => {
  const { bgColor, textColor } = getPositionColor(position)

  return (
    <div
      className={`inline-flex text-xs font-medium px-2 py-1 rounded-md ${className}`}
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      {position}
    </div>
  )
}

interface PositionBadgeGroupProps {
  positions: string[]
  className?: string
}

export const PositionBadgeGroup = ({ positions, className = '' }: PositionBadgeGroupProps) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {positions.map((position) => (
        <PositionBadge key={position} position={position} />
      ))}
    </div>
  )
} 