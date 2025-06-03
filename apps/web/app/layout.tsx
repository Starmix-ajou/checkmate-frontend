import ToastProvider from '@cm/ui/components/common/ToastProvider'
import '@cm/ui/globals.css'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from 'sonner'

import { Providers } from './providers'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'checkmate',
  description: '팀이 성장하는 순간, checkmate가 함께합니다',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Providers>
      <html lang="ko">
        <head>
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
          />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased h-svh`}
        >
          <Toaster />
          <ToastProvider />
          {children}
        </body>
      </html>
    </Providers>
  )
}
