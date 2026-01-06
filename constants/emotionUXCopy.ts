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
    startMessage: '지금 그대로, 이 시간을 시작합니다.',
    endMessage: '움직임을 멈추고, 이 상태를 잠시 유지합니다.',
    extraMindfulnessSeconds: 30,
  },
  bad: {
    startMessage: '지금은 편안하지 않아도 괜찮습니다. 이 상태로 시작합니다.',
    endMessage: '이제 손을 멈추고, 잠시 그대로 머뭅니다.',
    extraMindfulnessSeconds: 60,
  },
  good: {
    startMessage: '지금의 여유를 유지한 채, 이 시간을 이어갑니다.',
    endMessage: '이제 자연스럽게 마무리로 이어갑니다.',
    extraMindfulnessSeconds: 0,
  },
}

