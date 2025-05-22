import Link from 'next/link'

export default function TermsLinks() {
  return (
    <div className="text-center text-[11px] text-gray-400">
      <span>로그인 시 </span>
      <Link href="/terms" className="text-cm hover:underline">
        이용약관
      </Link>
      <span> 및 </span>
      <Link href="/privacy" className="text-cm hover:underline">
        개인정보처리방침
      </Link>
      <span>에 동의하게 됩니다.</span>
    </div>
  )
}
