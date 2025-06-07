import { Notification, getNotifications } from '@cm/api/notifications'
import { Button } from '@cm/ui/components/ui/button'
import { BellRingIcon, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { UseNotificationSSE } from '@/hooks/useNotificationSSE'
import { useAuthStore } from '@/stores/useAuthStore'

interface GlobalNotificationPanelProps {
  projectId: string
}

export function GlobalNotificationPanel({ projectId }: GlobalNotificationPanelProps) {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [totalNotifications, setTotalNotifications] = useState(0)
  const observer = useRef<IntersectionObserver | null>(null)
  const PAGE_SIZE = 10

  const { startSSE } = UseNotificationSSE({
    onNewNotification: (newNotification) => {
      toast(newNotification.title, {
        description: newNotification.description,
        icon: <BellRingIcon className="size-4" />,
        duration: 5000,
        action: (
          <Button
            variant="cm"
            onClick={() => {
              const link = getNotificationLink(newNotification)
              if (link) {
                router.push(link)
                setIsOpen(false)
              }
            }}
          >
            확인
          </Button>
        ),
      })

      setNotifications((prev) => {
        const filtered = prev.filter(
          (n) => n.notificationId !== newNotification.notificationId
        )
        return [newNotification, ...filtered]
      })
      setTotalNotifications((prev) => prev + 1)
    },
    onError: (error) => {
      console.error('SSE 알림 오류:', error)
      toast.error('알림을 받는 중 오류가 발생했습니다.')
    },
    onOpen: async () => {
      console.log('SSE 연결 성공')
    },
  })

  const loadInitialNotifications = useCallback(async () => {
    if (!user?.accessToken) return

    try {
      setIsLoading(true)
      const response = await getNotifications(
        user.accessToken,
        projectId,
        0,
        PAGE_SIZE
      )
      setNotifications(response.content)
      setHasMore(!response.last)
      setPage(0)
      setTotalNotifications(response.totalElements)
    } catch (error) {
      console.error('알림 로드 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }, [user?.accessToken, projectId])

  const loadMoreNotifications = useCallback(async () => {
    if (!user?.accessToken || isLoading || !hasMore) return

    try {
      setIsLoading(true)
      const nextPage = page + 1
      const response = await getNotifications(
        user.accessToken,
        projectId,
        nextPage,
        PAGE_SIZE
      )

      setNotifications((prev) => [...prev, ...response.content])
      setHasMore(!response.last)
      setPage(nextPage)
    } catch (error) {
      console.error('추가 알림 로드 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }, [user?.accessToken, projectId, page, isLoading, hasMore])

  const lastNotificationRef = useCallback(
    (node: HTMLLIElement | null) => {
      if (isLoading) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreNotifications()
        }
      })

      if (node) observer.current.observe(node)
    },
    [isLoading, hasMore, loadMoreNotifications]
  )

  useEffect(() => {
    if (user?.accessToken) {
      loadInitialNotifications()
    }
  }, [user?.accessToken, loadInitialNotifications])

  useEffect(() => {
    const eventSource = startSSE()
    return () => {
      eventSource?.close()
    }
  }, [user?.accessToken])

  const getNotificationLink = (notification: Notification) => {
    const { title, targetId, project } = notification

    switch (title) {
      case '프로젝트 초대 요청이 도착했어요!':
        return `/projects/${targetId}/overview`
      case '내 정보가 변경되었어요!':
        return `/projects/${targetId}/members`
      case '회의록이 추가되었어요!':
        return `/projects/${project.projectId}/meeting-notes/${targetId}`
      case '스프린트가 추가되었어요!':
        return `/projects/${targetId}/task`
      case 'Task의 담당자로 할당되었어요!':
      case 'Task에 새 댓글이 추가되었어요!':
        return `/projects/${project.projectId}/task?taskId=${targetId}`
      default:
        return null
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    const link = getNotificationLink(notification)
    if (link) {
      router.push(link)
      setIsOpen(false)
    }
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
      >
        <BellRingIcon className="w-5 h-5" />
        {totalNotifications > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {totalNotifications}
          </span>
        )}
      </Button>

      <div
        className={`absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-lg border bg-white shadow-lg transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold">알림</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="max-h-[calc(24rem-4rem)] overflow-y-auto pr-2">
            <ul className="divide-y divide-gray-100">
              {notifications.length === 0 ? (
                <li className="text-xs text-gray-500 text-center py-4">
                  {isLoading
                    ? '알림을 불러오는 중...'
                    : '새로운 알림이 없습니다.'}
                </li>
              ) : (
                notifications.map((notification, index) => {
                  const link = getNotificationLink(notification)
                  const NotificationContent = () => (
                    <div className="relative py-3">
                      {!notification.isRead && (
                        <div className="absolute right-2 top-4 w-2 h-2 bg-cm rounded-full" />
                      )}
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">
                          {notification.title}
                        </span>
                        <span className="mt-1 text-xs text-gray-600 break-keep">
                          {notification.description}
                        </span>
                      </div>
                    </div>
                  )

                  return (
                    <li
                      key={notification.notificationId}
                      ref={
                        index === notifications.length - 1
                          ? lastNotificationRef
                          : null
                      }
                      className={`transition ${
                        notification.isRead
                          ? 'text-gray-500 hover:bg-gray-50'
                          : 'text-black hover:bg-gray-50'
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      {link ? (
                        <Link href={link} className="block">
                          <NotificationContent />
                        </Link>
                      ) : (
                        <NotificationContent />
                      )}
                    </li>
                  )
                })
              )}
              {isLoading && (
                <li className="text-xs text-gray-500 text-center py-2">
                  알림을 불러오는 중...
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 