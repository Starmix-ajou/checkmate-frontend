'use client'

import GoogleIcon from '@/components/icons/GoogleIcon'
import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'

export default function GoogleSignInButton() {
  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/projects' })
  }
  return (
    <Button variant="outline" size="lg" onClick={handleGoogleSignIn}>
      <GoogleIcon className="w-5 h-5" />
      Sign in with Google
    </Button>
  )
}
