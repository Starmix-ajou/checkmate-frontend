import { useAuthStore } from '@/stores/useAuthStore'
import { Notification } from '@cm/api/notifications'
import {
  deleteNotification,
  markNotificationAsRead,
} from '@cm/api/notifications'
import { Button } from '@cm/ui/components/ui/button'
import { Skeleton } from '@cm/ui/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@cm/ui/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@cm/ui/components/ui/tooltip'
import { Bell, ListX, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

interface GlobalNotificationPanelProps {
  notifications: Notification[]
  isLoading?: boolean
  hasMore?: boolean
  lastNotificationRef?: (node: HTMLLIElement | null) => void
  onNotificationDelete?: (notificationId: string) => void
  isOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
  totalNotifications?: number
}

export function GlobalNotificationPanel({
  notifications,
  isLoading = false,
  hasMore = false,
  lastNotificationRef,
  onNotificationDelete,
  isOpen: controlledIsOpen,
  onOpenChange,
  totalNotifications = 0,
}: GlobalNotificationPanelProps) {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const [notificationToDelete, setNotificationToDelete] =
    useState<Notification | null>(null)
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false)

  const isOpen = controlledIsOpen ?? internalIsOpen
  const setIsOpen = (value: boolean) => {
    if (onOpenChange) {
      onOpenChange(value)
    } else {
      setInternalIsOpen(value)
    }
  }

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

  const handleClick = async (notification: Notification) => {
    if (!notification.isRead && user?.accessToken) {
      try {
        await markNotificationAsRead(
          user.accessToken,
          notification.notificationId
        )
      } catch (error) {
        console.error('알림 읽음 처리 실패:', error)
        toast.error('알림 읽음 처리에 실패했습니다.')
      }
    }
    const link = getNotificationLink(notification)
    if (link) {
      router.push(link)
      setIsOpen(false)
    }
  }

  const handleDeleteClick = (
    e: React.MouseEvent,
    notification: Notification
  ) => {
    e.stopPropagation()
    if (notification.isRead) {
      handleDelete(notification.notificationId)
    } else {
      setNotificationToDelete(notification)
    }
  }

  const handleDelete = async (notificationId: string) => {
    if (!user?.accessToken) return

    try {
      await deleteNotification(user.accessToken, notificationId)
      onNotificationDelete?.(notificationId)
      toast.success('알림이 삭제되었습니다.')
    } catch (error) {
      console.error('알림 삭제 실패:', error)
      toast.error('알림 삭제에 실패했습니다.')
    } finally {
      setNotificationToDelete(null)
    }
  }

  const handleDeleteAllRead = async () => {
    if (!user?.accessToken) return

    const readNotifications = notifications.filter((n) => n.isRead)
    if (readNotifications.length === 0) {
      toast.info('삭제할 읽은 알림이 없습니다.')
      return
    }

    try {
      await Promise.all(
        readNotifications.map((notification) =>
          deleteNotification(user.accessToken, notification.notificationId)
        )
      )

      readNotifications.forEach((notification) => {
        onNotificationDelete?.(notification.notificationId)
      })

      toast.success('읽은 알림이 모두 삭제되었습니다.')
    } catch (error) {
      console.error('읽은 알림 삭제 실패:', error)
      toast.error('읽은 알림 삭제에 실패했습니다.')
    } finally {
      setIsDeleteAllDialogOpen(false)
    }
  }

  const NotificationSkeleton = () => (
    <li className="px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="h-2 w-2 rounded-full" />
          <Skeleton className="h-5 w-5 rounded-md" />
        </div>
      </div>
    </li>
  )

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
        <Bell className="w-5 h-5" />
        {totalNotifications > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-[0.7rem] rounded-full w-4 h-4 flex items-center justify-center">
            {totalNotifications > 99 ? '99+' : totalNotifications}
          </span>
        )}
      </Button>

      <div
        className={`absolute right-0 top-full mt-1 w-80 overflow-hidden rounded-lg border bg-white shadow-lg transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div>
          <div className="flex justify-between items-center p-4 border-b">
            <span className="text-sm font-semibold">전체 알림</span>
            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setIsDeleteAllDialogOpen(true)}
                    >
                      <ListX className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>읽은 알림 삭제</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="max-h-[calc(24rem-4rem)] overflow-y-auto">
            <ul className="divide-y divide-gray-100">
              {notifications.length === 0 && !isLoading ? (
                <li className="text-xs text-cm text-center p-4">
                  새로운 알림이 없습니다.
                </li>
              ) : (
                <>
                  {notifications.map((notification, index) => (
                    <li
                      key={notification.notificationId}
                      ref={
                        index === notifications.length - 1
                          ? lastNotificationRef
                          : null
                      }
                      className={`transition cursor-pointer ${
                        notification.isRead
                          ? 'opacity-50 hover:bg-cm-light'
                          : 'hover:bg-cm-light'
                      }`}
                      onClick={() => handleClick(notification)}
                    >
                      <div className="relative px-4 py-3">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium break-keep">
                              {notification.title}
                            </p>
                            <p className="text-xs text-cm break-keep mt-1">
                              {notification.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {!notification.isRead && (
                              <span className="w-2 h-2 rounded-full bg-red-500" />
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5"
                              onClick={(e) => handleDeleteClick(e, notification)}
                            >
                              <X className="w-2 h-2 text-cm hover:text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                  {isLoading && (
                    <>
                      <NotificationSkeleton />
                      <NotificationSkeleton />
                      <NotificationSkeleton />
                    </>
                  )}
                </>
              )}
              {!hasMore && notifications.length > 0 && (
                <li className="p-2 text-center text-xs text-cm">
                  더 이상 알림이 없습니다
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <Dialog
        open={!!notificationToDelete}
        onOpenChange={() => setNotificationToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>알림 삭제</DialogTitle>
            <DialogDescription>
              읽지 않은 알림을 삭제하시겠습니까?
              <br />
              삭제된 알림은 복구할 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNotificationToDelete(null)}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                notificationToDelete &&
                handleDelete(notificationToDelete.notificationId)
              }
            >
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isDeleteAllDialogOpen}
        onOpenChange={setIsDeleteAllDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>읽은 알림 삭제</DialogTitle>
            <DialogDescription>
              읽은 알림을 모두 삭제하시겠습니까?
              <br />
              삭제된 알림은 복구할 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteAllDialogOpen(false)}
            >
              취소
            </Button>
            <Button variant="destructive" onClick={handleDeleteAllRead}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
