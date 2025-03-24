'use client'

import { Button } from '@/components/ui/button'

export default function GoogleSignInButton() {
  return (
    <Button
      variant="outline"
      size="lg"
      className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
    >
      Sign in with Google
    </Button>
  )
}
