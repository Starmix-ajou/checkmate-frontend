import { SwiperDemo } from '@/components/SwiperDemo'
import { Button } from '@cm/ui/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-svh flex flex-col lg:flex-row bg-accent/40">
      <div className="flex-1 w-full lg:w-1/2 bg-accent flex items-center justify-center p-6 lg:p-12 order-first lg:order-last overflow-hidden">
        <SwiperDemo />
      </div>
      <div className="flex-1 w-full lg:w-1/2 flex flex-col items-center justify-center p-6 lg:p-12 order-last lg:order-first">
        <div className="max-w-md space-y-6 lg:space-y-8">
          <div className="flex justify-center">
            <Image
              src="/logo.svg"
              alt="Checkmate Logo"
              width={180}
              height={60}
              priority
            />
          </div>
          <h1 className="text-lg hidden lg:block lg:text-2xl font-bold text-center text-gray-900 pt-4 lg:pt-8">
            팀이 성장하는 순간,
            <br />
            checkmate가 함께합니다.
          </h1>
          <div className="flex flex-col gap-2 items-center w-full">
            <Link href="/login" className="w-full max-w-[280px]">
              <Button variant="cm" className="w-full p-5">
                시작하기
              </Button>
            </Link>
            <Link
              href="https://manager.checkmate.it.kr"
              className="w-full max-w-[280px]"
            >
              <Button variant="cmoutline" className="w-full p-5">
                Product Manager로 시작하기
              </Button>
            </Link>
          </div>
          <div className="text-center text-xs text-gray-500 space-y-1">
            <p>
              <Link href="/terms" className="text-cm hover:underline">
                이용약관
              </Link>
              &nbsp;&nbsp;|&nbsp;&nbsp;
              <Link href="/privacy" className="text-cm hover:underline">
                개인정보처리방침
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
