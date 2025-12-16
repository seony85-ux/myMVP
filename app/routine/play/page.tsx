'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import CTAContainer from '@/components/CTAContainer'
import Button from '@/components/Button'
import StepHeader from '@/components/StepHeader'
import MeditationText from '@/components/MeditationText'
import ProgressIndicator from '@/components/ProgressIndicator'

export default function RoutinePlayPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // 개발 모드 확인: NODE_ENV가 production이 아니거나 ?dev=1 쿼리 파라미터가 있을 때
  const isDevMode = process.env.NODE_ENV !== 'production' || searchParams.get('dev') === '1'

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
    // TODO: 루틴 중단 처리 (세션 상태를 aborted로 저장)
    // 중단 시 Summary 화면으로 이동 (aborted 파라미터 포함)
    router.push('/result/summary?aborted=1')
  }

  // 개발용 핸들러
  const handleDevComplete = () => {
    router.push('/result/emotion')
  }

  const handleDevAbort = () => {
    router.push('/result/summary?aborted=1')
  }

  // TODO: 모든 단계 완료 시 자동으로 /result/emotion으로 이동
  // useEffect(() => {
  //   if (모든 단계 완료) {
  //     router.push('/result/emotion')
  //   }
  // }, [completedSteps])

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

        {/* 개발용 컨트롤 (프로덕션에서는 숨김) */}
        {isDevMode && (
          <div className="fixed bottom-20 right-4 flex flex-col gap-2 z-50">
            <Button
              onClick={handleDevComplete}
              variant="secondary"
              size="sm"
              className="text-xs opacity-70 hover:opacity-100"
            >
              DEV: 루틴 완료
            </Button>
            <Button
              onClick={handleDevAbort}
              variant="secondary"
              size="sm"
              className="text-xs opacity-70 hover:opacity-100"
            >
              DEV: 중단
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  )
}

