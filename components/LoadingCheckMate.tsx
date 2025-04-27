import React from 'react'

const LoadingCheckMate = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="cm-loading-wrapper">
        <div className="cm-square cm-dark"></div>
        <div className="cm-square cm-light"></div>
      </div>
    </div>
  )
}

export default LoadingCheckMate
