'use client'

import { Card, CardContent } from '@cm/ui/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">이용약관</h1>
        <Link href="/projects">
          <Image
            src="/logo.svg"
            alt="checkmate"
            width={128}
            height={30}
            priority
          />
        </Link>
      </div>
      <Card>
        <CardContent className="space-y-4 text-sm leading-relaxed">
          <p>
            본 약관은 Starmix 팀이 제공하는 프로젝트 협업 도구 checkmate(이하
            &quot;서비스&quot;)의 이용과 관련하여, 서비스와 이용자 간의 권리,
            의무 및 책임사항을 규정합니다.
          </p>

          <h2 className="text-xl font-semibold mt-6">1. 서비스 개요</h2>
          <p>
            checkmate는 소규모 주니어 개발팀이 효율적으로 프로젝트를 관리,
            협업할 수 있도록 지원하는 협업 도구입니다.
          </p>

          <h2 className="text-xl font-semibold mt-6">2. 회원 가입 및 계정</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>사용자는 Google 로그인을 통해 서비스를 이용할 수 있습니다.</li>
            <li>
              사용자는 본인의 정보를 정확히 제공해야 하며, 타인의 계정을
              도용해서는 안 됩니다.
            </li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">3. 서비스 이용</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>
              사용자는 서비스 내에서 Sprint, Task, 회의록, 액션 아이템 등의
              기능을 활용할 수 있습니다.
            </li>
            <li>
              서비스는 주로 개발 협업 환경에 최적화되어 있으며, 상업적 사용은
              제한될 수 있습니다.
            </li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">4. 책임의 제한</h2>
          <p>
            서비스는 안정적인 제공을 위해 최선을 다하지만, 예기치 않은 오류나
            데이터 손실 등에 대해서는 법적 책임을 지지 않습니다.
          </p>

          <h2 className="text-xl font-semibold mt-6">5. 약관 변경</h2>
          <p>
            본 약관은 사전 공지 후 수정될 수 있으며, 변경된 약관은 공지 시점부터
            효력을 가집니다.
          </p>

          <p className="mt-6 text-xs text-gray-500">
            최종 업데이트: 2025년 5월 11일
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
