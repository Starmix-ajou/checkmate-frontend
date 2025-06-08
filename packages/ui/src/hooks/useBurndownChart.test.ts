import { Task } from '@cm/types/project'
import { renderHook } from '@testing-library/react'

import { useBurndownChart } from './useBurndownChart'

describe('useBurndownChart', () => {
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

  it('빈 태스크 배열이 주어지면 빈 배열을 반환해야 합니다', () => {
    const { result } = renderHook(() => useBurndownChart([]))
    expect(result.current.burndownData).toEqual([])
  })

  it('시작일과 종료일이 없는 태스크만 있으면 빈 배열을 반환해야 합니다', () => {
    const tasksWithoutDates = mockTasks.map((task) => ({
      ...task,
      startDate: '',
      endDate: '',
    }))
    const { result } = renderHook(() => useBurndownChart(tasksWithoutDates))
    expect(result.current.burndownData).toEqual([])
  })

  it('태스크의 날짜 범위에 맞는 번다운 데이터를 생성해야 합니다', () => {
    const { result } = renderHook(() => useBurndownChart(mockTasks))
    const { burndownData } = result.current

    // 데이터가 존재하는지 확인
    expect(burndownData.length).toBeGreaterThan(0)

    // 첫 번째 데이터 포인트 확인
    const firstData = burndownData[0]
    if (!firstData) throw new Error('First data point should exist')
    expect(firstData.date).toBe('2024-03-01')
    expect(firstData.remaining).toBe(3) // 전체 태스크 수
    expect(firstData.ideal).toBeGreaterThan(0)

    // 마지막 데이터 포인트 확인
    const lastData = burndownData[burndownData.length - 1]
    if (!lastData) throw new Error('Last data point should exist')
    expect(lastData.date).toBe('2024-03-07')
    expect(lastData.remaining).toBe(2) // 완료된 태스크 1개 제외
    expect(lastData.ideal).toBe(0) // 이상적인 진행은 0이 되어야 함
  })

  it('완료된 태스크는 remaining 값을 감소시켜야 합니다', () => {
    const { result } = renderHook(() => useBurndownChart(mockTasks))
    const { burndownData } = result.current

    // Task 1이 완료된 날짜(2024-03-05)의 데이터 확인
    const completionDate = burndownData.find(
      (data) => data.date === '2024-03-05'
    )
    expect(completionDate).toBeDefined()
    expect(completionDate?.remaining).toBe(2) // 3개 중 1개 완료
  })

  it('오늘 날짜가 올바른 형식으로 반환되어야 합니다', () => {
    const { result } = renderHook(() => useBurndownChart(mockTasks))
    const { today } = result.current

    // today가 존재하는지 확인
    expect(today).toBeDefined()
    if (!today) throw new Error('Today date should exist')

    // YYYY-MM-DD 형식인지 확인
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/)

    // 유효한 날짜인지 확인
    const date = new Date(today)
    expect(date.toString()).not.toBe('Invalid Date')
  })
})
