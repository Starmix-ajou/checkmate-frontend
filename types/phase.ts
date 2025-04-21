export type Phase = {
  id: number
  title: string
  question: string
  type: 'form' | 'chat'
  inputType?: 'text' | 'number' | 'date' | 'dateRange' | 'file'
}
