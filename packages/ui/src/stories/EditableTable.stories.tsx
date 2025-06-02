import type { Meta, StoryObj } from '@storybook/react'
import { ColumnDef } from '@tanstack/react-table'

import { EditableTable } from '../components/project/EditableTable'
import { Checkbox } from '../components/ui/checkbox'
import { Input } from '../components/ui/input'

interface ActionItem {
  id: string
  content: string
  selected: boolean
}

const actionItemColumns: ColumnDef<ActionItem>[] = [
  {
    id: 'select',
    header: () => <input type="checkbox" />,
    cell: ({ row, table }) => {
      const meta = table.options.meta as {
        updateData: (rowIndex: number, columnId: string, value: unknown) => void
      }
      return (
        <Checkbox
          checked={row.original.selected}
          onCheckedChange={(checked) =>
            meta.updateData(row.index, 'selected', checked)
          }
        />
      )
    },
  },
  {
    accessorKey: 'content',
    header: '액션 아이템',
    cell: ({ row, table }) => {
      const meta = table.options.meta as {
        updateData: (rowIndex: number, columnId: string, value: unknown) => void
      }
      return (
        <Input
          value={row.original.content}
          onChange={(e) =>
            meta.updateData(row.index, 'content', e.target.value)
          }
          className="w-full border-none shadow-none"
          placeholder="액션 아이템을 입력하세요"
        />
      )
    },
  },
]

const DEFAULT_ACTION_ITEM: ActionItem = {
  id: '',
  content: '',
  selected: true,
}

const meta = {
  title: 'Project/EditableTable',
  component: EditableTable,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof EditableTable>

export default meta
type Story = StoryObj<typeof meta>

const initialData: ActionItem[] = [
  {
    id: '1',
    content: '프론트엔드 개발 일정 재조정하기',
    selected: true,
  },
  {
    id: '2',
    content: '백엔드 API 문서 업데이트하기',
    selected: true,
  },
  {
    id: '3',
    content: '다음 주 월요일까지 개발 환경 설정 완료하기',
    selected: false,
  },
]

export const Default: Story = {
  args: {
    data: initialData,
    columns: actionItemColumns as ColumnDef<unknown>[],
    onDataChange: (data) => console.log('Data changed:', data),
    addButtonText: '+ 액션 아이템 추가',
    defaultRow: DEFAULT_ACTION_ITEM,
    showHeader: true,
    meta: {
      updateData: (rowIndex: number, columnId: string, value: unknown) => {
        console.log('Update data:', { rowIndex, columnId, value })
      },
    },
  },
}

export const WithoutHeader: Story = {
  args: {
    ...Default.args,
    showHeader: false,
  },
}

export const Empty: Story = {
  args: {
    ...Default.args,
    data: [],
  },
}

export const WithLongContent: Story = {
  args: {
    ...Default.args,
    data: [
      ...initialData,
      {
        id: '4',
        content:
          '매우 긴 액션 아이템 내용입니다. 이 내용은 여러 줄에 걸쳐 표시되어야 하며, 테이블의 레이아웃이 깨지지 않아야 합니다.',
        selected: true,
      },
    ],
  },
}
