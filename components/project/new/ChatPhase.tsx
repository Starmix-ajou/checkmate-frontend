import { useState } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { phases } from '@/components/project/new/phases'
import { Phase } from '@/types/phase'

type Message = {
  sender: 'user' | 'ai'
  text: string
}

type ChatPhaseProps = {
  phase: Phase
  onNext: () => void
}

export default function ChatPhase({ phase, onNext }: ChatPhaseProps) {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: phase.question },
  ])
  const [input, setInput] = useState<string>('')

  const handleSendMessage = () => {
    if (!input.trim()) return

    const userMessage: Message = { sender: 'user', text: input }
    setMessages((prev) => [...prev, userMessage])
    setInput('')

    setTimeout(() => {
      const nextPhaseIndex = phases.findIndex((p) => p.id === phase.id) + 1
      const nextQuestion =
        phases[nextPhaseIndex]?.question || '마지막 질문입니다.'

      const aiMessage: Message = {
        sender: 'ai',
        text: nextQuestion,
      }
      setMessages((prev) => [...prev, aiMessage])
      setTimeout(onNext, 1000)
    }, 1000)
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 pb-20">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <Avatar className="w-8 h-8 mr-2">
                <AvatarImage src="/bot-avatar.png" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
            )}
            <div
              className={`px-3 py-2 rounded-lg text-sm max-w-xs break-words ${
                msg.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white p-4 flex items-center gap-2">
        <div className="w-full max-w-5xl mx-auto flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className="flex-1"
          />
          <Button onClick={handleSendMessage}>전송</Button>
        </div>
      </div>
    </div>
  )
}
