import { renderHook } from '@testing-library/react'
import { useProjectColor, getPositionColor } from './useRandomColor'

describe('useRandomColor', () => {
  describe('useProjectColor', () => {
    it('동일한 seed에 대해 항상 동일한 색상을 반환해야 합니다', () => {
      const { result: result1 } = renderHook(() => useProjectColor('test-project'))
      const { result: result2 } = renderHook(() => useProjectColor('test-project'))

      expect(result1.current.backgroundColor).toBe(result2.current.backgroundColor)
      expect(result1.current.titleColor).toBe(result2.current.titleColor)
    })

    it('다른 seed에 대해 다른 색상을 반환해야 합니다', () => {
      const { result: result1 } = renderHook(() => useProjectColor('project1'))
      const { result: result2 } = renderHook(() => useProjectColor('project2'))

      expect(result1.current.backgroundColor).not.toBe(result2.current.backgroundColor)
    })

    it('backgroundColor와 titleColor가 서로 다른 색상이어야 합니다', () => {
      const { result } = renderHook(() => useProjectColor('test-project'))

      expect(result.current.backgroundColor).not.toBe(result.current.titleColor)
    })

    it('titleColor는 backgroundColor보다 어두운 색상이어야 합니다', () => {
      const { result } = renderHook(() => useProjectColor('test-project'))
      
      const bg = result.current.backgroundColor as string
      const title = result.current.titleColor as string
      
      // RGB 값으로 변환하여 밝기 비교
      const bgBrightness = parseInt(bg.slice(1, 3), 16) + parseInt(bg.slice(3, 5), 16) + parseInt(bg.slice(5, 7), 16)
      const titleBrightness = parseInt(title.slice(1, 3), 16) + parseInt(title.slice(3, 5), 16) + parseInt(title.slice(5, 7), 16)
      
      expect(titleBrightness).toBeLessThan(bgBrightness)
    })
  })

  describe('getPositionColor', () => {
    it('동일한 position에 대해 항상 동일한 색상을 반환해야 합니다', () => {
      const result1 = getPositionColor('Frontend')
      const result2 = getPositionColor('Frontend')

      expect(result1.bgColor).toBe(result2.bgColor)
      expect(result1.textColor).toBe(result2.textColor)
    })

    it('다른 position에 대해 다른 색상을 반환해야 합니다', () => {
      const result1 = getPositionColor('Frontend')
      const result2 = getPositionColor('Backend')

      expect(result1.bgColor).not.toBe(result2.bgColor)
    })

    it('bgColor와 textColor가 서로 다른 색상이어야 합니다', () => {
      const result = getPositionColor('Frontend')

      expect(result.bgColor).not.toBe(result.textColor)
    })

    it('textColor는 bgColor보다 어두운 색상이어야 합니다', () => {
      const result = getPositionColor('Frontend')
      
      const bgColor = result.bgColor as string
      const textColor = result.textColor as string
      
      // RGB 값으로 변환하여 밝기 비교
      const bgBrightness = parseInt(bgColor.slice(1, 3), 16) + 
                          parseInt(bgColor.slice(3, 5), 16) + 
                          parseInt(bgColor.slice(5, 7), 16)
      const textBrightness = parseInt(textColor.slice(1, 3), 16) + 
                            parseInt(textColor.slice(3, 5), 16) + 
                            parseInt(textColor.slice(5, 7), 16)
      
      expect(textBrightness).toBeLessThan(bgBrightness)
    })
  })
}) 