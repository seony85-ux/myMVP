/*
 * 5단계 기분 선택을 UX 분기용 3단계 상태로 변환한다.
 * 입력 UI는 유지하고, UX 복잡도만 줄이기 위한 레이어다.
 */

// 기분 단계 타입: 1~5
export type EmotionLevel = 1 | 2 | 3 | 4 | 5

// 기분 상태 타입: bad, neutral, good
export type EmotionState = 'bad' | 'neutral' | 'good'

// 기분 단계를 기분 상태로 매핑하는 객체
// 매핑 규칙:
// - bad: 가장 낮은 2단계 (1, 2)
// - neutral: 정확히 가운데 1단계 (3)
// - good: 가장 높은 2단계 (4, 5)
export const emotionStateMap: Record<EmotionLevel, EmotionState> = {
  1: 'bad',    // 매우 나쁨
  2: 'bad',    // 나쁨
  3: 'neutral', // 보통
  4: 'good',   // 좋음
  5: 'good',   // 매우 좋음
}

