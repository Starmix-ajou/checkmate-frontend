'use client'

import GoogleSignInButton from '@cm/ui/components/login/GoogleSignInButton'
import TermsLinks from '@cm/ui/components/login/TermsLinks'
import { useGoogleSignIn } from '@/hooks/useGoogleSignIn'

const LoginText = () => (
  <div className="text-2xl font-bold">
    팀이 성장하는 순간,
    <br />
    checkmate가 함께합니다.
  </div>
)

const LoginPage = () => {
  const { handleGoogleSignIn } = useGoogleSignIn()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white">
      <div className="w-full max-w-sm p-8">
        <div className="flex flex-col gap-6 text-center">
          <LoginText />
          <GoogleSignInButton onClick={handleGoogleSignIn} />
        </div>
      </div>
      <div className="absolute bottom-8">
        <TermsLinks />
      </div>
    </div>
  )
}

export default LoginPage
