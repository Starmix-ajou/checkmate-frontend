import type { Meta, StoryObj } from '@storybook/react'

import CheckmateSpinner from '../components/common/CheckmateSpinner'

const meta = {
  title: 'Common/CheckmateSpinner',
  component: CheckmateSpinner,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
checkmate 로고를 활용한 귀여운 로딩 스피너 컴포넌트입니다.

## 주요 특징
- checkmate 로고를 회전시켜 로딩 상태를 표시합니다.
- 크기를 조절할 수 있어 다양한 상황에서 사용 가능합니다.
- 기본 크기는 64px이며, 필요에 따라 크기를 조절할 수 있습니다.

## 사용 예시
\`\`\`tsx
<CheckmateSpinner size={64} />
\`\`\`
        `,
      },
    },
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
