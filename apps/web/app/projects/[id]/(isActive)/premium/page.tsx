'use client'

import {
  PaymentStatus as ApiPaymentStatus,
  completePayment,
  upgradeProject,
} from '@cm/api/payment'
import { Button } from '@cm/ui/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
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
import PortOne, { PaymentRequest } from '@portone/browser-sdk/v2'
import {
  BarChart3,
  CheckCircle2,
  Loader2,
  Rocket,
  Shield,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface PremiumProject {
  id: string
  name: string
  price: number
  description: string
  features: string[]
}

type PaymentStatus = {
  status: ApiPaymentStatus
  message: string
}

export default function PremiumProjectPage() {
  const { data: session } = useSession()
  const [project, setProject] = useState<PremiumProject | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({
    status: 'IDLE',
    message: '',
  })
  const params = useParams()
  const projectId = params.id as string

  useEffect(() => {
    // TODO: API 연동 후 실제 데이터로 교체
    setProject({
      id: 'premium-project',
      name: '프리미엄 프로젝트',
      price: 19900,
      description:
        '프리미엄 프로젝트로 업그레이드하여 더 많은 기능을 사용해보세요.',
      features: [
        '무제한 스프린트 재구성',
        '회의록 길이 무제한',
        '고급 분석 도구',
        '우선 지원',
        '팀 협업 기능',
        '월 19,900원 정기 결제',
        '언제든지 해지 가능',
      ],
    })
  }, [])

  function generatePaymentId() {
    return [...crypto.getRandomValues(new Uint32Array(2))]
      .map((word) => word.toString(16).padStart(8, '0'))
      .join('')
  }

  const handlePayment = async () => {
    if (!project) return
    if (!session?.accessToken) {
      setPaymentStatus({
        status: 'FAILED',
        message: '로그인이 필요합니다.',
      })
      return
    }

    setPaymentStatus({ status: 'PENDING', message: '' })
    const paymentId = generatePaymentId()

    try {
      const paymentRequest = {
        storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID!,
        channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY!,
        paymentId,
        orderName: project.id,
        totalAmount: project.price,
        currency: 'KRW',
        payMethod: 'EASY_PAY',
        customData: {
          projectId: project.id,
        },
      }

      const payment = await PortOne.requestPayment(paymentRequest as any)
      console.log('결제 응답:', {
        ...payment,
        paymentId: payment?.paymentId,
        code: payment?.code,
        message: payment?.message,
      })

      if (!payment) {
        throw new Error('결제 정보를 받아오지 못했습니다.')
      }

      if (payment.code !== undefined) {
        setPaymentStatus({
          status: 'FAILED',
          message: payment.message || '결제 처리 중 오류가 발생했습니다.',
        })
        return
      }

      try {
        console.log('결제 완료 요청:', {
          paymentId: payment.paymentId,
          accessToken: '***', // 민감 정보 마스킹
        })

        const paymentComplete = await completePayment(session.accessToken, {
          paymentId: payment.paymentId,
        })

        console.log('결제 완료 응답:', paymentComplete)

        if (paymentComplete.status === 'PAID') {
          try {
            console.log('프로젝트 업그레이드 요청:', {
              projectId,
              paymentId: payment.paymentId,
            })

            await upgradeProject(session.accessToken, projectId, {
              paymentId: payment.paymentId,
            })

            console.log('프로젝트 업그레이드 완료')
          } catch (error) {
            console.error('프로젝트 업그레이드 중 오류:', error)
            setPaymentStatus({
              status: 'FAILED',
              message:
                error instanceof Error
                  ? error.message
                  : '프로젝트 업그레이드 중 오류가 발생했습니다.',
            })
            return
          }
        }

        setPaymentStatus({
          status: paymentComplete.status,
          message: '',
        })
      } catch (error) {
        console.error('결제 완료 처리 중 오류:', error)
        setPaymentStatus({
          status: 'FAILED',
          message:
            error instanceof Error
              ? error.message
              : '결제 완료 처리 중 오류가 발생했습니다.',
        })
      }
    } catch (error) {
      console.error('결제 처리 중 오류:', error)
      setPaymentStatus({
        status: 'FAILED',
        message:
          error instanceof Error
            ? error.message
            : '결제 처리 중 오류가 발생했습니다.',
      })
    }
  }

  const handleClose = () => {
    setPaymentStatus({ status: 'IDLE', message: '' })
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#1a237e] via-[#283593] to-[#303f9f] bg-clip-text text-transparent mb-4">
            프로젝트를 프리미엄으로 업그레이드
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            프리미엄 기능으로 프로젝트의 생산성과 협업을 한 단계 더 높여보세요
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="relative overflow-hidden">
              <div className="relative">
                <CardTitle className="text-3xl font-bold mb-2">
                  프리미엄 프로젝트
                </CardTitle>
                <CardDescription className="text-lg">
                  더 강력한 기능과 더 나은 경험을 제공합니다
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-blue-500" />
                      주요 기능
                    </h3>
                    <ul className="space-y-3">
                      {project.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="p-4 rounded-lg bg-gradient-to-br from-[#1a237e]/10 to-[#303f9f]/10">
                      <Zap className="w-6 h-6 text-[#283593] mb-2" />
                      <h4 className="font-semibold mb-1">빠른 성장</h4>
                      <p className="text-sm text-gray-600">생산성 향상</p>
                    </div>
                    <div className="p-4 rounded-lg bg-gradient-to-br from-[#1a237e]/10 to-[#303f9f]/10">
                      <Shield className="w-6 h-6 text-[#283593] mb-2" />
                      <h4 className="font-semibold mb-1">안정적인 운영</h4>
                      <p className="text-sm text-gray-600">신뢰성 보장</p>
                    </div>
                    <div className="p-4 rounded-lg bg-gradient-to-br from-[#1a237e]/10 to-[#303f9f]/10">
                      <Users className="w-6 h-6 text-[#283593] mb-2" />
                      <h4 className="font-semibold mb-1">팀 협업</h4>
                      <p className="text-sm text-gray-600">효율적인 소통</p>
                    </div>
                    <div className="p-4 rounded-lg bg-gradient-to-br from-[#1a237e]/10 to-[#303f9f]/10">
                      <BarChart3 className="w-6 h-6 text-[#283593] mb-2" />
                      <h4 className="font-semibold mb-1">고급 분석</h4>
                      <p className="text-sm text-gray-600">
                        데이터 기반 의사결정
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#1a237e]/5 via-[#283593]/5 to-[#303f9f]/5 rounded-xl p-6">
                  <div className="text-center mb-6">
                    <div className="inline-block bg-gradient-to-r from-[#1a237e] via-[#283593] to-[#303f9f] p-0.5 rounded-full mb-4">
                      <div className="bg-white rounded-full p-3">
                        <Rocket className="w-8 h-8 text-[#283593]" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">프리미엄 가격</h3>
                    <div className="space-y-2">
                      <div className="text-4xl font-bold text-[#283593]">
                        {project.price.toLocaleString()}원
                      </div>
                      <p className="text-gray-600">월 정기 결제</p>
                      <p className="text-sm text-gray-500">
                        언제든지 해지 가능
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Button
                      className="w-full h-12 bg-gradient-to-r from-[#1a237e] via-[#283593] to-[#303f9f] text-white hover:shadow-lg hover:shadow-[#283593]/20 transition-all duration-300"
                      size="lg"
                      onClick={handlePayment}
                      disabled={paymentStatus.status === 'PENDING'}
                    >
                      {paymentStatus.status === 'PENDING' ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          결제 처리 중...
                        </>
                      ) : (
                        <>
                          <Rocket className="mr-2 h-4 w-4" />
                          지금 시작하기
                        </>
                      )}
                    </Button>
                    <p className="text-center text-sm text-gray-500">
                      안전한 결제 시스템으로 보호됩니다
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={paymentStatus.status === 'FAILED'}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">결제 실패</DialogTitle>
            <DialogDescription>{paymentStatus.message}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleClose}>확인</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={paymentStatus.status === 'PAID'}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                <Rocket className="w-8 h-8 text-[#283593]" />
              </div>
            </div>
            <DialogTitle className="text-center text-[#283593]">
              구독 시작
            </DialogTitle>
            <DialogDescription className="text-center">
              프리미엄 프로젝트 구독이 시작되었습니다.
              <br />
              이제 더 많은 기능을 사용하실 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleClose} className="w-full">
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
