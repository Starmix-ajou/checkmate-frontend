import { useAuthStore } from '@/stores/useAuthStore'
import { ArrowUp, Eraser, PencilLine, User } from 'lucide-react'
import { MessageSquareText, MessageSquareX } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

// API 엔드포인트 상수
const API_ENDPOINTS = {
  COMMENTS: `${API_BASE_URL}/comment`,
} as const

interface Author {
  userId: string
  name: string
  email: string
  profileImageUrl: string
  profile: {
    positions: string[]
    projectId: string
    role: string
    isActive: boolean
  }
}

interface Comment {
  commentId: string
  taskId: string
  author: Author
  message: string
  timestamp: string
  isModified: boolean
}

interface TaskCommentProps {
  taskId: string
  assignee: Author
}

export default function TaskComment({ taskId, assignee }: TaskCommentProps) {
  const user = useAuthStore((state) => state.user)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isFetching = useRef(false)
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editingMessage, setEditingMessage] = useState('')

  useEffect(() => {
    const fetchComments = async () => {
      if (!user?.accessToken) {
        console.log('인증 토큰이 없습니다.')
        setLoading(false)
        return
      }

      // 이미 요청 중이면 중복 요청 방지
      if (isFetching.current) return
      isFetching.current = true

      try {
        setLoading(true)
        const response = await fetch(
          `${API_ENDPOINTS.COMMENTS}?taskId=${taskId}`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${user.accessToken}`,
            },
            credentials: 'include',
          }
        )

        if (!response.ok) {
          const errorData = await response.json().catch(() => null)
          throw new Error(
            errorData?.message || `HTTP error! status: ${response.status}`
          )
        }

        const data = await response.json()
        setComments(data)
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : '댓글을 불러오는데 실패했습니다.'
        )
      } finally {
        setLoading(false)
        isFetching.current = false
      }
    }

    if (taskId) {
      fetchComments()
    }
  }, [taskId, user?.accessToken])

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value)
    const target = e.target
    target.style.height = '40px'
    target.style.height = target.scrollHeight + 'px'
  }

  const handleCommentSubmit = async () => {
    if (!comment.trim() || !user?.accessToken) {
      return
    }

    try {
      console.log('댓글 작성 요청 데이터:', {
        taskId,
        message: comment.trim(),
      })

      const response = await fetch(
        `${API_ENDPOINTS.COMMENTS}?taskId=${taskId}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.accessToken}`,
          },
          credentials: 'include',
          body: JSON.stringify({
            message: comment.trim(),
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        console.error('댓글 작성 실패 응답:', errorData)
        throw new Error(
          errorData?.message || `HTTP error! status: ${response.status}`
        )
      }

      // 댓글 작성 성공 후 댓글 목록 새로고침
      const commentsResponse = await fetch(
        `${API_ENDPOINTS.COMMENTS}?taskId=${taskId}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.accessToken}`,
          },
          credentials: 'include',
        }
      )

      if (!commentsResponse.ok) {
        throw new Error('댓글 목록을 불러오는데 실패했습니다.')
      }

      const updatedComments = await commentsResponse.json()
      setComments(updatedComments)
      setComment('')
    } catch (error) {
      console.error('댓글 작성 실패:', error)
      setError(
        error instanceof Error ? error.message : '댓글 작성에 실패했습니다.'
      )
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleCommentSubmit()
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!user?.accessToken) {
      return
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.COMMENTS}/${commentId}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.accessToken}`,
        },
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(
          errorData?.message || `HTTP error! status: ${response.status}`
        )
      }

      // 댓글 삭제 성공 후 댓글 목록 새로고침
      const commentsResponse = await fetch(
        `${API_ENDPOINTS.COMMENTS}?taskId=${taskId}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.accessToken}`,
          },
          credentials: 'include',
        }
      )

      if (!commentsResponse.ok) {
        throw new Error('댓글 목록을 불러오는데 실패했습니다.')
      }

      const updatedComments = await commentsResponse.json()
      setComments(updatedComments)
    } catch (error) {
      console.error('댓글 삭제 실패:', error)
      setError(
        error instanceof Error ? error.message : '댓글 삭제에 실패했습니다.'
      )
    }
  }

  const handleEditComment = async (commentId: string) => {
    const comment = comments.find((c) => c.commentId === commentId)
    if (comment) {
      setEditingCommentId(commentId)
      setEditingMessage(comment.message)
    }
  }

  const handleUpdateComment = async (commentId: string) => {
    if (!user?.accessToken || !editingMessage.trim()) {
      return
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.COMMENTS}/${commentId}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.accessToken}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          message: editingMessage.trim(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(
          errorData?.message || `HTTP error! status: ${response.status}`
        )
      }

      // 댓글 수정 성공 후 댓글 목록 새로고침
      const commentsResponse = await fetch(
        `${API_ENDPOINTS.COMMENTS}?taskId=${taskId}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.accessToken}`,
          },
          credentials: 'include',
        }
      )

      if (!commentsResponse.ok) {
        throw new Error('댓글 목록을 불러오는데 실패했습니다.')
      }

      const updatedComments = await commentsResponse.json()
      setComments(updatedComments)
      setEditingCommentId(null)
      setEditingMessage('')
    } catch (error) {
      console.error('댓글 수정 실패:', error)
      setError(
        error instanceof Error ? error.message : '댓글 수정에 실패했습니다.'
      )
    }
  }

  const handleCancelEdit = () => {
    setEditingCommentId(null)
    setEditingMessage('')
  }

  if (loading) {
    return <div className="p-4 text-center">로딩 중...</div>
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  return (
    <div className="border-t border-gray-200 pt-4">
      <h3 className="text-sm font-medium text-cm-gray mb-4">Comment</h3>
      <div className="space-y-4">
        {/* 댓글 목록 */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.commentId} className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-cm-light flex-shrink-0 flex items-center justify-center">
                {comment.author.profileImageUrl ? (
                  <Image
                    width={24}
                    height={24}
                    src={comment.author.profileImageUrl}
                    alt={comment.author.name}
                    className="w-6 h-6 rounded-full"
                  />
                ) : (
                  <User size={12} className="text-cm" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">
                    {comment.author.name}
                  </span>
                  <span className="text-xs text-cm-gray">
                    {new Date(comment.timestamp).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })}
                    {comment.isModified && ' (수정됨)'}
                  </span>
                </div>
                {editingCommentId === comment.commentId ? (
                  <div className="space-y-2">
                    <textarea
                      className="w-full py-2 pl-5 pr-12 border border-cm-light rounded-2xl focus:outline-none focus:border focus:border-cm resize-none overflow-hidden"
                      style={{ height: '40px' }}
                      value={editingMessage}
                      onChange={(e) => {
                        setEditingMessage(e.target.value)
                        if (e.target.value) {
                          e.target.style.height = '40px'
                          e.target.style.height = `${e.target.scrollHeight}px`
                        } else {
                          e.target.style.height = '40px'
                        }
                      }}
                    />
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleUpdateComment(comment.commentId)}
                        className="text-xs text-cm-gray hover:text-gray-700 flex items-center gap-1"
                      >
                        <MessageSquareText size={14} />
                        저장
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="text-xs text-cm-gray hover:text-gray-700 flex items-center gap-1"
                      >
                        <MessageSquareX size={14} />
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-gray-700 mb-2">
                      {comment.message}
                    </p>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleEditComment(comment.commentId)}
                        className="text-xs text-cm-gray hover:text-gray-700 flex items-center gap-1"
                      >
                        <PencilLine size={14} />
                        수정
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.commentId)}
                        className="text-xs text-cm-gray hover:text-gray-700 flex items-center gap-1"
                      >
                        <Eraser size={14} />
                        삭제
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 댓글 입력 영역 */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <textarea
              className="w-full py-2 pl-5 pr-12 bg-cm-light border border-cm-light rounded-2xl focus:outline-none focus:ring-2 focus:ring-cm min-h-[40px] resize-none overflow-hidden"
              placeholder="코멘트 입력"
              value={comment}
              onChange={handleCommentChange}
              onKeyPress={handleKeyPress}
              style={{ height: '40px' }}
            />
            <div className="absolute inset-right-0 bottom-3.5 right-3">
              <button
                className="w-6 h-6 rounded-full bg-cm-900 flex items-center justify-center"
                onClick={handleCommentSubmit}
              >
                <ArrowUp size={14} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
