'use client'

import { Avatar, AvatarFallback } from '@cm/ui/components/ui/avatar'
import { Badge } from '@cm/ui/components/ui/badge'
import { Button } from '@cm/ui/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@cm/ui/components/ui/card'

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
              <Badge>checkmate</Badge>
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
