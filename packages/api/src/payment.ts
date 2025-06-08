import { API_BASE_URL } from './constants'

export type PaymentType = 'PLAN1' | 'PLAN2' | 'PLAN3'

export type PaymentStatus = 'IDLE' | 'PENDING' | 'PAID' | 'FAILED'

export interface PaymentCompleteRequest {
  paymentId: string
}

export interface PaymentCompleteResponse {
  paymentId: string
  status: PaymentStatus
  type: PaymentType
}

export async function completePayment(
  accessToken: string,
  request: PaymentCompleteRequest
): Promise<PaymentCompleteResponse> {
  if (!accessToken) {
    throw new Error('인증 토큰이 없습니다.')
  }

  const response = await fetch(`${API_BASE_URL}/payment/complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error('결제 완료 처리에 실패했습니다.')
  }

  return response.json()
}

export interface UpgradeProjectRequest {
  paymentId: string
}

export async function upgradeProject(
  accessToken: string,
  projectId: string,
  request: UpgradeProjectRequest
): Promise<void> {
  if (!accessToken) {
    throw new Error('인증 토큰이 없습니다.')
  }

  const response = await fetch(`${API_BASE_URL}/project/${projectId}/upgrade`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error('프로젝트 업그레이드에 실패했습니다.')
  }
}

export interface PaymentHistory {
  paymentId: string
  status: PaymentStatus
  orderName: string
  totalAmount: string
  currency: string
  payMethod: string
  timestamp: string
}

export async function getPaymentHistory(
  accessToken: string,
  projectId: string
): Promise<PaymentHistory[]> {
  if (!accessToken) {
    throw new Error('인증 토큰이 없습니다.')
  }

  const response = await fetch(`${API_BASE_URL}/project/${projectId}/payment`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error('결제 내역 조회에 실패했습니다.')
  }

  return response.json()
}
