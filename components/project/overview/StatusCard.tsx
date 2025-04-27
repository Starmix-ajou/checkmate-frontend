'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function StatusCard() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Sprint 현황</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-around">
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-500">3</p>
          <p className="text-sm">Total Projects</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-500">2</p>
          <p className="text-sm">On-Track</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-500">1</p>
          <p className="text-sm">At Risk</p>
        </div>
      </CardContent>
    </Card>
  )
}
