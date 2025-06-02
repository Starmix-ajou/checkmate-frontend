import type { Meta, StoryObj } from '@storybook/react'

import WizardLoadingScreen from '../components/project/WizardLoadingScreen'

const meta = {
  title: 'Project/WizardLoadingScreen',
  component: WizardLoadingScreen,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof WizardLoadingScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    message: (
      <>
        회의록을 요약하고
        <br />
        액션 아이템을 추출하고 있어요.
      </>
    ),
  },
}

export const LongMessage: Story = {
  args: {
    message: (
      <>
        회의록을 요약하고
        <br />
        액션 아이템을 추출하고 있어요.
        <br />
        잠시만 기다려주세요...
      </>
    ),
  },
}

export const ShortMessage: Story = {
  args: {
    message: '로딩 중...',
  },
}
