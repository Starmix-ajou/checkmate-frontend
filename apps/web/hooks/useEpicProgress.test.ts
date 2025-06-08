import { Epic } from '@cm/types/epic'
import { renderHook } from '@testing-library/react'

import { useEpicProgress } from './useEpicProgress'

describe('useEpicProgress', () => {
  const createMockEpic = (
    tasks: { status: 'TODO' | 'IN_PROGRESS' | 'DONE' }[]
  ): Epic => ({
    epicId: 'epic1',
    title: 'Test Epic',
    description: 'Test Description',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    sprint: {
      sprintId: 'sprint1',
      title: 'Sprint 1',
      description: 'Test Sprint',
      sequence: 1,
      projectId: 'project1',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      epics: [
        {
          epicId: 'epic1',
          title: 'Test Epic',
          description: 'Test Description',
          projectId: 'project1',
          featureId: 'feature1',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
        },
      ],
    },
    tasks: tasks.map((task, index) => ({
      taskId: `task${index + 1}`,
      title: `Task ${index + 1}`,
      description: `Description ${index + 1}`,
      status: task.status,
      assignee: {
        userId: 'user1',
        name: 'Test User',
        email: 'test@example.com',
        profileImageUrl: 'https://example.com/profile.jpg',
        profiles: [
          {
            positions: ['Developer'],
            projectId: 'project1',
            role: 'MEMBER',
          },
        ],
      },
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      priority: 'MEDIUM',
      epic: {
        epicId: 'epic1',
        title: 'Test Epic',
        description: 'Test Description',
        projectId: 'project1',
        featureId: 'feature1',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      },
    })),
  })

  it('태스크가 없는 에픽의 진행도는 0이어야 합니다', () => {
    const mockEpic = createMockEpic([])
    const { result } = renderHook(() => useEpicProgress(mockEpic))

    expect(result.current.progress).toBe(0)
  })

  it('모든 태스크가 완료된 에픽의 진행도는 100이어야 합니다', () => {
    const mockEpic = createMockEpic([
      { status: 'DONE' },
      { status: 'DONE' },
      { status: 'DONE' },
    ])
    const { result } = renderHook(() => useEpicProgress(mockEpic))

    expect(result.current.progress).toBe(100)
  })

  it('일부 태스크가 완료된 에픽의 진행도가 올바르게 계산되어야 합니다', () => {
    const mockEpic = createMockEpic([
      { status: 'DONE' },
      { status: 'DONE' },
      { status: 'IN_PROGRESS' },
      { status: 'TODO' },
    ])
    const { result } = renderHook(() => useEpicProgress(mockEpic))

    expect(result.current.progress).toBe(50) // 2/4 = 50%
  })

  it('진행도 포맷팅이 올바르게 동작해야 합니다', () => {
    const mockEpic = createMockEpic([
      { status: 'DONE' },
      { status: 'DONE' },
      { status: 'IN_PROGRESS' },
    ])
    const { result } = renderHook(() => useEpicProgress(mockEpic))

    expect(result.current.formatProgress(result.current.progress)).toBe('67%')
  })

  it('진행도가 소수점 이하를 반올림해야 합니다', () => {
    const mockEpic = createMockEpic([
      { status: 'DONE' },
      { status: 'IN_PROGRESS' },
      { status: 'IN_PROGRESS' },
    ])
    const { result } = renderHook(() => useEpicProgress(mockEpic))

    // 1/3 ≈ 33.33...% → 33%
    expect(result.current.progress).toBe(33)
  })
})
