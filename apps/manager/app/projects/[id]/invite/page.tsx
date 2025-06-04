'use client'

import {
  approveProjectInvite,
  denyProjectInvite,
  getProject,
} from '@/lib/api/project'
import { useAuth } from '@/providers/AuthProvider'
import { Project } from '@cm/types/project'
import { BaseNavbar } from '@cm/ui/components/common/BaseNavbar'
import { Button } from '@cm/ui/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@cm/ui/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@cm/ui/components/ui/dialog'
import { Calendar, Info } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function InvitePage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [project, setProject] = useState<Project | null>(null)
  const [showDenyDialog, setShowDenyDialog] = useState(false)

  useEffect(() => {
    const fetchProjectInfo = async () => {
      if (!user?.accessToken) return

      try {
        const data = await getProject(projectId, user.accessToken)
        setProject(data)
      } catch (error) {
        console.error(error)
        toast.error('프로젝트 정보를 불러오는데 실패했습니다')
        router.push('/projects')
      } finally {
        setLoading(false)
      }
    }

    fetchProjectInfo()
  }, [projectId, user?.accessToken, router])

  const handleApprove = async () => {
    if (!user?.accessToken || submitting) return

    setSubmitting(true)
    try {
      await approveProjectInvite(projectId, user.accessToken)
      toast.success('프로젝트 초대를 수락했습니다')
      router.push(`/projects/${projectId}/overview`)
    } catch (error) {
      console.error(error)
      toast.error('프로젝트 초대 수락에 실패했습니다')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDenyClick = () => {
    setShowDenyDialog(true)
  }

  const handleDenyConfirm = async () => {
    if (!user?.accessToken || submitting) return

    setSubmitting(true)
    try {
      await denyProjectInvite(projectId, user.accessToken)
      toast.success('프로젝트 초대를 거절했습니다')
      router.push('/projects')
    } catch (error) {
      console.error(error)
      toast.error('프로젝트 초대 거절에 실패했습니다')
    } finally {
      setSubmitting(false)
      setShowDenyDialog(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="w-full h-full">
        <BaseNavbar
          user={user}
          onSignOut={signOut}
          showSidebarTrigger={false}
          showFilters={false}
        />
        <div className="flex justify-center items-center p-4 bg-muted h-full">
          <Card className="max-w-md w-full">
            <CardContent className="py-8">
              <div className="text-center text-gray-500">
                초대장을 불러오는 중...
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!project) {
    return null
  }

  return (
    <div className="w-full h-full">
      <BaseNavbar
        user={user}
        onSignOut={signOut}
        showSidebarTrigger={false}
        showFilters={false}
      />
      <div className="flex justify-center items-center p-4 bg-muted h-full">
        <Card className="max-w-md w-full overflow-hidden">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-primary">
              {project.title}
            </CardTitle>
            <p className="text-cm-500 mt-2">
              프로젝트 정보를 검토하신 후 참여 여부를 결정해주세요
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-cm-light/40 rounded-lg">
                <Info className="w-5 h-5 text-cm-600 flex-shrink-0" />
                <div className="text-sm text-primary">
                  <span className="font-medium break-keep">
                    {project.description}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-cm-light/40 rounded-lg">
                <Calendar className="w-5 h-5 text-cm-600 flex-shrink-0" />
                <div className="text-sm text-primary">
                  <span className="font-medium">프로젝트 기간</span>
                  <br />
                  {formatDate(project.startDate)} ~{' '}
                  {formatDate(project.endDate)}
                </div>
              </div>

              {/* <div className="flex items-center gap-3 p-3 bg-cm-light/40 rounded-lg">
                <Users className="w-5 h-5 text-cm-600 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-sm text-primary mb-2">
                    <span className="font-medium">
                      현재 {activeMembers.length}명의 팀원이 함께하고 있습니다
                    </span>
                  </div>
                  <AvatarGroup
                    users={activeMembers.map((member) => ({
                      name: member.name,
                      src: member.profileImageUrl || '',
                    }))}
                  />
                </div>
              </div> */}
            </div>

            <div className="flex items-center justify-between gap-2 w-full pt-4">
              <Button
                variant="cm"
                className="flex-1"
                onClick={handleApprove}
                disabled={submitting}
              >
                {submitting ? '처리 중...' : '프로젝트 참여하기'}
              </Button>
              <Button
                variant="cmoutline"
                className="flex-1"
                onClick={handleDenyClick}
                disabled={submitting}
              >
                {submitting ? '처리 중...' : '초대 거절하기'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showDenyDialog} onOpenChange={setShowDenyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>프로젝트 초대 거절</DialogTitle>
            <DialogDescription>
              프로젝트 초대를 거절하시면 나중에 다시 참여하실 수 없습니다.
              정말로 거절하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowDenyDialog(false)}
              disabled={submitting}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleDenyConfirm}
              disabled={submitting}
            >
              {submitting ? '처리 중...' : '거절하기'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
