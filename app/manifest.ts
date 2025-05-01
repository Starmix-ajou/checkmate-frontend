import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CheckMate',
    short_name: 'CheckMate',
    description: '팀이 성장하는 순간, CheckMate가 함께합니다',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#795548',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
