import { renderHook, act } from '@testing-library/react'
import { useMemberSelection } from './useMemberSelection'
import { Member } from '@cm/types/project'

describe('useMemberSelection', () => {
  const mockMembers: Member[] = [
    {
      userId: '1',
      name: '김평주',
      email: 'kim@example.com',
      profileImageUrl: 'https://example.com/profile1.jpg',
      profile: {
        positions: ['Frontend'],
        projectId: 'project1',
        role: 'Developer',
        isActive: true
      }
    },
    {
      userId: '2',
      name: '한도연',
      email: 'lee@example.com',
      profileImageUrl: 'https://example.com/profile2.jpg',
      profile: {
        positions: ['Frontend'],
        projectId: 'project1',
        role: 'Developer',
        isActive: true
      }
    },
    {
      userId: '3',
      name: '조성연',
      email: 'park@example.com',
      profileImageUrl: 'https://example.com/profile3.jpg',
      profile: {
        positions: ['Backend'],
        projectId: 'project1',
        role: 'Developer',
        isActive: true
      }
    }
  ]

  it('초기 상태가 올바르게 설정되어야 합니다', () => {
    const { result } = renderHook(() => useMemberSelection(mockMembers))

    expect(result.current.selectedMembers.size).toBe(0)
    expect(result.current.isAllSelected).toBe(false)
  })

  it('전체 선택이 올바르게 동작해야 합니다', () => {
    const { result } = renderHook(() => useMemberSelection(mockMembers))

    act(() => {
      result.current.handleSelectAll(true)
    })

    expect(result.current.selectedMembers.size).toBe(mockMembers.length)
    expect(result.current.isAllSelected).toBe(true)

    act(() => {
      result.current.handleSelectAll(false)
    })

    expect(result.current.selectedMembers.size).toBe(0)
    expect(result.current.isAllSelected).toBe(false)
  })

  it('개별 멤버 선택이 올바르게 동작해야 합니다', () => {
    const { result } = renderHook(() => useMemberSelection(mockMembers))

    act(() => {
      result.current.handleSelectMember('1', true)
    })

    expect(result.current.selectedMembers.has('1')).toBe(true)
    expect(result.current.selectedMembers.size).toBe(1)
    expect(result.current.isAllSelected).toBe(false)

    act(() => {
      result.current.handleSelectMember('1', false)
    })

    expect(result.current.selectedMembers.has('1')).toBe(false)
    expect(result.current.selectedMembers.size).toBe(0)
  })

  it('모든 멤버를 개별적으로 선택하면 isAllSelected가 true가 되어야 합니다', () => {
    const { result } = renderHook(() => useMemberSelection(mockMembers))

    mockMembers.forEach(member => {
      act(() => {
        result.current.handleSelectMember(member.userId, true)
      })
    })

    expect(result.current.selectedMembers.size).toBe(mockMembers.length)
    expect(result.current.isAllSelected).toBe(true)
  })
}) 