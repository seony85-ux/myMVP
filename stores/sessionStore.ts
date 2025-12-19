import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SessionState {
  // 루틴 설정 관련
  emotionScore: number | null
  bgmId: string | null
  routineMode: 'basic' | 'detailed'
  selectedSteps: string[]
  voiceGuideEnabled: boolean
  
  // 감정 관련
  beforeEmotion: number | null
  afterEmotion: number | null
  
  // 피드백 관련
  satisfaction: number | null
  reuseIntention: boolean | null
  
  // Actions
  setEmotionScore: (score: number | null) => void
  setBgmId: (id: string | null) => void
  setRoutineMode: (mode: 'basic' | 'detailed') => void
  setSelectedSteps: (steps: string[]) => void
  setVoiceGuideEnabled: (enabled: boolean) => void
  setBeforeEmotion: (score: number | null) => void
  setAfterEmotion: (score: number | null) => void
  setSatisfaction: (score: number | null) => void
  setReuseIntention: (intention: boolean | null) => void
  resetSession: () => void
}

const initialState = {
  emotionScore: null,
  bgmId: null,
  routineMode: 'basic' as const,
  selectedSteps: [],
  voiceGuideEnabled: true,
  beforeEmotion: null,
  afterEmotion: null,
  satisfaction: null,
  reuseIntention: null,
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setEmotionScore: (score) => set({ emotionScore: score }),
      setBgmId: (id) => set({ bgmId: id }),
      setRoutineMode: (mode) => set({ routineMode: mode }),
      setSelectedSteps: (steps) => set({ selectedSteps: steps }),
      setVoiceGuideEnabled: (enabled) => set({ voiceGuideEnabled: enabled }),
      setBeforeEmotion: (score) => set({ beforeEmotion: score }),
      setAfterEmotion: (score) => set({ afterEmotion: score }),
      setSatisfaction: (score) => set({ satisfaction: score }),
      setReuseIntention: (intention) => set({ reuseIntention: intention }),
      
      resetSession: () => set(initialState),
    }),
    {
      name: 'session-storage', // localStorage key
    }
  )
)

