'use client'

import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'

export default function GoogleSignInButton() {
  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/projects' })
  }
  return (
    <Button
      variant="outline"
      size="lg"
      className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
      onClick={handleGoogleSignIn}
    >
      Sign in with Google
    </Button>
  )
}
