import type { Meta, StoryObj } from '@storybook/react'

import {
  PositionBadge,
  PositionBadgeGroup,
} from '../components/ui/position-badge'

const meta: Meta<typeof PositionBadge> = {
  title: 'UI/PositionBadge',
  component: PositionBadge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
PositionBadge는 프로젝트에서 사용자의 포지션을 표시하는 뱃지 컴포넌트입니다.

## 주요 특징
- 포지션에 따라 자동으로 랜덤한 배경색과 텍스트 색상이 지정됩니다.
- 단일 포지션 표시와 여러 포지션을 그룹으로 표시하는 두 가지 사용 방식을 지원합니다.
- 내용물에 맞게 자동으로 너비가 조절됩니다 (inline-flex 사용).

## 사용 방법
### 단일 포지션 표시
\`\`\`tsx
<PositionBadge position="프론트엔드" />
\`\`\`

### 여러 포지션 그룹으로 표시
\`\`\`tsx
<PositionBadgeGroup positions={['프론트엔드', '백엔드', '디자이너']} />
\`\`\`

## Props
### PositionBadge
| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| position | string | 필수 | 표시할 포지션 이름 |
| className | string | '' | 추가적인 스타일링을 위한 클래스명 |

### PositionBadgeGroup
| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| positions | string[] | 필수 | 표시할 포지션 이름 배열 |
| className | string | '' | 추가적인 스타일링을 위한 클래스명 |

## 스타일링
- 기본적으로 작은 텍스트 크기(text-xs)와 중간 굵기(font-medium)를 사용합니다.
- 패딩은 좌우 0.5rem(px-2), 상하 0.25rem(py-1)이 적용됩니다.
- 모서리는 둥글게(rounded-md) 처리됩니다.
- 포지션별로 랜덤한 배경색과 텍스트 색상이 자동으로 지정됩니다.
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof PositionBadge>

export const Default: Story = {
  args: {
    position: '프론트엔드',
  },
  parameters: {
    docs: {
      description: {
        story:
          '기본적인 단일 포지션 뱃지입니다. 내용물에 맞게 자동으로 너비가 조절됩니다.',
      },
    },
  },
}

export const Backend: Story = {
  args: {
    position: '백엔드',
  },
  parameters: {
    docs: {
      description: {
        story:
          '다른 포지션의 뱃지 예시입니다. 포지션마다 다른 랜덤 색상이 적용됩니다.',
      },
    },
  },
}

export const Designer: Story = {
  args: {
    position: '디자이너',
  },
  parameters: {
    docs: {
      description: {
        story: '디자이너 포지션의 뱃지 예시입니다.',
      },
    },
  },
}

export const PM: Story = {
  args: {
    position: 'PM',
  },
  parameters: {
    docs: {
      description: {
        story: 'PM 포지션의 뱃지 예시입니다.',
      },
    },
  },
}

export const Group: Story = {
  render: () => (
    <PositionBadgeGroup
      positions={['프론트엔드', '백엔드', '디자이너', 'PM']}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          '여러 포지션을 그룹으로 표시하는 예시입니다. PositionBadgeGroup 컴포넌트를 사용하여 여러 뱃지를 flex-wrap으로 배치합니다.',
      },
    },
  },
}

export const CustomClassName: Story = {
  args: {
    position: '프론트엔드',
    className: 'text-sm font-bold',
  },
  parameters: {
    docs: {
      description: {
        story:
          'className prop을 통해 커스텀 스타일을 적용한 예시입니다. 여기서는 텍스트 크기를 키우고 글자를 굵게 만들었습니다.',
      },
    },
  },
}
