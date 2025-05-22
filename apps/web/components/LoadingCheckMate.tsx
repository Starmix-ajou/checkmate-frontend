'use client'

import React, { useEffect, useState } from 'react'

import CheckMateLogoSpinner from './CheckMateSpinner'

type LoadingCheckMateProps = {
  size?: number
  loading: boolean
}

const LoadingCheckMate = ({ size = 64, loading }: LoadingCheckMateProps) => {
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
      <CheckMateLogoSpinner size={size} />
    </div>
  )
}

export default LoadingCheckMate
