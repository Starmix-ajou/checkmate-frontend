import { Position } from '@cm/types/project'

export type TableUpdateData<TData> = (
  rowIndex: number,
  columnId: string,
  value: string | TData | Position[]
) => void

declare module '@tanstack/react-table' {
  interface TableMeta<TData> {
    updateData: TableUpdateData<TData>
    readOnly?: boolean
  }
}
