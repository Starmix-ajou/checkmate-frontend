import React from 'react'

type LoadingCheckMateProps = {
  size?: number
}

const LoadingCheckMate = ({ size = 64 }: LoadingCheckMateProps) => {
  const squareSize = size / 2
  return (
    <div className="flex justify-center items-center h-screen">
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
