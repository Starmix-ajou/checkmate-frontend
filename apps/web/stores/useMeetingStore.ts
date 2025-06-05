import { create } from 'zustand'

interface MeetingStore {
  meetingContent: string
  setMeetingContent: (content: string) => void
  clearMeetingContent: () => void
}

export const useMeetingStore = create<MeetingStore>((set) => ({
  meetingContent: '',
  setMeetingContent: (content: string) => set({ meetingContent: content }),
  clearMeetingContent: () => set({ meetingContent: '' }),
})) 