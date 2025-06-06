import { Task, ViewMode } from '@cm/types/public-types'

import DateTimeFormatOptions = Intl.DateTimeFormatOptions
import DateTimeFormat = Intl.DateTimeFormat

type DateHelperScales =
  | 'year'
  | 'month'
  | 'day'
  | 'hour'
  | 'minute'
  | 'second'
  | 'millisecond'

const intlDTCache: Record<string, Intl.DateTimeFormat> = {}
export const getCachedDateTimeFormat = (
  locString: string | string[],
  opts: DateTimeFormatOptions = {}
): DateTimeFormat => {
  const key = JSON.stringify([locString, opts])
  let dtf = intlDTCache[key]
  if (!dtf) {
    dtf = new Intl.DateTimeFormat(locString, opts)
    intlDTCache[key] = dtf
  }
  return dtf
}

export const addToDate = (
  date: Date,
  quantity: number,
  scale: DateHelperScales
) => {
  const newDate = new Date(
    date.getFullYear() + (scale === 'year' ? quantity : 0),
    date.getMonth() + (scale === 'month' ? quantity : 0),
    date.getDate() + (scale === 'day' ? quantity : 0),
    date.getHours() + (scale === 'hour' ? quantity : 0),
    date.getMinutes() + (scale === 'minute' ? quantity : 0),
    date.getSeconds() + (scale === 'second' ? quantity : 0),
    date.getMilliseconds() + (scale === 'millisecond' ? quantity : 0)
  )
  return newDate
}

export const startOfDate = (date: Date, scale: DateHelperScales) => {
  const scores = [
    'millisecond',
    'second',
    'minute',
    'hour',
    'day',
    'month',
    'year',
  ]

  const shouldReset = (_scale: DateHelperScales) => {
    const maxScore = scores.indexOf(scale)
    return scores.indexOf(_scale) <= maxScore
  }
  const newDate = new Date(
    date.getFullYear(),
    shouldReset('year') ? 0 : date.getMonth(),
    shouldReset('month') ? 1 : date.getDate(),
    shouldReset('day') ? 0 : date.getHours(),
    shouldReset('hour') ? 0 : date.getMinutes(),
    shouldReset('minute') ? 0 : date.getSeconds(),
    shouldReset('second') ? 0 : date.getMilliseconds()
  )
  return newDate
}

export const ganttDateRange = (
  tasks: Task[],
  viewMode: ViewMode,
  preStepsCount: number
) => {
  const now = new Date()
  let newStartDate: Date = tasks[0]?.start || now
  let newEndDate: Date = tasks[0]?.end || now
  for (const task of tasks) {
    if (task.start && task.start < newStartDate) {
      newStartDate = task.start
    }
    if (task.end && task.end > newEndDate) {
      newEndDate = task.end
    }
  }
  switch (viewMode) {
    case ViewMode.Year:
      newStartDate = addToDate(newStartDate, -1, 'year')
      newStartDate = startOfDate(newStartDate, 'year')
      newEndDate = addToDate(newEndDate, 1, 'year')
      newEndDate = startOfDate(newEndDate, 'year')
      break
    case ViewMode.QuarterYear:
      newStartDate = addToDate(newStartDate, -3, 'month')
      newStartDate = startOfDate(newStartDate, 'month')
      newEndDate = addToDate(newEndDate, 3, 'year')
      newEndDate = startOfDate(newEndDate, 'year')
      break
    case ViewMode.Month:
      newStartDate = addToDate(newStartDate, -1 * preStepsCount, 'month')
      newStartDate = startOfDate(newStartDate, 'month')
      newEndDate = addToDate(newEndDate, 1, 'year')
      newEndDate = startOfDate(newEndDate, 'year')
      break
    case ViewMode.Week:
      newStartDate = startOfDate(newStartDate, 'day')
      newStartDate = addToDate(
        getMonday(newStartDate),
        -7 * preStepsCount,
        'day'
      )
      newEndDate = startOfDate(newEndDate, 'day')
      newEndDate = addToDate(newEndDate, 1.5, 'month')
      break
    case ViewMode.Day:
      newStartDate = startOfDate(newStartDate, 'day')
      newStartDate = addToDate(newStartDate, -1 * preStepsCount, 'day')
      newEndDate = startOfDate(newEndDate, 'day')
      newEndDate = addToDate(newEndDate, 19, 'day')
      break
    case ViewMode.QuarterDay:
      newStartDate = startOfDate(newStartDate, 'day')
      newStartDate = addToDate(newStartDate, -1 * preStepsCount, 'day')
      newEndDate = startOfDate(newEndDate, 'day')
      newEndDate = addToDate(newEndDate, 66, 'hour') // 24(1 day)*3 - 6
      break
    case ViewMode.HalfDay:
      newStartDate = startOfDate(newStartDate, 'day')
      newStartDate = addToDate(newStartDate, -1 * preStepsCount, 'day')
      newEndDate = startOfDate(newEndDate, 'day')
      newEndDate = addToDate(newEndDate, 108, 'hour') // 24(1 day)*5 - 12
      break
    case ViewMode.Hour:
      newStartDate = startOfDate(newStartDate, 'hour')
      newStartDate = addToDate(newStartDate, -1 * preStepsCount, 'hour')
      newEndDate = startOfDate(newEndDate, 'day')
      newEndDate = addToDate(newEndDate, 1, 'day')
      break
  }
  return [newStartDate, newEndDate]
}

export const seedDates = (
  startDate: Date,
  endDate: Date,
  viewMode: ViewMode
) => {
  let currentDate: Date = new Date(startDate)
  const dates: Date[] = [currentDate]
  while (currentDate < endDate) {
    switch (viewMode) {
      case ViewMode.Year:
        currentDate = addToDate(currentDate, 1, 'year')
        break
      case ViewMode.QuarterYear:
        currentDate = addToDate(currentDate, 3, 'month')
        break
      case ViewMode.Month:
        currentDate = addToDate(currentDate, 1, 'month')
        break
      case ViewMode.Week:
        currentDate = addToDate(currentDate, 7, 'day')
        break
      case ViewMode.Day:
        currentDate = addToDate(currentDate, 1, 'day')
        break
      case ViewMode.HalfDay:
        currentDate = addToDate(currentDate, 12, 'hour')
        break
      case ViewMode.QuarterDay:
        currentDate = addToDate(currentDate, 6, 'hour')
        break
      case ViewMode.Hour:
        currentDate = addToDate(currentDate, 1, 'hour')
        break
    }
    dates.push(currentDate)
  }
  return dates
}

export const getLocaleMonth = (date: Date, locale: string) => {
  // 영어 월 표기를 위해 'en-US' 로케일 사용
  let bottomValue = getCachedDateTimeFormat('en-US', {
    month: 'short',
  }).format(date)
  bottomValue = bottomValue.toUpperCase()
  // 정확히 3글자로 표시하기 위해 첫 3글자만 사용
  return bottomValue.substring(0, 3)
}

export const getLocalDayOfWeek = (
  date: Date,
  locale: string,
  format?: 'long' | 'short' | 'narrow' | undefined
) => {
  // 영어 요일 표기를 위해 'en-US' 로케일 사용
  let bottomValue = getCachedDateTimeFormat('en-US', {
    weekday: 'short',
  }).format(date)
  // 대문자로 변환하고 첫 3글자만 사용
  bottomValue = bottomValue.substring(0, 3).toUpperCase()
  return bottomValue
}

/**
 * Returns monday of current week
 * @param date date for modify
 */
const getMonday = (date: Date) => {
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is sunday
  return new Date(date.setDate(diff))
}

export const getWeekNumberISO8601 = (date: Date) => {
  const tmpDate = new Date(date.valueOf())
  const dayNumber = (tmpDate.getDay() + 6) % 7
  tmpDate.setDate(tmpDate.getDate() - dayNumber + 3)
  const firstThursday = tmpDate.valueOf()
  tmpDate.setMonth(0, 1)
  if (tmpDate.getDay() !== 4) {
    tmpDate.setMonth(0, 1 + ((4 - tmpDate.getDay() + 7) % 7))
  }
  const weekNumber = (
    1 + Math.ceil((firstThursday - tmpDate.valueOf()) / 604800000)
  ).toString()

  if (weekNumber.length === 1) {
    return `0${weekNumber}`
  } else {
    return weekNumber
  }
}

export const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month + 1, 0).getDate()
}

export const getWeekNumberInMonth = (date: Date) => {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
  const firstDayOfWeek = firstDayOfMonth.getDay()
  const dayOfMonth = date.getDate()

  // 해당 월의 첫 번째 주의 시작일 계산 (일요일 기준)
  const firstWeekStart = 1

  // 현재 날짜가 몇 번째 주인지 계산
  const weekNumber = Math.ceil((dayOfMonth - firstWeekStart + 1) / 7)

  // 항상 1 이상의 값을 반환
  return `${Math.max(1, weekNumber)}`
}
