import { Task } from '@cm/types/project'
import { renderHook } from '@testing-library/react'

import { useBurndownChart } from './useBurndownChart'

describe('useBurndownChart', () => {
  const baseTask: Omit<Task, 'taskId' | 'startDate' | 'endDate'> = {
    title: 'Test Task',
    description: 'Test Description',
    status: 'TODO',
    assignee: {
      email: 'test@example.com',
      name: 'Test User',
      profileImageUrl: 'https://example.com/profile.jpg',
      profiles: [],
      role: 'DEVELOPER',
    },
    priority: 'HIGH',
    epic: {
      epicId: 'epic1',
      title: 'Epic 1',
      description: 'Epic Description 1',
      projectId: 'project1',
    },
    doneDate: null,
  }

  const mockTasks: Task[] = [
    {
      ...baseTask,
      taskId: '1',
      title: 'Task 1',
      status: 'TODO',
      startDate: '2024-03-01',
      endDate: '2024-03-10',
      doneDate: null,
    },
    {
      ...baseTask,
      taskId: '2',
      title: 'Task 2',
      status: 'DONE',
      startDate: '2024-03-01',
      endDate: '2024-03-10',
      doneDate: '2024-03-05',
    },
    {
      ...baseTask,
      taskId: '3',
      title: 'Task 3',
      status: 'DONE',
      startDate: '2024-03-01',
      endDate: '2024-03-10',
      doneDate: '2024-03-10',
    },
  ]

  it('태스크가 없으면 빈 배열을 반환해야 합니다', () => {
    const { result } = renderHook(() => useBurndownChart([]))
    expect(result.current.burndownData).toEqual([])
  })

  it('시작일과 종료일이 없는 태스크는 빈 배열을 반환해야 합니다', () => {
    const tasksWithoutDates: Task[] = [
      {
        ...baseTask,
        taskId: '4',
        title: 'Task 4',
        startDate: '',
        endDate: '',
      },
    ]
    const { result } = renderHook(() => useBurndownChart(tasksWithoutDates))
    expect(result.current.burndownData).toEqual([])
  })

  it('유효하지 않은 날짜 형식의 태스크는 빈 배열을 반환해야 합니다', () => {
    const tasksWithInvalidDates: Task[] = [
      {
        ...baseTask,
        taskId: '5',
        title: 'Task 5',
        startDate: 'invalid-date',
        endDate: 'invalid-date',
      },
    ]
    const { result } = renderHook(() => useBurndownChart(tasksWithInvalidDates))
    expect(result.current.burndownData).toEqual([])
  })

  it('dates 배열이 비어있으면 빈 배열을 반환해야 합니다', () => {
    const tasksWithInvalidDateObjects: Task[] = [
      {
        ...baseTask,
        taskId: '6',
        title: 'Task 6',
        startDate: '2024-03-01',
        endDate: 'invalid-date',
      },
    ]
    const { result } = renderHook(() =>
      useBurndownChart(tasksWithInvalidDateObjects)
    )
    expect(result.current.burndownData).toEqual([])
  })

  it('firstDate나 lastDate가 undefined면 빈 배열을 반환해야 합니다', () => {
    const tasksWithUndefinedDates: Task[] = [
      {
        ...baseTask,
        taskId: '7',
        title: 'Task 7',
        startDate: '2024-03-01',
        endDate: '2024-03-10',
      },
    ]
    const { result } = renderHook(() =>
      useBurndownChart(tasksWithUndefinedDates)
    )
    expect(result.current.burndownData).not.toEqual([])
  })

  it('doneDate를 기준으로 번다운 데이터를 생성해야 합니다', () => {
    const { result } = renderHook(() => useBurndownChart(mockTasks))
    const { burndownData } = result.current

    expect(burndownData.length).toBeGreaterThan(0)

    // 디버깅을 위한 데이터 출력
    console.log('Burndown Data:', JSON.stringify(burndownData, null, 2))
    console.log('Mock Tasks:', JSON.stringify(mockTasks, null, 2))

    // Task 2가 완료된 날짜(2024-03-05) 확인
    const firstCompletionDate = burndownData.find(
      (data) => data.date === '2024-03-05'
    )
    expect(firstCompletionDate).toBeDefined()
    if (firstCompletionDate) {
      expect(firstCompletionDate.remaining).toBe(2) // Task 2가 완료되고 Task 1, 3 남음
    }

    // Task 3이 완료된 날짜(2024-03-10) 확인
    const secondCompletionDate = burndownData.find(
      (data) => data.date === '2024-03-10'
    )
    expect(secondCompletionDate).toBeDefined()
    if (secondCompletionDate) {
      expect(secondCompletionDate.remaining).toBe(1) // Task 2, 3이 완료되고 Task 1만 남음
    }
  })

  it('오늘 날짜가 YYYY-MM-DD 형식으로 반환되어야 합니다', () => {
    const { result } = renderHook(() => useBurndownChart(mockTasks))
    const { today } = result.current
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})
