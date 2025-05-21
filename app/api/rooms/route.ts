import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secretKey = process.env.LIVEBLOCKS_SECRET_KEY

  if (!secretKey) {
    console.error('LIVEBLOCKS_SECRET_KEY가 설정되지 않았습니다.')
    return NextResponse.json(
      { error: '서버 설정이 올바르지 않습니다.' },
      { status: 500 }
    )
  }

  try {
    const { roomId } = await request.json()
    console.log('생성할 룸 ID:', roomId)

    if (!roomId) {
      return NextResponse.json({ error: 'roomId가 필요합니다.' }, { status: 400 })
    }

    console.log('Liveblocks API 호출 시작...')
    const response = await fetch('https://api.liveblocks.io/v2/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify({
        id: roomId,
        defaultAccesses: ["room:write"],
      }),
    })

    console.log('Liveblocks API 응답 상태:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: `회의실 생성 실패: ${response.status} - ${errorText}` },
        { status: response.status }
      )
    }

    const room = await response.json()
    console.log('룸 생성 성공:', room)
    return NextResponse.json(room)
  } catch (error) {
    console.error('회의실 생성 에러:', error)
    return NextResponse.json(
      { error: '서버 에러가 발생했습니다.' },
      { status: 500 }
    )
  }
}
