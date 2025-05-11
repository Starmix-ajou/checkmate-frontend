export type Message = {
  sender: 'user' | 'ai'
  text: string
  tableData?: {
    features?: Feature[]
    suggestions?: {
      question: string
      answers: string[]
    }[]
    specifications?: Feature[]
  }
}

export type Phase = {
  id: number
  title: string
  question: string
  type: 'form' | 'chat'
  inputType?: 'text' | 'number' | 'date' | 'dateRange' | 'file' | 'table'
}

export type Feature = {
  name: string
  useCase: string
  input: string
  output: string
}
