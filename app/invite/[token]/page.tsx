'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function InvitePage() {
  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-muted">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>프로젝트 초대</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback>한</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm">
                <strong>한도연</strong> 님이 초대했어요.
              </p>
              <Badge>CheckMate</Badge>
            </div>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1" onClick={() => alert('초대 수락')}>
              수락
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => alert('초대 거절')}
            >
              거절
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
