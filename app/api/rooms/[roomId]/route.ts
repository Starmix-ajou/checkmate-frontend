import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const pathname = url.pathname
  const segments = pathname.split('/')
  const roomId = segments[segments.length - 1]

  if (!roomId) {
    return NextResponse.json({ error: 'roomId가 필요합니다.' }, { status: 400 })
  }

  const secretKey = process.env.LIVEBLOCKS_SECRET_KEY
  const apiUrl = process.env.LIVEBLOCKS_API_URL

  if (!secretKey || !apiUrl) {
    return NextResponse.json(
      { error: '서버 설정이 올바르지 않습니다.' },
      { status: 500 }
    )
  }

  try {
    const response = await fetch(`${apiUrl}/rooms/${roomId}`, {
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: `회의실 정보 조회 실패: ${response.status} - ${errorText}` },
        { status: response.status }
      )
    }

    const room = await response.json()
    return NextResponse.json(room)
  } catch (error) {
    console.error('회의실 정보 조회 에러:', error)
    return NextResponse.json(
      { error: '서버 에러가 발생했습니다.' },
      { status: 500 }
    )
  }
}
