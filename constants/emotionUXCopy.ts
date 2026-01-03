/*
 * emotionUXCopy
 * - neutral은 기존 UX의 기준(anchor) 문구입니다.
 * - bad / good은 다음 단계에서 구체화됩니다.
 */

import { EmotionState } from './emotionState'

export const emotionUXCopy: Record<
  EmotionState,
  {
    startMessage: string
    endMessage: string
    extraMindfulnessSeconds: number
  }
> = {
  neutral: {
    startMessage: '지금 이 순간, 나에게 집중해보세요.',
    endMessage: '오늘 하루도 수고하셨어요.',
    extraMindfulnessSeconds: 30,
  },
  bad: {
    startMessage: '임시 문구',
    endMessage: '임시 문구',
    extraMindfulnessSeconds: 60,
  },
  good: {
    startMessage: '임시 문구',
    endMessage: '임시 문구',
    extraMindfulnessSeconds: 0,
  },
}

