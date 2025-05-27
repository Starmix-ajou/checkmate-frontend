import { signIn } from 'next-auth/react'

export const useGoogleSignIn = () => {
  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/projects' })
  }

  return {
    handleGoogleSignIn,
  }
} 