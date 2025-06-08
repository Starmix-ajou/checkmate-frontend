import { Task } from '@cm/types/project'
import { renderHook } from '@testing-library/react'

import { useEffortMetrics } from './useEffortMetrics'

describe('useEffortMetrics', () => {
  const mockTasks: Task[] = [
    {
      taskId: '1',
      title: 'Task 1',
      description: 'Description 1',
      status: 'DONE',
      startDate: '2024-03-01',
      endDate: '2024-03-05',
      priority: 'HIGH',
      assignee: {
        email: 'user1@example.com',
        name: 'User 1',
        profileImageUrl: 'https://example.com/profile1.jpg',
        profiles: [],
        role: 'DEVELOPER',
      },
      epic: {
        epicId: '1',
        title: 'Epic 1',
        description: 'Epic 1 description',
        projectId: '1',
        sprint: undefined,
      },
    },
    {
      taskId: '2',
      title: 'Task 2',
      description: 'Description 2',
      status: 'IN_PROGRESS',
      startDate: '2024-03-02',
      endDate: '2024-03-06',
      priority: 'MEDIUM',
      assignee: {
        email: 'user2@example.com',
        name: 'User 2',
        profileImageUrl: 'https://example.com/profile2.jpg',
        profiles: [],
        role: 'DEVELOPER',
      },
      epic: {
        epicId: '1',
        title: 'Epic 1',
        description: 'Epic 1 description',
        projectId: '1',
        sprint: undefined,
      },
    },
    {
      taskId: '3',
      title: 'Task 3',
      description: 'Description 3',
      status: 'TODO',
      startDate: '2024-03-03',
      endDate: '2024-03-07',
      priority: 'LOW',
      assignee: {
        email: 'user3@example.com',
        name: 'User 3',
        profileImageUrl: 'https://example.com/profile3.jpg',
        profiles: [],
        role: 'DEVELOPER',
      },
      epic: {
        epicId: '1',
        title: 'Epic 1',
        description: 'Epic 1 description',
        projectId: '1',
        sprint: undefined,
      },
    },
  ]

  it('빈 태스크 배열이 주어지면 모든 메트릭이 0이어야 합니다', () => {
    const { result } = renderHook(() => useEffortMetrics([]))
    expect(result.current).toEqual({
      expectedEffort: 0,
      actualEffort: 0,
      remainingEffort: 0,
    })
  })

  it('모든 태스크가 완료된 경우 메트릭이 올바르게 계산되어야 합니다', () => {
    const allDoneTasks = mockTasks.map((task) => ({
      ...task,
      status: 'DONE' as const,
    }))
    const { result } = renderHook(() => useEffortMetrics(allDoneTasks))
    expect(result.current).toEqual({
      expectedEffort: 3,
      actualEffort: 3,
      remainingEffort: 0,
    })
  })

  it('일부 태스크가 완료된 경우 메트릭이 올바르게 계산되어야 합니다', () => {
    const { result } = renderHook(() => useEffortMetrics(mockTasks))
    expect(result.current).toEqual({
      expectedEffort: 3,
      actualEffort: 1, // DONE 상태인 태스크 1개
      remainingEffort: 2, // IN_PROGRESS와 TODO 상태인 태스크 2개
    })
  })

  it('모든 태스크가 미완료인 경우 메트릭이 올바르게 계산되어야 합니다', () => {
    const allIncompleteTasks = mockTasks.map((task) => ({
      ...task,
      status: 'TODO' as const,
    }))
    const { result } = renderHook(() => useEffortMetrics(allIncompleteTasks))
    expect(result.current).toEqual({
      expectedEffort: 3,
      actualEffort: 0,
      remainingEffort: 3,
    })
  })
})
