import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicPaths = new Set(['/', '/login'])

export async function middleware(req: NextRequest) {
  const token = await getToken({ req })
  const isAuthenticated = !!token
  const { pathname } = req.nextUrl

  if (isAuthenticated && publicPaths.has(pathname)) {
    return NextResponse.redirect(new URL('/projects', req.url))
  }

  if (!isAuthenticated && !publicPaths.has(pathname)) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/login', '/projects/:path*'],
}
