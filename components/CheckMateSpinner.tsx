type CheckMateLogoSpinnerProps = {
  size?: number
}

export default function CheckMateLogoSpinner({
  size = 64,
}: CheckMateLogoSpinnerProps) {
  const squareSize = size / 2

  return (
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
  )
}
