import type { Meta, StoryObj } from '@storybook/react'

import AvatarGroup from '../components/project/AvatarGroup'

const meta = {
  title: 'Project/AvatarGroup',
  component: AvatarGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    users: {
      control: 'object',
      description: '사용자 목록',
    },
    className: {
      control: 'text',
      description: '추가 CSS 클래스',
    },
  },
} satisfies Meta<typeof AvatarGroup>

export default meta
type Story = StoryObj<typeof meta>

const createUser = (name: string, seed: number) => ({
  name,
  src: `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`,
})

export const Default: Story = {
  args: {
    users: [
      createUser('김평주', 1),
      createUser('한도연', 2),
      createUser('조성연', 3),
    ],
  },
}

export const ManyUsers: Story = {
  args: {
    users: [
      createUser('김평주', 1),
      createUser('한도연', 2),
      createUser('조성연', 3),
      createUser('박지민', 4),
      createUser('최수진', 5),
      createUser('강민수', 6),
    ],
  },
}

export const WithCustomClass: Story = {
  args: {
    users: [
      createUser('김평주', 1),
      createUser('한도연', 2),
      createUser('조성연', 3),
    ],
    className: 'scale-150',
  },
}

export const SingleUser: Story = {
  args: {
    users: [createUser('김평주', 1)],
  },
}

export const NoUsers: Story = {
  args: {
    users: [],
  },
}
