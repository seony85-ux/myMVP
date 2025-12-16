'use client'

import { useState } from 'react'
import AppLayout from '@/components/AppLayout'
import CTAContainer from '@/components/CTAContainer'
import Button from '@/components/Button'
import StepHeader from '@/components/StepHeader'
import MeditationText from '@/components/MeditationText'
import ProgressIndicator from '@/components/ProgressIndicator'

export default function RoutinePlayPage() {
  // Mock 상태 (UI 목업용)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [currentPhraseText, setCurrentPhraseText] = useState(
    '지금 이 순간, 나에게 집중해보세요.'
  )

  // Mock 데이터
  const steps = ['토너', '에센스', '크림']
  const currentStepName = `${steps[currentStepIndex]} 단계`
  const completedSteps = [] // 완료된 단계 인덱스 배열

  const handleStop = () => {
    // TODO: 확인 다이얼로그 표시
    // TODO: 루틴 중단 처리
    console.log('루틴 중단')
  }

  return (
    <AppLayout>
      <div className="flex flex-col min-h-[100svh]">
        {/* 상단: 현재 단계명 */}
        <StepHeader
          stepName={currentStepName}
          stepNumber={currentStepIndex + 1}
          totalSteps={steps.length}
        />

        {/* 진행 상태 시각화 */}
        <ProgressIndicator
          steps={steps}
          currentStep={currentStepIndex}
          completedSteps={completedSteps}
          variant="dots"
        />

        {/* 중앙: 현재 명상 문장 */}
        <div className="flex-1 flex items-center justify-center px-6 pb-32">
          <MeditationText text={currentPhraseText} animate={false} />
        </div>

        {/* 하단: 중단하기 버튼 */}
        <CTAContainer>
          <Button
            onClick={handleStop}
            variant="danger"
            size="lg"
            fullWidth
          >
            중단하기
          </Button>
        </CTAContainer>
      </div>
    </AppLayout>
  )
}

