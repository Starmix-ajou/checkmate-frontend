'use client'

import React, { useEffect, useState } from 'react'

import CheckmateSpinner from './CheckmateSpinner'

type LoadingScreenProps = {
  size?: number
  loading: boolean
}

const LoadingScreen = ({ size = 64, loading }: LoadingScreenProps) => {
  const [isVisible, setIsVisible] = useState(loading)

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (loading) {
      setIsVisible(true)
    } else {
      timer = setTimeout(() => {
        setIsVisible(false)
      }, 500)
    }

    return () => clearTimeout(timer)
  }, [loading])

  if (!isVisible && !loading) return null

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center bg-white/50 z-50 transition-opacity duration-500 ${
        loading ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <CheckmateSpinner size={size} />
    </div>
  )
}

export default LoadingScreen
