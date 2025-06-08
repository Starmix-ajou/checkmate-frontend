'use client'

import { getPaymentHistory } from '@cm/api/payment'
import type { PaymentHistory } from '@cm/api/payment'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@cm/ui/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@cm/ui/components/ui/card'
import { Loader2, Receipt, Calendar, Clock, Sparkles } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'
import { ProjectBrief } from '@cm/types/project'
import { getProjectBrief } from '@cm/api/project'
import LoadingScreen from '@cm/ui/components/common/LoadingScreen'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@cm/ui/components/ui/breadcrumb'
import { Skeleton } from '@cm/ui/components/ui/skeleton'

export default function BillingPage() {
  const { data: session } = useSession()
  const params = useParams()
  const projectId = params.id as string
  const user = useAuthStore((state) => state.user)
  const [payments, setPayments] = useState<PaymentHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [projectBrief, setProjectBrief] = useState<ProjectBrief | null>(null)
  const [loadingBrief, setLoadingBrief] = useState(true)

  useEffect(() => {
    if (!user?.accessToken || !projectId) return

    const fetchProjectBrief = async () => {
      try {
        const briefData = await getProjectBrief(projectId, user.accessToken)
        setProjectBrief(briefData)
      } catch (error) {
        console.error(error)
      } finally {
        setLoadingBrief(false)
      }
    }

    fetchProjectBrief()
  }, [projectId, user?.accessToken])

  useEffect(() => {
    async function fetchPaymentHistory() {
      if (!session?.accessToken) return

      try {
        const history = await getPaymentHistory(session.accessToken, projectId)
        setPayments(history)
      } catch (err) {
        setError(err instanceof Error ? err.message : '결제 내역을 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPaymentHistory()
  }, [session?.accessToken, projectId])

  const getSubscriptionInfo = (payments: PaymentHistory[]) => {
    if (payments.length === 0) return null

    const paidPayments = payments.filter(p => p.status === 'PAID')
    if (paidPayments.length === 0) return null

    const oldestPayment = paidPayments.reduce((oldest, current) => {
      return new Date(current.timestamp) < new Date(oldest.timestamp) ? current : oldest
    })

    const startDate = new Date(oldestPayment.timestamp)
    const months = Math.floor((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30))

    return {
      startDate,
      months,
      totalPayments: paidPayments.length,
      totalAmount: paidPayments.reduce((sum, p) => sum + Number(p.totalAmount), 0)
    }
  }

  const subscriptionInfo = getSubscriptionInfo(payments)

  if (isLoading || loadingBrief) {
    return <LoadingScreen loading={true} />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <>
      <LoadingScreen loading={isLoading || loadingBrief} />
      <div className="flex w-full">
        <div className="flex-1 p-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/projects">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {loadingBrief ? (
                  <Skeleton className="h-4 w-[100px]" />
                ) : (
                  <BreadcrumbLink href={`/projects/${projectId}/overview`}>
                    {projectBrief?.title}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Billing</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex justify-between items-center mt-2 mb-4">
            {loadingBrief ? (
              <>
                <Skeleton className="h-8 w-[200px]" />
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold">{projectBrief?.title}</h1>
              </>
            )}
          </div>

          {subscriptionInfo && (
            <Card className="mb-6 bg-gradient-to-r from-[#1a237e]/5 via-[#283593]/5 to-[#303f9f]/5 border-none">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#283593]" />
                  <CardTitle>프리미엄 구독 정보</CardTitle>
                </div>
                <CardDescription>
                  현재 프로젝트의 프리미엄 구독 상태입니다
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#283593]/10">
                      <Calendar className="w-5 h-5 text-[#283593]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">구독 시작일</p>
                      <p className="font-medium">
                        {subscriptionInfo.startDate.toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#283593]/10">
                      <Clock className="w-5 h-5 text-[#283593]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">구독 기간</p>
                      <p className="font-medium">{subscriptionInfo.months}개월</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#283593]/10">
                      <Receipt className="w-5 h-5 text-[#283593]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">총 결제 금액</p>
                      <p className="font-medium">
                        {subscriptionInfo.totalAmount.toLocaleString('ko-KR')}원
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#283593]" />
                <CardTitle>결제 내역</CardTitle>
              </div>
              <CardDescription>
                프로젝트의 모든 결제 내역을 확인할 수 있습니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>결제 일시</TableHead>
                    <TableHead>주문명</TableHead>
                    <TableHead>결제 금액</TableHead>
                    <TableHead>결제 수단</TableHead>
                    <TableHead>상태</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-500">
                        결제 내역이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    payments.map((payment) => (
                      <TableRow key={payment.paymentId}>
                        <TableCell>
                          {new Date(payment.timestamp).toLocaleString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </TableCell>
                        <TableCell>{payment.orderName}</TableCell>
                        <TableCell>
                          {Number(payment.totalAmount).toLocaleString('ko-KR')} {payment.currency}
                        </TableCell>
                        <TableCell>{payment.payMethod}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              payment.status === 'PAID'
                                ? 'bg-green-100 text-green-800'
                                : payment.status === 'FAILED'
                                ? 'bg-red-100 text-red-800'
                                : payment.status === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {payment.status === 'PAID'
                              ? '결제 완료'
                              : payment.status === 'FAILED'
                              ? '결제 실패'
                              : payment.status === 'PENDING'
                              ? '결제 중'
                              : '대기 중'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
} 