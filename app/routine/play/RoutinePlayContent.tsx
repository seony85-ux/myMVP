'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
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
  const routineMode = useSessionStore((state) => state.routineMode)
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

  // 현재 진행 중인 단계 인덱스 관리 (초기값: 0)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  // routineMode에 따라 단계 배열 구성 (메모이제이션)
  const routineSteps = useMemo(() => {
    if (routineMode === 'basic') {
      // 기본 모드: 고정 단계
      return ['start', 'free', 'end']
    } else {
      // 단계별 가이드 모드: start + 선택된 단계들 + end
      // selectedSteps를 고정된 순서로 정렬
      const sortedSteps = selectedSteps
        .map((step) => {
          // ID 형태인 경우 한글 이름으로 변환, 이미 한글인 경우 그대로 사용
          return STEP_ID_TO_NAME[step] || step
        })
        .filter((step) => STEP_ORDER.includes(step))
        .sort((a, b) => STEP_ORDER.indexOf(a) - STEP_ORDER.indexOf(b))
      
      return ['start', ...sortedSteps, 'end']
    }
  }, [routineMode, selectedSteps])
  const currentStep = routineSteps[currentStepIndex] || 'start'
  
  // 현재 단계명 표시용 (메모이제이션)
  const currentStepName = useMemo(() => {
    if (currentStep === 'start') return '시작'
    if (currentStep === 'free') return '자율'
    if (currentStep === 'end') return '마무리'
    return `${currentStep} 단계`
  }, [currentStep])
  
  // 완료된 단계 인덱스 배열: 현재 단계 이전의 모든 단계 (메모이제이션)
  const completedSteps = useMemo(() => {
    return Array.from({ length: currentStepIndex }, (_, i) => i)
  }, [currentStepIndex])

  // 현재 단계에 따른 문구 설정 (메모이제이션)
  const currentPhraseText = useMemo(() => {
    switch (currentStep) {
      case 'start':
        return '지금 이 순간, 나에게 집중해보세요.'
      case 'free':
        return '자유롭게 스킨케어를 진행해주세요.'
      case 'end':
        return '오늘 하루도 수고하셨어요.'
      default:
        // 토너, 에센스, 크림 등의 단계별 명상 문구
        return `지금 이 순간, ${currentStep}에 집중해보세요.`
    }
  }, [currentStep])
  
  // BGM 이름 가져오기 (메모이제이션)
  const bgmName = useMemo(() => {
    return bgmId ? (BGM_NAMES[bgmId] || '알 수 없음') : '없음'
  }, [bgmId])

  // 중단 상태 관리 (중단 시 타이머 정리를 위해)
  const [isAborted, setIsAborted] = useState(false)
  // 일시중지 상태 관리
  const [isPaused, setIsPaused] = useState(false)

  // 마지막 단계인지 확인 (메모이제이션)
  const isLastStep = useMemo(() => {
    return currentStepIndex >= routineSteps.length - 1
  }, [currentStepIndex, routineSteps.length])

  const handleStop = useCallback(() => {
    // TODO: 확인 다이얼로그 표시
    // TODO: 루틴 중단 처리 (세션 상태를 aborted로 저장)
    // 중단 상태 설정 (타이머 정리를 위해)
    setIsAborted(true)
    // 중단 시 Summary 화면으로 이동 (aborted 파라미터 포함)
    router.push('/result/summary?aborted=1')
  }, [router])

  // 일시중지/재개 핸들러
  const handlePause = useCallback(() => {
    setIsPaused(true)
  }, [])

  const handleResume = useCallback(() => {
    setIsPaused(false)
  }, [])

  // 끝내기 핸들러 (마지막 단계 완료 후)
  const handleComplete = useCallback(() => {
    router.push('/result/emotion')
  }, [router])

  // 개발용 핸들러
  const handleDevComplete = useCallback(() => {
    router.push('/result/emotion')
  }, [router])

  const handleDevAbort = useCallback(() => {
    router.push('/result/summary?aborted=1')
  }, [router])

  // 다음 단계로 이동 (dev 모드용)
  const handleNextStep = useCallback(() => {
    if (currentStepIndex < routineSteps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1)
    }
  }, [currentStepIndex, routineSteps.length])

  // 자동 진행 로직: 10초마다 다음 단계로 전환
  useEffect(() => {
    // 중단된 경우 타이머 실행하지 않음
    if (isAborted) {
      return
    }

    // 일시중지된 경우 타이머 실행하지 않음
    if (isPaused) {
      return
    }

    // 마지막 단계에서는 자동 진행하지 않음 (끝내기 버튼으로 완료)
    if (isLastStep) {
      return
    }

    // 각 단계마다 10초 후 다음 단계로 전환
    const timer = setTimeout(() => {
      setCurrentStepIndex((prev) => {
        if (prev < routineSteps.length - 1) {
          return prev + 1
        }
        return prev
      })
    }, 10000) // 10초

    // cleanup: 컴포넌트 언마운트 또는 의존성 변경 시 타이머 정리
    return () => {
      clearTimeout(timer)
    }
  }, [currentStepIndex, routineSteps.length, isAborted, isPaused, isLastStep])

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
        {routineSteps.length > 0 && (
          <>
            <StepHeader
              stepName={currentStepName}
              stepNumber={currentStepIndex + 1}
              totalSteps={routineSteps.length}
            />

            {/* 진행 상태 시각화 */}
            <ProgressIndicator
              steps={routineSteps.map((step) => {
                // ProgressIndicator에 표시할 단계명 변환
                if (step === 'start') return '시작'
                if (step === 'free') return '자율'
                if (step === 'end') return '마무리'
                return step
              })}
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

        {/* 하단: 버튼 영역 */}
        <CTAContainer>
          {isLastStep ? (
            // 마지막 단계: 끝내기 버튼
            <Button
              onClick={handleComplete}
              variant="primary"
              size="lg"
              fullWidth
            >
              끝내기
            </Button>
          ) : (
            // 진행 중: 일시중지/재개 및 중단하기 버튼
            <div className="flex gap-3 w-full">
              {isPaused ? (
                <Button
                  onClick={handleResume}
                  variant="primary"
                  size="lg"
                  className="flex-1"
                >
                  재개
                </Button>
              ) : (
                <Button
                  onClick={handlePause}
                  variant="secondary"
                  size="lg"
                  className="flex-1"
                >
                  일시중지
                </Button>
              )}
              <Button
                onClick={handleStop}
                variant="danger"
                size="lg"
                className="flex-1"
              >
                중단하기
              </Button>
            </div>
          )}
        </CTAContainer>

        {/* 개발용 컨트롤 (프로덕션에서는 숨김) */}
        {isDevMode && (
          <div className="fixed bottom-20 right-4 flex flex-col gap-2 z-50">
            {/* 다음 단계로 버튼 (모든 모드에서 표시) */}
            {routineSteps.length > 1 && (
              <Button
                onClick={handleNextStep}
                variant="secondary"
                size="sm"
                className="text-xs opacity-70 hover:opacity-100"
                disabled={currentStepIndex >= routineSteps.length - 1}
              >
                DEV: 다음 단계로 ({currentStepIndex + 1}/{routineSteps.length})
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

