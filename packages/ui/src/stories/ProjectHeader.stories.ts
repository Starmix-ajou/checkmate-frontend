import { Project } from '@cm/types/project'
import type { Meta, StoryObj } from '@storybook/react'

import ProjectHeader from '../components/project/ProjectHeader'

const meta = {
  title: 'Project/ProjectHeader',
  component: ProjectHeader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    project: {
      control: 'object',
      description: '프로젝트 정보',
    },
    loading: {
      control: 'boolean',
      description: '로딩 상태',
    },
  },
} satisfies Meta<typeof ProjectHeader>

export default meta
type Story = StoryObj<typeof meta>

const createMember = (name: string, seed: number) => ({
  userId: `user-${seed}`,
  name,
  email: `${name.toLowerCase()}@example.com`,
  profileImageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`,
  profiles: [
    {
      positions: ['Frontend'],
      projectId: '1',
    },
  ],
  role: 'MEMBER',
})

const sampleProject: Project = {
  projectId: '1',
  title: '체크메이트 프로젝트',
  description: '체크메이트 프로젝트의 새로운 기능을 개발합니다.',
  startDate: '2024-01-01',
  endDate: '2024-06-30',
  members: [
    createMember('홍길동', 1),
    createMember('김철수', 2),
    createMember('이영희', 3),
  ],
  leader: createMember('홍길동', 1),
  imageUrl: 'https://picsum.photos/400/200',
  epics: [],
}

export const Default: Story = {
  args: {
    project: sampleProject,
    loading: false,
  },
}

export const Loading: Story = {
  args: {
    project: null,
    loading: true,
  },
}

export const LongTitle: Story = {
  args: {
    project: {
      ...sampleProject,
      title:
        '매우 긴 프로젝트 제목입니다. 이 프로젝트는 체크메이트의 새로운 기능을 개발하는 프로젝트입니다.',
    },
    loading: false,
  },
}

export const ManyMembers: Story = {
  args: {
    project: {
      ...sampleProject,
      members: [
        createMember('김평주', 1),
        createMember('한도연', 2),
        createMember('조성연', 3),
        createMember('박승연', 4),
        createMember('최수진', 5),
        createMember('강민수', 6),
        createMember('정다은', 7),
      ],
    },
    loading: false,
  },
}
