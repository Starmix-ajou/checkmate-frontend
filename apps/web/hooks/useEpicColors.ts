import { useMemo } from 'react'

const BAR_COLORS = ['#5585F7', '#F26673', '#FDB748', '#24CD79']

// 색상의 투명도를 80%로 설정하는 함수
const setOpacity = (color: string) => {
  return color + 'CC' // CC는 16진수로 80% 투명도를 의미
}

// 에픽 ID를 기반으로 일관된 색상을 반환하는 함수
const getEpicColor = (epicId: string) => {
  // epicId의 마지막 문자를 숫자로 변환하여 색상 인덱스로 사용
  const lastChar = epicId.slice(-1)
  const colorIndex = parseInt(lastChar, 16) % BAR_COLORS.length
  return BAR_COLORS[colorIndex]
}

export const useEpicColors = (tasks: any[]) => {
  const epicColors = useMemo(() => {
    const colorMap = new Map<string, string>()

    // 먼저 모든 에픽의 색상을 설정
    tasks.forEach((task) => {
      if (task.typeInternal === 'project') {
        const color = getEpicColor(task.id)
        colorMap.set(task.id, color)
      }
    })

    return colorMap
  }, [tasks])

  const getTaskColor = (task: any) => {
    // 에픽인 경우
    if (task.typeInternal === 'project') {
      return getEpicColor(task.id)
    }

    // 태스크인 경우
    const parentEpic = tasks.find(
      (t) => t.typeInternal === 'project' && t.id === task.project
    )

    if (parentEpic) {
      const epicColor = epicColors.get(parentEpic.id)
      if (epicColor) {
        return setOpacity(epicColor)
      }
      return setOpacity(getEpicColor(parentEpic.id))
    }

    return setOpacity(getEpicColor(task.id))
  }

  return {
    epicColors,
    getTaskColor,
  }
}
