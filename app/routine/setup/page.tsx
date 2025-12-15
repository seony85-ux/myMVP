'use client'

import { useState } from 'react'
import EmotionSelector from '@/components/EmotionSelector'
import BGMCardList from '@/components/BGMCardList'
import SkincareStepSelector from '@/components/SkincareStepSelector'
import Button from '@/components/Button'
import AppLayout from '@/components/AppLayout'
import SectionHeader from '@/components/SectionHeader'
import SectionBlock from '@/components/SectionBlock'
import CTAContainer from '@/components/CTAContainer'

// 임시 BGM 데이터 (나중에 API/전역 상태로 대체)
const mockBGMs = [
  { id: 'bgm1', name: '자연의 소리', description: '숲속 새소리와 물소리' },
  { id: 'bgm2', name: '명상 음악', description: '차분한 피아노 선율' },
  { id: 'bgm3', name: '바다의 파도', description: '평온한 파도 소리' },
  { id: 'none', name: '없음', description: '배경음 없이 진행' },
]

export default function RoutineSetupPage() {
  // 로컬 상태 관리
  const [emotion, setEmotion] = useState<number | null>(null)
  const [bgmId, setBgmId] = useState<string | null>(null)
  const [selectedSteps, setSelectedSteps] = useState<string[]>([])
  const [stepsTouched, setStepsTouched] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // 다음 버튼 활성화 조건: 스킨케어 단계 최소 1개 이상 선택
  const isNextButtonEnabled = selectedSteps.length >= 1

  const handleStepsChange = (steps: string[]) => {
    setSelectedSteps(steps)
    setStepsTouched(true)
  }

  const handleNext = () => {
    setSubmitted(true)
    // TODO: 전역 상태에 저장
    // TODO: 다음 화면(/voice-guide)으로 라우팅
    console.log('선택된 설정:', {
      emotion,
      bgmId,
      selectedSteps,
    })
  }

  const shouldShowStepError =
    (stepsTouched || submitted) && selectedSteps.length === 0

  return (
    <AppLayout>
      {/* 상단 영역: 화면 제목 */}
      <div className="px-6 pt-8 pb-6 border-b-2 border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">오늘의 루틴 설정</h1>
      </div>

      {/* 스크롤 가능한 콘텐츠 영역 (CTA 높이만큼 여백 추가) */}
      <div className="px-6 py-6 space-y-8 pb-32">
        {/* 섹션 1: 감정 선택 */}
        <SectionBlock>
          <SectionHeader title="지금 기분은 어떤가요?" />
          <div className="pt-2">
            <EmotionSelector value={emotion} onChange={setEmotion} showLabels />
          </div>
        </SectionBlock>

        {/* 섹션 2: BGM 선택 */}
        <SectionBlock>
          <SectionHeader title="배경음" />
          <div className="pt-2">
            <BGMCardList bgms={mockBGMs} selectedId={bgmId} onSelect={setBgmId} />
          </div>
        </SectionBlock>

        {/* 섹션 3: 스킨케어 단계 선택 */}
        <SectionBlock>
          <SectionHeader title="스킨케어 단계" description="최소 1개 이상 선택해주세요" />
          <div className="pt-2">
            <SkincareStepSelector
              selectedSteps={selectedSteps}
              onChange={handleStepsChange}
            />
          </div>
          {shouldShowStepError && (
            <p className="text-sm text-red-600 mt-2">
              스킨케어 단계를 최소 1개 이상 선택해주세요
            </p>
          )}
        </SectionBlock>
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
    </AppLayout>
  )
}

