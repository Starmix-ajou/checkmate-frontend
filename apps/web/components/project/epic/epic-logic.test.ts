import { renderHook, act } from '@testing-library/react'
import { useEpicLogic, calculateEpicProgress, formatProgress } from './epic-logic'
import { useAuthStore } from '@/stores/useAuthStore'
import { useEpicProgress } from '@/hooks/useEpicProgress'

// Mock the hooks and modules
jest.mock('@/stores/useAuthStore', () => ({
  useAuthStore: jest.fn(),
}))

jest.mock('@/hooks/useEpicProgress')

describe('useEpicLogic', () => {
  const mockUser = {
    accessToken: 'test-token',
  }

  const mockEpics = [
    {
      id: '1',
      title: '테스트 에픽 1',
      description: '테스트 설명 1',
      status: 'IN_PROGRESS',
      projectId: 'project-1',
      sprintId: 'sprint-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks()
    ;(useAuthStore as unknown as jest.Mock).mockReturnValue(mockUser)
    global.fetch = jest.fn()
  })

  it('should fetch epics successfully', async () => {
    // Mock fetch response
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockEpics,
    })

    const { result } = renderHook(() => useEpicLogic('project-1', 'sprint-1'))

    // Initial state
    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBeNull()
    expect(result.current.epics).toEqual([])

    // Wait for the fetch to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    // After fetch
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.epics).toEqual(mockEpics)
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/epic?projectId=project-1&sprintId=sprint-1'),
      expect.any(Object)
    )
  })

  it('should handle fetch error', async () => {
    const errorMessage = 'Network error'
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error(errorMessage))

    const { result } = renderHook(() => useEpicLogic('project-1'))

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(errorMessage)
    expect(result.current.epics).toEqual([])
  })

  it('should not fetch when no access token is available', async () => {
    ;(useAuthStore as unknown as jest.Mock).mockReturnValue({ user: null })

    const { result } = renderHook(() => useEpicLogic('project-1'))

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    expect(result.current.loading).toBe(false)
    expect(global.fetch).not.toHaveBeenCalled()
  })
})

describe('calculateEpicProgress', () => {
  it('should calculate epic progress correctly', () => {
    const mockEpic = {
      id: '1',
      title: '테스트 에픽',
    }
    const mockProgress = 75

    ;(useEpicProgress as jest.Mock).mockReturnValue({ progress: mockProgress })

    const progress = calculateEpicProgress(mockEpic as any)
    expect(progress).toBe(mockProgress)
    expect(useEpicProgress).toHaveBeenCalledWith(mockEpic)
  })
})

describe('formatProgress', () => {
  it('should format progress as percentage', () => {
    expect(formatProgress(75)).toBe('75%')
    expect(formatProgress(0)).toBe('0%')
    expect(formatProgress(100)).toBe('100%')
  })
}) 