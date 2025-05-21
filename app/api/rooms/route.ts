import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secretKey = process.env.LIVEBLOCKS_SECRET_KEY

  if (!secretKey) {
    return NextResponse.json(
      { error: '서버 설정이 올바르지 않습니다.' },
      { status: 500 }
    )
  }

  try {
    const { roomId } = await request.json()

    if (!roomId) {
      return NextResponse.json(
        { error: 'roomId가 필요합니다.' },
        { status: 400 }
      )
    }

    const response = await fetch('https://api.liveblocks.io/v2/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify({
        id: roomId,
        defaultAccesses: ['room:write'],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: `회의실 생성 실패: ${response.status} - ${errorText}` },
        { status: response.status }
      )
    }

    const room = await response.json()
    return NextResponse.json(room)
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}
