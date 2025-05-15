import { Position, Stack } from './NewProjectTeamMember'

export type TableUpdateData<TData> = (
  rowIndex: number,
  columnId: string,
  value: string | TData | Position[] | Stack[]
) => void

declare module '@tanstack/react-table' {
  interface TableMeta<TData> {
    updateData: TableUpdateData<TData>
    readOnly?: boolean
  }
} 