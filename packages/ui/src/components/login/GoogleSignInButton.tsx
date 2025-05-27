'use client'

import GoogleIcon from '@cm/ui/components/icons/GoogleIcon'
import { Button } from '@cm/ui/components/ui/button'

interface GoogleSignInButtonProps {
  onClick: () => void
}

export default function GoogleSignInButton({ onClick }: GoogleSignInButtonProps) {
  return (
    <Button variant="outline" size="lg" onClick={onClick}>
      <GoogleIcon className="w-5 h-5" />
      Sign in with Google
    </Button>
  )
}
