type CheckMateLogoSpinnerProps = {
  size?: number
}

export default function CheckMateLogoSpinner({
  size = 64,
}: CheckMateLogoSpinnerProps) {
  const squareSize = size / 2
  const borderRadius = size / 8
  const animationDistance = squareSize

  return (
    <div
      className="cm-loading-wrapper"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        margin: `${size / 16}rem`,
      }}
    >
      <div
        className="cm-square cm-dark"
        style={
          {
            width: `${squareSize}px`,
            height: `${squareSize}px`,
            '--border-radius': `${borderRadius}px`,
            '--animation-distance': `${animationDistance}px`,
            animation: `rotateA 2.5s infinite cubic-bezier(0.25, 0.75, 0.5, 1)`,
          } as React.CSSProperties
        }
      ></div>
      <div
        className="cm-square cm-light"
        style={
          {
            width: `${squareSize}px`,
            height: `${squareSize}px`,
            '--border-radius': `${borderRadius}px`,
            '--animation-distance': `${animationDistance}px`,
            animation: `rotateB 2.5s infinite cubic-bezier(0.25, 0.75, 0.5, 1)`,
          } as React.CSSProperties
        }
      ></div>
    </div>
  )
}
