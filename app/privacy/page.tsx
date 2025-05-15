'use client'

import { Card, CardContent } from '@/components/ui/card'

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">개인정보처리방침</h1>
      <Card>
        <CardContent className="space-y-4 text-sm leading-relaxed">
          <p>
            Starmix 팀은 사용자 개인정보를 중요시하며, 아래와 같이 처리방침을
            명시합니다.
          </p>
          <h2 className="text-xl font-semibold mt-6">
            1. 수집하는 개인정보 항목
          </h2>
          <ul className="list-disc list-inside space-y-1">
            <li>
              Google 계정 인증을 통해 사용자 이름, 이메일, 프로필 이미지를
              수집합니다.
            </li>
          </ul>
          <h2 className="text-xl font-semibold mt-6">2. 개인정보 수집 목적</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>프로젝트 협업 기능 제공(예: 팀원 초대, 회의록 작성 등)</li>
            <li>사용자별 맞춤형 대시보드 제공</li>
          </ul>
          <h2 className="text-xl font-semibold mt-6">
            3. 개인정보의 보관 및 파기
          </h2>
          <p>
            서비스 탈퇴 시 모든 개인정보는 즉시 파기됩니다. 단, 법적 의무가 있는
            경우 관련 법령에 따라 보관됩니다.
          </p>
          <h2 className="text-xl font-semibold mt-6">4. 제3자 제공</h2>
          <p>
            수집한 개인정보는 제3자에게 제공되지 않으며, Google 인증 외 외부
            서비스와 공유되지 않습니다.
          </p>
          <h2 className="text-xl font-semibold mt-6">
            5. 개인정보 보호를 위한 노력
          </h2>
          <p>
            checkmate는 사용자 데이터를 안전하게 보호하기 위해 업계 표준의
            보안조치를 적용하고 있습니다.
          </p>
          <p className="mt-6 text-xs text-gray-500">
            최종 업데이트: 2025년 5월 11일
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
