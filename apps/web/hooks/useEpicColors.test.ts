import { renderHook } from '@testing-library/react'

import { useEpicColors } from './useEpicColors'

describe('useEpicColors', () => {
  const mockTasks = [
    {
      id: 'epic1',
      typeInternal: 'project',
      project: null,
    },
    {
      id: 'epic2',
      typeInternal: 'project',
      project: null,
    },
    {
      id: 'task1',
      typeInternal: 'task',
      project: 'epic1',
    },
    {
      id: 'task2',
      typeInternal: 'task',
      project: 'epic1',
    },
    {
      id: 'task3',
      typeInternal: 'task',
      project: 'epic2',
    },
  ]

  it('에픽에 대해 일관된 색상을 반환해야 합니다', () => {
    const { result } = renderHook(() => useEpicColors(mockTasks))

    // 같은 에픽에 대해 항상 같은 색상이 반환되는지 확인
    const color1 = result.current.getTaskColor(mockTasks[0])
    const color2 = result.current.getTaskColor(mockTasks[0])
    expect(color1).toBe(color2)
  })

  it('다른 에픽에 대해 다른 색상을 반환해야 합니다', () => {
    const { result } = renderHook(() => useEpicColors(mockTasks))

    const color1 = result.current.getTaskColor(mockTasks[0])
    const color2 = result.current.getTaskColor(mockTasks[1])
    expect(color1).not.toBe(color2)
  })

  it('태스크는 상위 에픽의 색상을 80% 투명도로 반환해야 합니다', () => {
    const { result } = renderHook(() => useEpicColors(mockTasks))

    const epicColor = result.current.getTaskColor(mockTasks[0])
    const taskColor = result.current.getTaskColor(mockTasks[2])

    // 태스크 색상은 에픽 색상에 'CC'가 추가된 형태여야 함
    expect(taskColor).toBe(epicColor + 'CC')
  })

  it('상위 에픽이 없는 태스크는 자신의 ID를 기반으로 색상을 가져야 합니다', () => {
    const mockTasks = [
      {
        id: 'task1',
        typeInternal: 'task',
        title: 'Task 1',
      },
    ]

    const { result } = renderHook(() => useEpicColors(mockTasks))
    const taskColor = result.current.getTaskColor(mockTasks[0])

    // task1의 마지막 문자 '1'을 기반으로 색상이 결정되어야 합니다
    expect(taskColor).toMatch(/^#[0-9A-Fa-f]{6}CC$/)
  })

  it('epicColors Map이 올바르게 생성되어야 합니다', () => {
    const { result } = renderHook(() => useEpicColors(mockTasks))

    const epicColors = result.current.epicColors
    expect(epicColors.size).toBe(2) // epic1과 epic2만 포함
    expect(epicColors.has('epic1')).toBe(true)
    expect(epicColors.has('epic2')).toBe(true)
    expect(epicColors.has('task1')).toBe(false) // 태스크는 포함되지 않아야 함
  })
})
