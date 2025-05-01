'use client'

import React, { useEffect, useState } from 'react'

type LoadingCheckMateProps = {
  size?: number
  loading: boolean
}

const LoadingCheckMate = ({ size = 64, loading }: LoadingCheckMateProps) => {
  const [isVisible, setIsVisible] = useState(loading)
  const squareSize = size / 2

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
      <div
        className="cm-loading-wrapper"
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
      >
        <div
          className="cm-square cm-dark"
          style={{
            width: `${squareSize}px`,
            height: `${squareSize}px`,
          }}
        ></div>
        <div
          className="cm-square cm-light"
          style={{
            width: `${squareSize}px`,
            height: `${squareSize}px`,
          }}
        ></div>
      </div>
    </div>
  )
}

export default LoadingCheckMate
