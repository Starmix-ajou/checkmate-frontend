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
        token.accessToken = account.access_token
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
