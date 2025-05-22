import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Feature } from '@/types/project-creation'

interface DefinitionTableProps {
  data: Feature[]
}

export function DefinitionTable({ data }: DefinitionTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>기능명</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((feature, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{feature.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
