import type { Meta, StoryObj } from '@storybook/react'
import CheckmateSpinner from '../components/common/CheckmateSpinner'

const meta = {
  title: 'Common/CheckmateSpinner',
  component: CheckmateSpinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'number',
      description: '스피너의 크기 (픽셀 단위)',
      defaultValue: 64,
    },
  },
} satisfies Meta<typeof CheckmateSpinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    size: 64,
  },
}

export const Small: Story = {
  args: {
    size: 32,
  },
}

export const Large: Story = {
  args: {
    size: 96,
  },
} 