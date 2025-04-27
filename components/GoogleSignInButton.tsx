'use client'

import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import GoogleIcon from '@/components/icons/GoogleIcon'

export default function GoogleSignInButton() {
  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/projects' })
  }
  return (
    <Button
      variant="outline"
      size="lg"
      className="w-full flex items-center justify-center gap-2 bg-white text-black border border-gray-300 hover:bg-gray-100 focus:ring-2 focus:ring-gray-300"
      onClick={handleGoogleSignIn}
    >
      <GoogleIcon className="w-5 h-5" />
      Sign in with Google
    </Button>
  )
}
