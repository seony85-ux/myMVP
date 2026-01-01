'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import CTAContainer from '@/components/CTAContainer'
import Button from '@/components/Button'
import StepHeader from '@/components/StepHeader'
import MeditationText from '@/components/MeditationText'
import ProgressIndicator from '@/components/ProgressIndicator'
import AudioManager, { AudioManagerRef } from '@/components/AudioManager'
import { useSessionStore } from '@/stores/sessionStore'

// BGM 이름 매핑 (setup 페이지와 동일)
const BGM_NAMES: Record<string, string> = {
  bgm2: '명상 음악',
  bgm3: '바다의 파도',
  none: '없음',
}

// 루틴 단계 타입 정의
interface RoutineStep {
  id: string
  text: string
  audio_url: string
  silenceAfter: number // ms 단위
}

// 10단계 루틴 구성
const ROUTINE_STEPS: RoutineStep[] = [
  { id: 'intro1', text: '지금 이 순간, 나에게 집중해보세요.', audio_url: '', silenceAfter: 0 },
  { id: 'intro2', text: '천천히 숨을 들이쉬고 내쉬어보세요.', audio_url: '', silenceAfter: 0 },
  { id: 'toner1', text: '지금 이 순간, 토너에 집중해보세요.', audio_url: '', silenceAfter: 0 },
  { id: 'toner2', text: '토너를 부드럽게 펴발라주세요.', audio_url: '', silenceAfter: 0 },
  { id: 'essence1', text: '지금 이 순간, 에센스에 집중해보세요.', audio_url: '', silenceAfter: 0 },
  { id: 'essence2', text: '에센스를 가볍게 두드려 흡수시켜주세요.', audio_url: '', silenceAfter: 0 },
  { id: 'cream1', text: '지금 이 순간, 크림에 집중해보세요.', audio_url: '', silenceAfter: 0 },
  { id: 'cream2', text: '크림을 부드럽게 마사지하며 발라주세요.', audio_url: '', silenceAfter: 0 },
  { id: 'finish1', text: '오늘 하루도 수고하셨어요.', audio_url: '', silenceAfter: 0 },
  { id: 'finish2', text: '당신의 피부가 건강하게 빛나기를 바랍니다.', audio_url: '', silenceAfter: 0 },
]

// 진행 단계 UI 매핑 (5단계)
const STEP_UI_NAMES = ['시작', '토너', '에센스', '크림', '마무리']

// BGM URL 생성 함수 (bgmId 기반)
const getBgmUrl = (bgmId: string | null): string | undefined => {
  if (!bgmId || bgmId === 'none') return undefined
  
  // BGM ID에 따른 URL 매핑
  const bgmUrlMap: Record<string, string> = {
    bgm2: 'https://iuuzjngznrlivozmoftc.supabase.co/storage/v1/object/public/bgm/piano.mp3',
    bgm3: 'https://iuuzjngznrlivozmoftc.supabase.co/storage/v1/object/public/bgm/waves.mp3',
  }
  
  return bgmUrlMap[bgmId]
}

export default function RoutinePlayContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Zustand 스토어에서 상태 가져오기
  const bgmId = useSessionStore((state) => state.bgmId)
  
  // 개발 모드 상태: 초기값은 false
  const [isDevMode, setIsDevMode] = useState(false)
  
  // useEffect에서 dev 쿼리 파라미터 확인
  useEffect(() => {
    const devParam = searchParams.get('dev')
    setIsDevMode(devParam === '1')
  }, [searchParams])

  // 현재 진행 중인 단계 인덱스 관리 (초기값: 0)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  
  // 침묵 시간 대기 상태 관리
  const [isSilentWaiting, setIsSilentWaiting] = useState(false)
  
  // 음성 재생 중 상태 관리
  const [isVoicePlaying, setIsVoicePlaying] = useState(false)
  
  // 중단 상태 관리
  const [isAborted, setIsAborted] = useState(false)
  
  // 일시중지 상태 관리
  const [isPaused, setIsPaused] = useState(false)
  
  // 침묵 시간 타이머 ref
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null)
  
  // AudioManager ref
  const audioManagerRef = useRef<AudioManagerRef>(null)

  // 현재 단계
  const currentStep = useMemo(() => {
    return ROUTINE_STEPS[currentStepIndex] || ROUTINE_STEPS[0]
  }, [currentStepIndex])

  // BGM URL
  const bgmUrl = useMemo(() => {
    return getBgmUrl(bgmId)
  }, [bgmId])

  // 현재 단계의 음성 URL
  const voiceUrl = useMemo(() => {
    return currentStep.audio_url || undefined
  }, [currentStep])

  // 진행 단계 UI 인덱스 (0~4, 5단계)
  const uiStepIndex = useMemo(() => {
    return Math.floor(currentStepIndex / 2)
  }, [currentStepIndex])

  // 현재 단계명 표시용
  const currentStepName = useMemo(() => {
    return STEP_UI_NAMES[uiStepIndex] || '시작'
  }, [uiStepIndex])

  // 완료된 단계 인덱스 배열 (UI 기준)
  const completedSteps = useMemo(() => {
    return Array.from({ length: uiStepIndex }, (_, i) => i)
  }, [uiStepIndex])

  // 표시할 메시지 텍스트
  const displayText = useMemo(() => {
    if (isSilentWaiting) {
      return '잠시 집중해보세요...'
    }
    return currentStep.text
  }, [isSilentWaiting, currentStep.text])

  // 마지막 단계인지 확인
  const isLastStep = useMemo(() => {
    return currentStepIndex >= ROUTINE_STEPS.length - 1
  }, [currentStepIndex])

  // BGM 이름 가져오기
  const bgmName = useMemo(() => {
    return bgmId ? (BGM_NAMES[bgmId] || '알 수 없음') : '없음'
  }, [bgmId])

  // 중단 핸들러
  const handleStop = useCallback(() => {
    const confirmed = window.confirm('정말 루틴을 중단하시겠어요?')
    
    if (!confirmed) {
      return
    }

    setIsAborted(true)
    audioManagerRef.current?.pause()
    router.push('/result/summary?aborted=1')
  }, [router])

  // 일시중지 핸들러
  const handlePause = useCallback(() => {
    setIsPaused(true)
    audioManagerRef.current?.pause()
  }, [])

  // 재개 핸들러
  const handleResume = useCallback(() => {
    setIsPaused(false)
    audioManagerRef.current?.play()
  }, [])

  // 끝내기 핸들러
  const handleComplete = useCallback(() => {
    audioManagerRef.current?.pause()
    router.push('/result/emotion')
  }, [router])

  // 다음 단계로 이동
  const handleNextStep = useCallback(() => {
    if (currentStepIndex < ROUTINE_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1)
    }
  }, [currentStepIndex])

  // 음성 재생 완료 핸들러
  const onVoiceEnded = useCallback(() => {
    setIsVoicePlaying(false)
    const silenceAfter = currentStep.silenceAfter
    
    // 기존 타이머 정리
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }
    
    if (silenceAfter > 0) {
      // 침묵 시간 대기 시작
      setIsSilentWaiting(true)
      
      // 침묵 시간 후 다음 단계로 이동
      silenceTimerRef.current = setTimeout(() => {
        setIsSilentWaiting(false)
        silenceTimerRef.current = null
        if (currentStepIndex < ROUTINE_STEPS.length - 1) {
          setCurrentStepIndex((prev) => prev + 1)
        }
      }, silenceAfter)
    } else {
      // 침묵 시간이 없으면 즉시 다음 단계로 이동
      if (currentStepIndex < ROUTINE_STEPS.length - 1) {
        setCurrentStepIndex((prev) => prev + 1)
      }
    }
  }, [currentStep, currentStepIndex])
  
  // 중단/일시중지 시 타이머 정리
  useEffect(() => {
    if (isAborted || isPaused) {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
        silenceTimerRef.current = null
      }
    }
  }, [isAborted, isPaused])
  
  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
      }
    }
  }, [])

  // 단계 변경 시 음성 재생 시작
  useEffect(() => {
    if (isAborted || isPaused) {
      return
    }

    if (isLastStep) {
      return
    }

    // 음성 재생 시작
    if (voiceUrl) {
      setIsVoicePlaying(true)
      setIsSilentWaiting(false)
      
      // AudioManager가 재생을 시작하도록 play 호출
      // playVoice가 true이므로 음성이 재생됨
      audioManagerRef.current?.play()
    } else {
      // audio_url이 없으면 즉시 다음 단계로
      const timer = setTimeout(() => {
        if (currentStepIndex < ROUTINE_STEPS.length - 1) {
          setCurrentStepIndex((prev) => prev + 1)
        }
      }, 1000) // 1초 후 다음 단계로
      
      return () => {
        clearTimeout(timer)
      }
    }
  }, [currentStepIndex, voiceUrl, isAborted, isPaused, isLastStep])

  // 컴포넌트 마운트 시 BGM 시작
  useEffect(() => {
    if (bgmUrl && !isAborted && !isPaused) {
      audioManagerRef.current?.play()
    }
  }, [bgmUrl, isAborted, isPaused])

  // 일시중지/재개 시 오디오 제어
  useEffect(() => {
    if (isPaused) {
      audioManagerRef.current?.pause()
    } else if (!isAborted) {
      audioManagerRef.current?.play()
    }
  }, [isPaused, isAborted])

  // 개발용 핸들러
  const handleDevComplete = useCallback(() => {
    router.push('/result/emotion')
  }, [router])

  const handleDevAbort = useCallback(() => {
    router.push('/result/summary?aborted=1')
  }, [router])

  const handleTestSilence = useCallback(() => {
    setIsSilentWaiting(true)
    setTimeout(() => {
      setIsSilentWaiting(false)
    }, 3000)
  }, [])

  return (
    <AppLayout>
      <div className="flex flex-col min-h-[100svh]">
        {/* AudioManager 컴포넌트 */}
        <AudioManager
          ref={audioManagerRef}
          bgmUrl={bgmUrl}
          voiceUrl={voiceUrl}
          playVoice={true}
          onVoiceEnded={onVoiceEnded}
        />

        {/* 우측 상단: 설정 상태 표시 (dev 모드에서만 표시) */}
        {isDevMode && (
          <div className="absolute top-4 right-4 text-xs sm:text-sm text-gray-600 space-y-1 z-10">
            <div>BGM: {bgmName}</div>
            <div>현재 단계: {currentStepIndex + 1}/10</div>
            <div>UI 단계: {uiStepIndex + 1}/5</div>
          </div>
        )}

        {/* 상단: 현재 단계명 */}
        <StepHeader
          stepName={currentStepName}
          stepNumber={uiStepIndex + 1}
          totalSteps={STEP_UI_NAMES.length}
        />

        {/* 진행 상태 시각화 */}
        <ProgressIndicator
          steps={STEP_UI_NAMES}
          currentStep={uiStepIndex}
          completedSteps={completedSteps}
          variant="dots"
        />

        {/* 중앙: 현재 명상 문장 */}
        <div className="flex-1 flex items-center justify-center px-6 pb-32 relative">
          <MeditationText text={displayText} animate={false} />
          
          {/* 침묵 시간 대기 오버레이 */}
          {isSilentWaiting && (
            <div className="absolute inset-0 bottom-32 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10 transition-opacity duration-300 opacity-100">
              <p className="text-white text-lg sm:text-xl font-medium">
                잠시 집중해보세요...
              </p>
            </div>
          )}
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
            <Button
              onClick={handleNextStep}
              variant="secondary"
              size="sm"
              className="text-xs opacity-70 hover:opacity-100"
              disabled={currentStepIndex >= ROUTINE_STEPS.length - 1}
            >
              DEV: 다음 단계로 ({currentStepIndex + 1}/{ROUTINE_STEPS.length})
            </Button>
            <Button
              onClick={handleTestSilence}
              variant="secondary"
              size="sm"
              className="text-xs opacity-70 hover:opacity-100"
              disabled={isSilentWaiting}
            >
              DEV: 침묵 시간 테스트
            </Button>
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
