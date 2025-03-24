'use client'

import GoogleSignInButton from '@/components/GoogleSignInButton'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-sm p-8 shadow-lg rounded-lg">
        <CardHeader className="text-center mb-6">
          <CardTitle className="text-2xl font-bold text-gray-700">
            CheckMate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <GoogleSignInButton />
        </CardContent>
      </Card>
    </div>
  )
}
