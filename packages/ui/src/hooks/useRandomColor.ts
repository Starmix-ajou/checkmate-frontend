import { useMemo } from 'react'
import tinycolor from 'tinycolor2'

const pastelColors = [
  '#F5EAEA',
  '#E9F0F6',
  '#EDF4ED',
  '#F9F6EC',
  '#EFEFF6',
  '#F6F3F0',
  '#F3F1F5',
  '#E7EFF2',
  '#F0F0F0',
  '#EBF3EC',
]

const getHashFromString = (str: string) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return hash
}

export const useProjectColor = (seed: string) => {
  const backgroundColor = useMemo(() => {
    const hash = getHashFromString(seed)
    const index = Math.abs(hash) % pastelColors.length
    return pastelColors[index]
  }, [seed])

  const titleColor = useMemo(() => {
    const bg = tinycolor(backgroundColor)
    return bg.darken(20).saturate(15).toString()
  }, [backgroundColor])

  return {
    backgroundColor,
    titleColor,
  }
}

export const getPositionColor = (position: string) => {
  const hash = getHashFromString(position)
  const index = Math.abs(hash) % pastelColors.length
  const bgColor = pastelColors[index]
  const textColor = tinycolor(bgColor).darken(40).saturate(40).toString()
  return { bgColor, textColor }
}
