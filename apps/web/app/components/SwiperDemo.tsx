'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCards, Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-cards'
import 'swiper/css/pagination'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import type { Swiper as SwiperType } from 'swiper'

const conversations = [
  {
    messages: [
      {
        role: 'user',
        content: '프로젝트 기능을 구성해주세요.',
      },
      {
        role: 'assistant',
        content: '프로젝트 기능 정의가 완료되었습니다.',
      },
    ],
    image: '/demo_project.svg',
  },
  {
    messages: [
      {
        role: 'user',
        content: '스프린트를 구성해주세요.',
      },
      {
        role: 'assistant',
        content: '이번 스프린트 구성이 완료되었습니다.',
      },
    ],
    image: '/demo_sprint.svg',
  },
  {
    messages: [
      {
        role: 'user',
        content: '이번 회의록을 요약하고 액션아이템을 추출해 주세요.',
      },
      {
        role: 'assistant',
        content: '회의록에서 추출한 액션 아이템을 검토해 주세요.',
      },
    ],
    image: '/demo_meeting.svg',
  },
]

export function SwiperDemo() {
  const [showMessages, setShowMessages] = useState<boolean[][]>(
    conversations.map(() => [false, false])
  )
  const [showImage, setShowImage] = useState<boolean[]>(
    conversations.map(() => false)
  )

  const handleSlideChange = (swiper: SwiperType) => {
    const currentIndex = swiper.activeIndex
    
    // 현재 슬라이드의 모든 애니메이션 상태 초기화
    setShowMessages((prev) => {
      const newState = prev.map((slide, index) => 
        index === currentIndex ? [false, false] : slide
      )
      return newState
    })
    setShowImage((prev) => {
      const newState = prev.map((show, index) => 
        index === currentIndex ? false : show
      )
      return newState
    })

    // 현재 슬라이드의 애니메이션 시작
    const timers: NodeJS.Timeout[] = []

    // 첫 번째 메시지 표시
    timers.push(
      setTimeout(() => {
        setShowMessages((prev) => {
          const newState = [...prev]
          newState[currentIndex] = [true, false]
          return newState
        })
      }, 0)
    )

    // 두 번째 메시지 표시
    timers.push(
      setTimeout(() => {
        setShowMessages((prev) => {
          const newState = [...prev]
          newState[currentIndex] = [true, true]
          return newState
        })
      }, 500)
    )

    // 이미지 표시
    timers.push(
      setTimeout(() => {
        setShowImage((prev) => {
          const newState = [...prev]
          newState[currentIndex] = true
          return newState
        })
      }, 1000)
    )

    return () => {
      timers.forEach((timer) => clearTimeout(timer))
    }
  }

  return (
    <div className="w-full max-w-md">
      <Swiper
        effect={'cards'}
        grabCursor={true}
        modules={[EffectCards, Autoplay, Pagination]}
        className="w-full h-[300px] lg:h-[400px]"
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet !bg-cm !w-1.5 !h-1.5 lg:!w-2 lg:!h-2',
          bulletActiveClass: 'swiper-pagination-bullet-active !bg-cm/80',
        }}
        onSlideChange={handleSlideChange}
        onSwiper={(swiper) => {
          // 초기 슬라이드 애니메이션 시작
          handleSlideChange(swiper)
        }}
      >
        {conversations.map((conversation, slideIndex) => (
          <SwiperSlide key={slideIndex} className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
            <div className="flex flex-col gap-3 lg:gap-4">
              {/* 메시지 */}
              {conversation.messages.map((message, messageIndex) => (
                <div
                  key={messageIndex}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] lg:max-w-[80%] rounded-xl p-2.5 lg:p-3 transition-all duration-500 transform ${
                      showMessages[slideIndex][messageIndex]
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-4 opacity-0'
                    } ${
                      message.role === 'user'
                        ? 'bg-cm text-white'
                        : 'bg-accent/50 text-gray-900'
                    }`}
                  >
                    <p className="text-sm lg:text-md">{message.content}</p>
                  </div>
                </div>
              ))}
              
              {/* 이미지 */}
              <div className={`transition-all duration-500 transform ${
                showImage[slideIndex]
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-4 opacity-0'
              }`}>
                <Image
                  src={conversation.image}
                  alt="Demo"
                  width={509}
                  height={180}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
} 