'use client'

import { GlobalNotificationPanel } from '@/components/project/GlobalNotificationPanel'
import { UseNotificationSSE } from '@/hooks/useNotificationSSE'
import { Notification, getGlobalNotifications, getNotificationCount } from '@cm/api/notifications'
import {
  BaseNavbar,
  BaseNavbarProps,
} from '@cm/ui/components/common/BaseNavbar'
import { Button } from '@cm/ui/components/ui/button'
import { Bell, BellRingIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export type NavbarProps = BaseNavbarProps

export function Navbar(props: NavbarProps) {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [totalNotifications, setTotalNotifications] = useState(0)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const observer = useRef<IntersectionObserver | null>(null)
  const PAGE_SIZE = 10

  const { startSSE } = UseNotificationSSE({
    onNewNotification: (newNotification: Notification) => {
      toast(newNotification.title, {
        description: newNotification.description,
        icon: <Bell className="size-4" />,
        duration: 5000,
        action: (
          <Button
            variant="cm"
            onClick={() => {
              const link = getNotificationLink(newNotification)
              if (link) {
                router.push(link)
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
    onError: (error: Error | MessageEvent) => {
      console.error('SSE 알림 오류:', error)
      toast.error('알림을 받는 중 오류가 발생했습니다.')
    },
    onOpen: async () => {
      console.log('SSE 연결 성공')
    },
  })

  const loadNotificationCount = useCallback(async () => {
    if (!props.user?.accessToken) return

    try {
      const response = await getNotificationCount(props.user.accessToken)
      setTotalNotifications(response.count)
    } catch (error) {
      console.error('알림 개수 로드 실패:', error)
      toast.error('알림 개수를 불러오는데 실패했습니다.')
    }
  }, [props.user?.accessToken])

  const loadInitialNotifications = useCallback(async () => {
    if (!props.user?.accessToken) return

    try {
      setIsLoading(true)
      const response = await getGlobalNotifications(
        props.user.accessToken,
        0,
        PAGE_SIZE
      )
      setNotifications(response.content)
      setHasMore(!response.last)
      setPage(0)
    } catch (error) {
      console.error('알림 로드 실패:', error)
      toast.error('알림을 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [props.user?.accessToken])

  const loadMoreNotifications = useCallback(async () => {
    if (!props.user?.accessToken || isLoading || !hasMore) return

    try {
      setIsLoading(true)
      const nextPage = page + 1
      const response = await getGlobalNotifications(
        props.user.accessToken,
        nextPage,
        PAGE_SIZE
      )

      setNotifications((prev) => [...prev, ...response.content])
      setHasMore(!response.last)
      setPage(nextPage)
    } catch (error) {
      console.error('추가 알림 로드 실패:', error)
      toast.error('추가 알림을 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [props.user?.accessToken, page, isLoading, hasMore])

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

  useEffect(() => {
    if (props.user?.accessToken) {
      loadNotificationCount()
    }
  }, [props.user?.accessToken, loadNotificationCount])

  useEffect(() => {
    const eventSource = startSSE()
    return () => {
      eventSource?.close()
    }
  }, [props.user?.accessToken])

  useEffect(() => {
    if (isNotificationOpen) {
      loadInitialNotifications()
    }
  }, [isNotificationOpen, loadInitialNotifications])

  return (
    <BaseNavbar {...props}>
      {props.user && (
        <div className="relative">
          <div className="flex items-center gap-2">
            <GlobalNotificationPanel
              notifications={notifications}
              isLoading={isLoading}
              hasMore={hasMore}
              lastNotificationRef={lastNotificationRef}
              onNotificationDelete={(notificationId) => {
                setNotifications((prev) =>
                  prev.filter((n) => n.notificationId !== notificationId)
                )
                setTotalNotifications((prev) => Math.max(0, prev - 1))
              }}
              isOpen={isNotificationOpen}
              onOpenChange={setIsNotificationOpen}
              totalNotifications={totalNotifications}
            />
          </div>
        </div>
      )}
    </BaseNavbar>
  )
}
