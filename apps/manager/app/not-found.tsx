'use client'

import { Button } from '@cm/ui/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-svh flex flex-col items-center justify-center bg-accent/40 p-4">
      <div className="max-w-md w-full flex flex-col items-center text-center">
        <div className="mb-6">
          <Image
            src="/placehorse.png"
            alt="404 페이지를 찾을 수 없음"
            width={224}
            height={224}
            className="object-contain"
          />
        </div>

        <div className="space-y-4 mb-8">
          <h1 className="text-2xl font-bold text-cm-700">
            페이지를 찾을 수 없습니다
          </h1>
          <p className="text-cm-300 text-sm">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
            <br />
            홈으로 돌아가서 다시 시도해보세요.
          </p>
        </div>

        <Link href="/" className="w-full max-w-[280px]">
          <Button variant="cm" className="w-full p-5">
            홈으로 돌아가기
          </Button>
        </Link>
      </div>
    </div>
  )
}
