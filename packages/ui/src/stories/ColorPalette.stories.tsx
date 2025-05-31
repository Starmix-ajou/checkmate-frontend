import type { Meta, StoryObj } from '@storybook/react'

const ColorBox = ({
  name,
  color,
  className = '',
}: {
  name: string
  color: string
  className?: string
}) => (
  <div className={`flex flex-col gap-2 ${className}`}>
    <div
      className="w-32 h-32 rounded-lg shadow-sm"
      style={{ backgroundColor: color }}
    />
    <div className="text-sm font-medium">{name}</div>
    <div className="text-xs text-gray-500">{color}</div>
  </div>
)

const ColorSection = ({
  title,
  colors,
}: {
  title: string
  colors: { name: string; color: string }[]
}) => (
  <div className="mb-8">
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {colors.map(({ name, color }) => (
        <ColorBox key={name} name={name} color={color} />
      ))}
    </div>
  </div>
)

const ColorPalette = () => {
  const brandColors = [
    { name: 'CM', color: 'var(--color-cm)' },
    { name: 'CM Light', color: 'var(--color-cm-light)' },
    { name: 'CM 100', color: 'var(--color-cm-100)' },
    { name: 'CM 300', color: 'var(--color-cm-300)' },
    { name: 'CM 700', color: 'var(--color-cm-700)' },
    { name: 'CM 900', color: 'var(--color-cm-900)' },
    { name: 'CM Green', color: 'var(--color-cm-green)' },
    { name: 'CM Green Light', color: 'var(--color-cm-green-light)' },
    { name: 'CM Gray', color: 'var(--color-cm-gray)' },
    { name: 'CM Gray Light', color: 'var(--color-cm-gray-light)' },
    { name: 'CM Blue', color: 'var(--color-cm-blue)' },
    { name: 'CM Blue Light', color: 'var(--color-cm-blue-light)' },
  ]

  const semanticColors = [
    { name: 'Primary', color: 'var(--color-primary)' },
    { name: 'Primary Foreground', color: 'var(--color-primary-foreground)' },
    { name: 'Secondary', color: 'var(--color-secondary)' },
    {
      name: 'Secondary Foreground',
      color: 'var(--color-secondary-foreground)',
    },
    { name: 'Accent', color: 'var(--color-accent)' },
    { name: 'Accent Foreground', color: 'var(--color-accent-foreground)' },
    { name: 'Destructive', color: 'var(--color-destructive)' },
    { name: 'Muted', color: 'var(--color-muted)' },
    { name: 'Muted Foreground', color: 'var(--color-muted-foreground)' },
  ]

  const neutralColors = [
    { name: 'Background', color: 'var(--color-background)' },
    { name: 'Foreground', color: 'var(--color-foreground)' },
    { name: 'Card', color: 'var(--color-card)' },
    { name: 'Card Foreground', color: 'var(--color-card-foreground)' },
    { name: 'Popover', color: 'var(--color-popover)' },
    { name: 'Popover Foreground', color: 'var(--color-popover-foreground)' },
    { name: 'Border', color: 'var(--color-border)' },
    { name: 'Input', color: 'var(--color-input)' },
    { name: 'Ring', color: 'var(--color-ring)' },
  ]

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Checkmate Color Palette</h2>
      <ColorSection title="브랜드 색상" colors={brandColors} />
      <ColorSection title="시맨틱 색상" colors={semanticColors} />
      <ColorSection title="중립 색상" colors={neutralColors} />
    </div>
  )
}

const meta = {
  title: 'Design/ColorPalette',
  component: ColorPalette,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Checkmate의 색상 팔레트를 보여주는 컴포넌트입니다.

## 주요 특징
- 브랜드 색상, 시맨틱 색상, 중립 색상으로 구분되어 있습니다.
- 각 색상은 이름과 실제 색상값을 함께 표시합니다.
- 반응형 그리드 레이아웃을 사용하여 다양한 화면 크기에 대응합니다.

## 색상 카테고리
### 브랜드 색상
- CM: 메인 브랜드 색상
- CM Light: 밝은 브랜드 색상
- CM Green: 브랜드 그린 색상
- CM Green Light: 밝은 브랜드 그린 색상
- CM Gray: 브랜드 그레이 색상
- CM Gray Light: 밝은 브랜드 그레이 색상
- CM Blue: 브랜드 블루 색상

### 시맨틱 색상
- Primary: 주요 액션 색상
- Secondary: 보조 액션 색상
- Accent: 강조 색상
- Destructive: 경고/삭제 액션 색상
- Muted: 비활성화된 요소 색상

### 중립 색상
- Background: 배경 색상
- Foreground: 텍스트 색상
- Card: 카드 배경 색상
- Popover: 팝오버 배경 색상
- Border: 테두리 색상
- Input: 입력 필드 색상
- Ring: 포커스 링 색상
        `,
      },
    },
  },
} satisfies Meta<typeof ColorPalette>

export default meta
type Story = StoryObj<typeof ColorPalette>

export const Default: Story = {}
