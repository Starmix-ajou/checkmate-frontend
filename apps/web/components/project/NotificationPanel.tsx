import { Notification, markNotificationAsRead, deleteNotification } from '@cm/api/notifications'
import { Button } from '@cm/ui/components/ui/button'
import { Skeleton } from '@cm/ui/components/ui/skeleton'
import { useAuthStore } from '@/stores/useAuthStore'
import { BellRingIcon, ListX, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
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
import { useState } from 'react'

interface NotificationPanelProps {
  notifications: Notification[]
  isLoading: boolean
  hasMore: boolean
  lastNotificationRef: (node: HTMLLIElement | null) => void
  onClose: () => void
  handleNotificationClick: (notification: Notification) => void
  onNotificationRead?: (notificationId: string) => void
  onNotificationDelete?: (notificationId: string) => void
}

export function NotificationPanel({
  notifications,
  isLoading,
  hasMore,
  lastNotificationRef,
  onClose,
  handleNotificationClick,
  onNotificationRead,
  onNotificationDelete,
}: NotificationPanelProps) {
  const user = useAuthStore((state) => state.user)
  const [notificationToDelete, setNotificationToDelete] = useState<Notification | null>(null)
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false)

  const handleClick = async (notification: Notification) => {
    if (!notification.isRead && user?.accessToken) {
      try {
        await markNotificationAsRead(user.accessToken, notification.notificationId)
        onNotificationRead?.(notification.notificationId)
      } catch (error) {
        console.error('알림 읽음 처리 실패:', error)
        toast.error('알림 읽음 처리에 실패했습니다.')
      }
    }
    handleNotificationClick(notification)
  }

  const handleDeleteClick = (e: React.MouseEvent, notification: Notification) => {
    e.stopPropagation()
    if (notification.isRead) {
      // 읽은 알림은 바로 삭제
      handleDelete(notification.notificationId)
    } else {
      // 읽지 않은 알림은 확인 다이얼로그 표시
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
      // 모든 읽은 알림을 병렬로 삭제
      await Promise.all(
        readNotifications.map((notification) =>
          deleteNotification(user.accessToken, notification.notificationId)
        )
      )
      
      // 삭제된 알림 ID 목록을 부모 컴포넌트에 전달
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

  return (
    <>
      <div className="w-full">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium">프로젝트 알림</span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className='h-6 w-6'
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
        <div className="max-h-[calc(24rem-2.5rem)] overflow-y-auto">
          {notifications.length === 0 && !isLoading ? (
            <div className="p-4 text-center text-sm text-gray-500">
              알림이 없습니다
            </div>
          ) : (
            <ul className="divide-y">
              {notifications.map((notification, index) => (
                <li
                  key={notification.notificationId}
                  ref={index === notifications.length - 1 ? lastNotificationRef : null}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleClick(notification)}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium break-keep">
                        {notification.title}
                      </p>
                      <p className="text-xs text-cm break-keep">
                        {notification.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {!notification.isRead && (
                        <span className="w-2 h-2 rounded-full bg-cm" />
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                        onClick={(e) => handleDeleteClick(e, notification)}
                      >
                        <X className="w-2 h-2 text-gray-400 hover:text-red-500" />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
              {isLoading && (
                <li className="p-2">
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                </li>
              )}
              {!hasMore && notifications.length > 0 && (
                <li className="p-2 text-center text-xs text-gray-500">
                  더 이상 알림이 없습니다
                </li>
              )}
            </ul>
          )}
        </div>
      </div>

      {/* 개별 알림 삭제 다이얼로그 */}
      <Dialog open={!!notificationToDelete} onOpenChange={() => setNotificationToDelete(null)}>
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
            <Button variant="outline" onClick={() => setNotificationToDelete(null)}>
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={() => notificationToDelete && handleDelete(notificationToDelete.notificationId)}
            >
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 읽은 알림 전체 삭제 다이얼로그 */}
      <Dialog open={isDeleteAllDialogOpen} onOpenChange={setIsDeleteAllDialogOpen}>
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
            <Button variant="outline" onClick={() => setIsDeleteAllDialogOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDeleteAllRead}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 