import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'

import { Button } from '../components/ui/button'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'cm',
        'cmoutline',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
      ],
      description: '버튼의 스타일 변형',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: '버튼의 크기',
    },
    disabled: {
      control: 'boolean',
      description: '버튼 비활성화 여부',
    },
    asChild: {
      control: 'boolean',
      description: 'Radix UI Slot 컴포넌트로 렌더링할지 여부',
    },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {
    onClick: fn(),
    children: 'Button',
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    variant: 'default',
    size: 'default',
  },
}

export const CM: Story = {
  args: {
    variant: 'cm',
    size: 'default',
  },
}

export const CMOutline: Story = {
  args: {
    variant: 'cmoutline',
    size: 'default',
  },
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    size: 'default',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    size: 'default',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'default',
  },
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    size: 'default',
  },
}

export const Link: Story = {
  args: {
    variant: 'link',
    size: 'default',
  },
}

export const Small: Story = {
  args: {
    variant: 'default',
    size: 'sm',
  },
}

export const Large: Story = {
  args: {
    variant: 'default',
    size: 'lg',
  },
}

export const Icon: Story = {
  args: {
    variant: 'default',
    size: 'icon',
    children: '🔍',
  },
}

export const Disabled: Story = {
  args: {
    variant: 'default',
    size: 'default',
    disabled: true,
  },
}
