import { Member, Profile } from '@cm/types/project'
import type { Meta, StoryObj } from '@storybook/react'

import ProjectCard from '../components/project/ProjectCard'

const meta = {
  title: 'Project/ProjectCard',
  component: ProjectCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    id: {
      control: 'text',
      description: '프로젝트 ID',
    },
    position: {
      control: 'object',
      description: '프로젝트 포지션 목록',
    },
    members: {
      control: 'object',
      description: '프로젝트 멤버 목록',
    },
    title: {
      control: 'text',
      description: '프로젝트 제목',
    },
    startDate: {
      control: 'text',
      description: '프로젝트 시작일',
    },
    endDate: {
      control: 'text',
      description: '프로젝트 종료일',
    },
    imageUrl: {
      control: 'text',
      description: '프로젝트 이미지 URL',
    },
    profile: {
      control: 'object',
      description: '현재 사용자의 프로필',
    },
  },
} satisfies Meta<typeof ProjectCard>

export default meta
type Story = StoryObj<typeof meta>

const createMember = (name: string, seed: number): Member => ({
  userId: `user-${seed}`,
  name,
  email: `${name.toLowerCase()}@example.com`,
  profileImageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`,
  profile: {
    positions: ['Frontend'],
    projectId: '1',
    isActive: true,
    role: 'MEMBER',
  },
})

const createProfile = (isActive: boolean): Profile => ({
  positions: ['Frontend'],
  projectId: '1',
  isActive,
  role: 'MEMBER',
})

export const Default: Story = {
  args: {
    id: '1',
    position: ['Frontend', 'Backend'],
    members: [createMember('홍길동', 1), createMember('김철수', 2)],
    title: '체크메이트 프로젝트',
    startDate: '2024-01-01',
    endDate: '2024-06-30',
    imageUrl: '',
    profile: createProfile(true),
  },
}

export const Invited: Story = {
  args: {
    ...Default.args,
    profile: createProfile(false),
  },
}

export const WithImage: Story = {
  args: {
    ...Default.args,
    imageUrl: 'https://picsum.photos/400/200',
  },
}

export const InvitedWithImage: Story = {
  args: {
    ...Default.args,
    imageUrl: 'https://picsum.photos/400/200',
    profile: createProfile(false),
  },
}

export const LongTitle: Story = {
  args: {
    ...Default.args,
    title:
      '매우 긴 프로젝트 제목입니다. 이 프로젝트는 체크메이트의 새로운 기능을 개발하는 프로젝트입니다.',
  },
}

export const InvitedLongTitle: Story = {
  args: {
    ...Default.args,
    title:
      '매우 긴 프로젝트 제목입니다. 이 프로젝트는 체크메이트의 새로운 기능을 개발하는 프로젝트입니다.',
    profile: createProfile(false),
  },
}

export const ManyPositions: Story = {
  args: {
    ...Default.args,
    position: ['Frontend', 'Backend', 'Design', 'PM', 'DevOps'],
  },
}

export const InvitedManyPositions: Story = {
  args: {
    ...Default.args,
    position: ['Frontend', 'Backend', 'Design', 'PM', 'DevOps'],
    profile: createProfile(false),
  },
}

export const ManyMembers: Story = {
  args: {
    ...Default.args,
    members: [
      createMember('김평주', 1),
      createMember('한도연', 2),
      createMember('조성연', 3),
      createMember('박승연', 4),
      createMember('최수진', 5),
    ],
  },
}

export const InvitedManyMembers: Story = {
  args: {
    ...Default.args,
    members: [
      createMember('김평주', 1),
      createMember('한도연', 2),
      createMember('조성연', 3),
      createMember('박승연', 4),
      createMember('최수진', 5),
    ],
    profile: createProfile(false),
  },
}
