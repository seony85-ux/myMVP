'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import EmotionSelector from '@/components/EmotionSelector'
import BGMCardList from '@/components/BGMCardList'
import SkincareStepSelector from '@/components/SkincareStepSelector'
import RoutineModeSelector from '@/components/RoutineModeSelector'
import Button from '@/components/Button'
import AppLayout from '@/components/AppLayout'
import SectionHeader from '@/components/SectionHeader'
import SectionBlock from '@/components/SectionBlock'
import CTAContainer from '@/components/CTAContainer'
import { useSessionStore } from '@/stores/sessionStore'

// 임시 BGM 데이터 (나중에 API/전역 상태로 대체)
const mockBGMs = [
  { id: 'bgm1', name: '자연의 소리', description: '숲속 새소리와 물소리', imageUrl: '/images/forest.webp' },
  { id: 'bgm2', name: '명상 음악', description: '차분한 피아노 선율', imageUrl: '/images/piano.webp' },
  { id: 'bgm3', name: '바다의 파도', description: '평온한 파도 소리', imageUrl: '/images/sea.webp' },
  { id: 'none', name: '없음', description: '배경음 없이 진행', imageUrl: '/images/noselection.webp' },
]

export default function RoutineSetupPage() {
  const router = useRouter()

  // Zustand 스토어에서 상태 가져오기
  const emotionScore = useSessionStore((state) => state.emotionScore)
  const bgmId = useSessionStore((state) => state.bgmId)
  const routineMode = useSessionStore((state) => state.routineMode)
  const selectedSteps = useSessionStore((state) => state.selectedSteps)
  const setEmotionScore = useSessionStore((state) => state.setEmotionScore)
  const setBgmId = useSessionStore((state) => state.setBgmId)
  const setRoutineMode = useSessionStore((state) => state.setRoutineMode)
  const setSelectedSteps = useSessionStore((state) => state.setSelectedSteps)
  const setBeforeEmotion = useSessionStore((state) => state.setBeforeEmotion)

  // 로컬 UI 상태
  const [stepsTouched, setStepsTouched] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // 다음 버튼 활성화 조건
  // basic: 항상 enable
  // detailed: selectedSteps.length >= 1
  const isNextButtonEnabled =
    routineMode === 'basic' || selectedSteps.length >= 1

  const handleModeChange = (mode: 'basic' | 'detailed') => {
    setRoutineMode(mode)
    // basic 모드로 전환 시 selectedSteps 초기화
    if (mode === 'basic') {
      setSelectedSteps([])
      setStepsTouched(false)
    }
  }

  const handleStepsChange = (steps: string[]) => {
    setSelectedSteps(steps)
    setStepsTouched(true)
  }

  const handleEmotionChange = (score: number | null) => {
    setEmotionScore(score)
    // 감정 점수를 beforeEmotion에도 저장
    if (score !== null) {
      setBeforeEmotion(score)
    }
  }

  const handleNext = () => {
    if (!isNextButtonEnabled) {
      setSubmitted(true)
      return
    }

    router.push('/routine/voice')
  }

  const shouldShowStepError =
    routineMode === 'detailed' &&
    (stepsTouched || submitted) &&
    selectedSteps.length === 0

  return (
    <AppLayout>
      <div className="flex flex-col min-h-[100svh]">
        {/* 상단 영역: 화면 제목 */}
        <div className="px-6 pt-8 pb-6 border-b-2 border-gray-200">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">오늘의 루틴 설정</h1>
        </div>

        {/* 스크롤 가능한 콘텐츠 영역 (CTA 높이만큼 여백 추가) */}
        <div className="px-6 py-6 space-y-8 pb-32">
        {/* 섹션 1: 감정 선택 */}
        <SectionBlock>
          <SectionHeader title="지금 기분은 어떤가요?" />
          <div className="pt-2">
            <EmotionSelector value={emotionScore} onChange={handleEmotionChange} showLabels />
          </div>
        </SectionBlock>

        {/* 섹션 2: BGM 선택 */}
        <SectionBlock>
          <SectionHeader title="배경음" />
          <div className="pt-2">
            <BGMCardList bgms={mockBGMs} selectedId={bgmId} onSelect={setBgmId} />
          </div>
        </SectionBlock>

        {/* 섹션 3: 루틴 모드 선택 */}
        <SectionBlock>
          <SectionHeader title="루틴 모드" />
          <div className="pt-2">
            <RoutineModeSelector value={routineMode} onChange={handleModeChange} />
          </div>
        </SectionBlock>

        {/* 섹션 4: 스킨케어 단계 선택 (단계별 가이드 모드일 때만 표시) */}
        {routineMode === 'detailed' && (
          <SectionBlock>
            <SectionHeader title="스킨케어 단계" description="자신의 스킨케어 단계를 선택해보세요.(최소 1개 이상)" />
            <div className="pt-2">
              <SkincareStepSelector
                selectedSteps={selectedSteps}
                onChange={handleStepsChange}
              />
            </div>
            {shouldShowStepError && (
              <p className="text-center text-sm text-red-600 mt-4">
                스킨케어 단계를 최소 1개 이상 선택해주세요
              </p>
            )}
          </SectionBlock>
        )}
        </div>

        {/* 하단 고정 버튼 영역 */}
        <CTAContainer>
        <Button
          onClick={handleNext}
          disabled={!isNextButtonEnabled}
          variant="primary"
          size="lg"
          fullWidth
        >
          다음
        </Button>
        </CTAContainer>
      </div>
    </AppLayout>
  )
}

