'use client'

import GoogleSignInButton from '@/components/GoogleSignInButton'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-sm p-8">
        <div className="flex gap-8 flex-col text-center mb-6">
          <div className="text-2xl font-bold">
            팀이 성장하는 순간,<br></br>checkmate가 함께합니다.
          </div>
          <GoogleSignInButton />
        </div>
      </div>
    </div>
  )
}
