'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import CTAContainer from '@/components/CTAContainer'
import Button from '@/components/Button'
import StepHeader from '@/components/StepHeader'
import MeditationText from '@/components/MeditationText'
import ProgressIndicator from '@/components/ProgressIndicator'
import { useSessionStore } from '@/stores/sessionStore'

// BGM 이름 매핑 (setup 페이지와 동일)
const BGM_NAMES: Record<string, string> = {
  bgm1: '자연의 소리',
  bgm2: '명상 음악',
  bgm3: '바다의 파도',
  none: '없음',
}

// 스킨케어 단계 고정 순서 및 ID-한글 이름 매핑
const STEP_ORDER = ['토너', '에센스', '크림']
const STEP_ID_TO_NAME: Record<string, string> = {
  toner: '토너',
  essence: '에센스',
  cream: '크림',
}

export default function RoutinePlayContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Zustand 스토어에서 상태 가져오기
  const selectedSteps = useSessionStore((state) => state.selectedSteps)
  const voiceGuideEnabled = useSessionStore((state) => state.voiceGuideEnabled)
  const bgmId = useSessionStore((state) => state.bgmId)
  
  // 개발 모드 상태: 초기값은 false
  const [isDevMode, setIsDevMode] = useState(false)
  
  // useEffect에서 dev 쿼리 파라미터 확인
  useEffect(() => {
    // searchParams.get('dev') === '1'일 때만 dev 모드를 true로 설정
    const devParam = searchParams.get('dev')
    setIsDevMode(devParam === '1')
  }, [searchParams])

  // Mock 상태 (UI 목업용)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [currentPhraseText, setCurrentPhraseText] = useState(
    '지금 이 순간, 나에게 집중해보세요.'
  )

  // selectedSteps를 고정된 순서로 정렬
  // ID 형태('toner', 'essence', 'cream')를 한글 이름으로 변환하고 순서 정렬
  const sortedSteps = selectedSteps
    .map((step) => {
      // ID 형태인 경우 한글 이름으로 변환, 이미 한글인 경우 그대로 사용
      return STEP_ID_TO_NAME[step] || step
    })
    .filter((step) => STEP_ORDER.includes(step))
    .sort((a, b) => STEP_ORDER.indexOf(a) - STEP_ORDER.indexOf(b))

  // 정렬된 단계 배열 사용
  const steps = sortedSteps.length > 0 ? sortedSteps : []
  const currentStepName = steps.length > 0 && currentStepIndex < steps.length
    ? `${steps[currentStepIndex]} 단계`
    : '준비 중'
  const completedSteps: number[] = [] // 완료된 단계 인덱스 배열
  
  // BGM 이름 가져오기
  const bgmName = bgmId ? (BGM_NAMES[bgmId] || '알 수 없음') : '없음'

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

  // 다음 단계로 이동 (dev 모드용)
  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
    }
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
        {/* 우측 상단: 설정 상태 표시 (dev 모드에서만 표시) */}
        {isDevMode && (
          <div className="absolute top-4 right-4 text-xs sm:text-sm text-gray-600 space-y-1 z-10">
            <div>음성 가이드: {voiceGuideEnabled ? '사용함' : '사용 안 함'}</div>
            <div>BGM: {bgmName}</div>
          </div>
        )}

        {/* 상단: 현재 단계명 */}
        {steps.length > 0 && (
          <>
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
          </>
        )}

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
            {/* 다음 단계로 버튼 (단계별 가이드에서만 표시) */}
            {steps.length > 1 && (
              <Button
                onClick={handleNextStep}
                variant="secondary"
                size="sm"
                className="text-xs opacity-70 hover:opacity-100"
                disabled={currentStepIndex >= steps.length - 1}
              >
                DEV: 다음 단계로 ({currentStepIndex + 1}/{steps.length})
              </Button>
            )}
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

