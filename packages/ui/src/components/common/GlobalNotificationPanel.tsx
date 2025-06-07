import { Notification } from '@cm/api/notifications'
import { Button } from '@cm/ui/components/ui/button'
import { BellRingIcon, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/useAuthStore'
import { markNotificationAsRead, deleteNotification } from '@cm/api/notifications'
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

interface GlobalNotificationPanelProps {
  notifications: Notification[]
}

export function GlobalNotificationPanel({ notifications }: GlobalNotificationPanelProps) {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const [isOpen, setIsOpen] = useState(false)
  const [notificationToDelete, setNotificationToDelete] = useState<Notification | null>(null)

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
        await markNotificationAsRead(user.accessToken, notification.notificationId)
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
      toast.success('알림이 삭제되었습니다.')
    } catch (error) {
      console.error('알림 삭제 실패:', error)
      toast.error('알림 삭제에 실패했습니다.')
    } finally {
      setNotificationToDelete(null)
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
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {notifications.length}
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
            <span className="text-sm font-semibold">전체 알림</span>
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
                  새로운 알림이 없습니다.
                </li>
              ) : (
                notifications.map((notification) => (
                  <li
                    key={notification.notificationId}
                    className={`transition ${
                      notification.isRead
                        ? 'text-gray-500 hover:bg-gray-50'
                        : 'text-black hover:bg-gray-50'
                    }`}
                    onClick={() => handleClick(notification)}
                  >
                    <div className="relative py-3">
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
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>

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
    </div>
  )
} 