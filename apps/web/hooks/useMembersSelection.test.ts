import { renderHook, act } from '@testing-library/react'
import { useMembersSelection } from './useMembersSelection'
import { Member, Profile } from '@cm/types/project'

const createMockProfile = (projectId: string): Profile => ({
  positions: ['Developer'],
  projectId,
  role: 'Developer',
  isActive: true,
})

const mockMembers: Member[] = [
  {
    userId: '1',
    name: 'Member 1',
    email: 'member1@test.com',
    profileImageUrl: 'https://example.com/profile1.jpg',
    profile: createMockProfile('project-1'),
  },
  {
    userId: '2',
    name: 'Member 2',
    email: 'member2@test.com',
    profileImageUrl: 'https://example.com/profile2.jpg',
    profile: createMockProfile('project-1'),
  },
]

const mockLeader: Member = {
  userId: '3',
  name: 'Leader',
  email: 'leader@test.com',
  profileImageUrl: 'https://example.com/leader.jpg',
  profile: createMockProfile('project-1'),
}

const mockProductManager: Member = {
  userId: '4',
  name: 'PM',
  email: 'pm@test.com',
  profileImageUrl: 'https://example.com/pm.jpg',
  profile: createMockProfile('project-1'),
}

describe('useMembersSelection', () => {
  it('초기 상태를 올바르게 설정해야 합니다', () => {
    const { result } = renderHook(() =>
      useMembersSelection({
        members: mockMembers,
        leader: mockLeader,
        productManager: mockProductManager,
      })
    )

    expect(result.current.selectedMembers).toEqual([])
    expect(result.current.selectedMemberIds.size).toBe(0)
    expect(result.current.isAllSelected).toBe(false)
  })

  it('멤버 선택 기능이 올바르게 동작해야 합니다', () => {
    const { result } = renderHook(() =>
      useMembersSelection({
        members: mockMembers,
        leader: mockLeader,
        productManager: mockProductManager,
      })
    )

    // 일반 멤버 선택
    act(() => {
      result.current.handleSelectMember('1', true)
    })

    expect(result.current.selectedMemberIds.has('1')).toBe(true)
    expect(result.current.selectedMembers).toHaveLength(1)
    expect(result.current.selectedMembers[0].userId).toBe('1')

    // 리더 선택
    act(() => {
      result.current.handleSelectMember('3', true)
    })

    expect(result.current.selectedMemberIds.has('3')).toBe(true)
    expect(result.current.selectedMembers).toHaveLength(2)
    expect(result.current.selectedMembers[1].userId).toBe('3')

    // PM 선택
    act(() => {
      result.current.handleSelectMember('4', true)
    })

    expect(result.current.selectedMemberIds.has('4')).toBe(true)
    expect(result.current.selectedMembers).toHaveLength(3)
    expect(result.current.selectedMembers[2].userId).toBe('4')

    // 멤버 선택 해제
    act(() => {
      result.current.handleSelectMember('1', false)
    })

    expect(result.current.selectedMemberIds.has('1')).toBe(false)
    expect(result.current.selectedMembers).toHaveLength(2)
  })

  it('전체 선택 기능이 올바르게 동작해야 합니다', () => {
    const { result } = renderHook(() =>
      useMembersSelection({
        members: mockMembers,
        leader: mockLeader,
        productManager: mockProductManager,
      })
    )

    // 전체 선택
    act(() => {
      result.current.handleSelectAll(true)
    })

    expect(result.current.isAllSelected).toBe(true)
    expect(result.current.selectedMemberIds.size).toBe(mockMembers.length)
    expect(result.current.selectedMembers).toHaveLength(mockMembers.length)

    // 전체 선택 해제
    act(() => {
      result.current.handleSelectAll(false)
    })

    expect(result.current.isAllSelected).toBe(false)
    expect(result.current.selectedMemberIds.size).toBe(0)
    expect(result.current.selectedMembers).toHaveLength(0)
  })

  it('선택 초기화가 올바르게 동작해야 합니다', () => {
    const { result } = renderHook(() =>
      useMembersSelection({
        members: mockMembers,
        leader: mockLeader,
        productManager: mockProductManager,
      })
    )

    // 멤버 선택
    act(() => {
      result.current.handleSelectMember('1', true)
      result.current.handleSelectMember('2', true)
    })

    expect(result.current.selectedMembers).toHaveLength(2)

    // 선택 초기화
    act(() => {
      result.current.clearSelection()
    })

    expect(result.current.selectedMembers).toHaveLength(0)
    expect(result.current.selectedMemberIds.size).toBe(0)
    expect(result.current.isAllSelected).toBe(false)
  })

  it('존재하지 않는 멤버 ID로 선택 시도 시 아무 변화가 없어야 합니다', () => {
    const { result } = renderHook(() =>
      useMembersSelection({
        members: mockMembers,
        leader: mockLeader,
        productManager: mockProductManager,
      })
    )

    act(() => {
      result.current.handleSelectMember('non-existent-id', true)
    })

    expect(result.current.selectedMembers).toHaveLength(0)
    expect(result.current.selectedMemberIds.size).toBe(0)
  })
}) 