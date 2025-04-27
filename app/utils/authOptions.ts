import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid profile email',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                accessToken: account.access_token,
              }),
            }
          )

          if (!res.ok) {
            throw new Error('Failed to exchange accessToken with backend')
          }

          const data = await res.json()

          token.accessToken = data.accessToken
          token.email = data.email
          token.name = data.name
        } catch (error) {
          console.error('JWT Callback Error:', error)
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token?.accessToken) {
        session.accessToken = token.accessToken as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default authOptions
