import authOptions from '@/app/utils/authOptions'
import { Member } from '@/types/project'
import { Liveblocks } from '@liveblocks/node'
import { getServerSession } from 'next-auth'

function generateColorFromName(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }

  const h = hash % 360
  return `hsl(${h}, 70%, 60%)`
}

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
})

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return new Response('Unauthorized', { status: 401 })
  }

  const userEmail = session.user.email

  const url = new URL(request.url)
  const projectId = url.searchParams.get('projectId')
  const roomId = url.searchParams.get('roomId')

  if (!projectId || !roomId) {
    return new Response('Missing projectId or roomId', { status: 400 })
  }

  const projectResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/project/${projectId}`,
    {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${session.accessToken}`,
      },
    }
  )

  if (!projectResponse.ok) {
    return new Response('Failed to fetch project members', { status: 500 })
  }

  const project = await projectResponse.json()

  const liveblocksSession = liveblocks.prepareSession(userEmail, {
    userInfo: {
      name: session.user.name ?? '',
      color: generateColorFromName(session.user.name ?? ''),
      avatar: session.user.image ?? '',
    },
  })

  const isProjectMember = project.members.some(
    (member: Member) => member.email === userEmail
  )

  if (!isProjectMember) {
    return new Response('Not a project member', { status: 403 })
  }

  liveblocksSession.allow(roomId, liveblocksSession.FULL_ACCESS)

  const { status, body } = await liveblocksSession.authorize()
  return new Response(body, { status })
}
