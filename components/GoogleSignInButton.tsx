'use client'

import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export default function GoogleSignInButton() {
  const handleGoogleSignIn = () => {
    signIn('google')
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
