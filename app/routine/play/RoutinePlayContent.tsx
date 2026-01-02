'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import CTAContainer from '@/components/CTAContainer'
import Button from '@/components/Button'
import StepHeader from '@/components/StepHeader'
import MeditationText from '@/components/MeditationText'
import ProgressIndicator from '@/components/ProgressIndicator'
import AudioManager, { AudioManagerRef } from '@/components/AudioManager'
import { useSessionStore } from '@/stores/sessionStore'


// 루틴 단계 타입 정의
interface RoutineStep {
  id: string
  text: string
  audio_url: string
  silenceAfter: number // ms 단위
}

// Supabase에서 가져온 음성 가이드 데이터 타입
interface VoiceGuideData {
  step_id: string
  audio_url: string
  silence_after: number
  order_index: number
}

// Supabase에서 가져온 BGM 데이터 타입
interface BgmData {
  id: string
  name: string
  description: string | null
  audio_url: string
  image_url: string | null
}

// 텍스트는 하드코딩 유지 (Supabase에서 관리하지 않음)
const STEP_TEXTS: Record<string, string> = {
  intro1: '지금 이 순간, 나에게 집중해보세요.',
  intro2: '천천히 숨을 들이쉬고 내쉬어보세요.',
  toner1: '지금 이 순간, 토너에 집중해보세요.',
  toner2: '토너를 부드럽게 펴발라주세요.',
  essence1: '지금 이 순간, 에센스에 집중해보세요.',
  essence2: '에센스를 가볍게 두드려 흡수시켜주세요.',
  cream1: '지금 이 순간, 크림에 집중해보세요.',
  cream2: '크림을 부드럽게 마사지하며 발라주세요.',
  finish1: '오늘 하루도 수고하셨어요.',
  finish2: '당신의 피부가 건강하게 빛나기를 바랍니다.',
}

// 자율 모드 텍스트 (basic 모드에서 중간 단계)
const AUTONOMOUS_TEXT = '자유롭게 스킨케어를 진행해보세요.'

// 자율 모드 시간 설정 (밀리초 단위)
// ⚙️ 시간 설정 위치: 아래 AUTONOMOUS_DURATION 값을 변경하세요
// 예: 5000 = 5초, 60000 = 1분, 120000 = 2분
const AUTONOMOUS_DURATION = 5000 // 테스트용: 5초

// 진행 단계 UI 매핑은 모드별로 동적으로 생성됨


export default function RoutinePlayContent() {
  const router = useRouter()
  
  // Zustand 스토어에서 상태 가져오기
  const bgmId = useSessionStore((state) => state.bgmId)
  const routineMode = useSessionStore((state) => state.routineMode)
  const voiceGuideEnabled = useSessionStore((state) => state.voiceGuideEnabled)
  const selectedSteps = useSessionStore((state) => state.selectedSteps)

  // 현재 진행 중인 단계 인덱스 관리 (초기값: 0)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  
  // Supabase에서 가져온 음성 가이드 데이터
  const [voiceGuides, setVoiceGuides] = useState<VoiceGuideData[]>([])
  const [isLoadingVoiceGuides, setIsLoadingVoiceGuides] = useState(true)
  
  // Supabase에서 가져온 BGM 데이터
  const [bgms, setBgms] = useState<BgmData[]>([])
  const [isLoadingBgms, setIsLoadingBgms] = useState(true)
  
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

  // Supabase에서 음성 가이드 데이터 가져오기
  useEffect(() => {
    const fetchVoiceGuides = async () => {
      try {
        setIsLoadingVoiceGuides(true)
        const response = await fetch('/api/voice-guides')
        
        if (!response.ok) {
          throw new Error(`Failed to fetch voice guides: ${response.status}`)
        }
        
        const result = await response.json()
        const guides = result.data || []
        
        // audio_url 유효성 검증 및 로깅
        const validatedGuides = guides.map((guide: VoiceGuideData) => {
          const audioUrl = guide.audio_url
          
          // null, undefined, 빈 문자열 체크
          if (!audioUrl || audioUrl.trim() === '') {
            console.warn(`[RoutinePlayContent] audio_url이 비어있음: step_id=${guide.step_id}`)
            return guide
          }
          
          // URL 형식 검증
          if (!audioUrl.startsWith('https://') && !audioUrl.startsWith('http://')) {
            console.warn(`[RoutinePlayContent] 잘못된 URL 형식: step_id=${guide.step_id}, url=${audioUrl}`)
            return guide
          }
          
          return guide
        })
        
        setVoiceGuides(validatedGuides)
      } catch (error) {
        console.error('음성 가이드 데이터 로드 실패:', error)
        // 에러 발생 시 빈 배열로 설정
        setVoiceGuides([])
      } finally {
        setIsLoadingVoiceGuides(false)
      }
    }

    fetchVoiceGuides()
  }, [])

  // Supabase에서 BGM 데이터 가져오기
  useEffect(() => {
    const fetchBgms = async () => {
      try {
        setIsLoadingBgms(true)
        const response = await fetch('/api/bgms')
        
        if (!response.ok) {
          throw new Error(`Failed to fetch bgms: ${response.status}`)
        }
        
        const result = await response.json()
        setBgms(result.data || [])
      } catch (error) {
        console.error('BGM 데이터 로드 실패:', error)
        // 에러 발생 시 빈 배열로 설정
        setBgms([])
      } finally {
        setIsLoadingBgms(false)
      }
    }

    fetchBgms()
  }, [])

  // Supabase 데이터와 하드코딩된 텍스트를 결합한 루틴 단계 배열
  const routineSteps = useMemo(() => {
    if (voiceGuides.length === 0) {
      // 데이터가 없을 때는 빈 배열 반환 (로딩 중)
      return []
    }

    let filteredGuides = voiceGuides

    // basic 모드일 때는 intro1, intro2, finish1, finish2만 포함
    if (routineMode === 'basic') {
      filteredGuides = voiceGuides.filter((guide) => 
        ['intro1', 'intro2', 'finish1', 'finish2'].includes(guide.step_id)
      )
      
      // intro2와 finish1 사이에 자율 단계 추가
      const steps = filteredGuides.map((guide) => ({
        id: guide.step_id,
        text: STEP_TEXTS[guide.step_id] || '',
        audio_url: guide.audio_url,
        silenceAfter: guide.silence_after,
      }))
      
      // intro2 다음에 자율 단계 추가
      const intro2Index = steps.findIndex((s) => s.id === 'intro2')
      if (intro2Index !== -1) {
        steps.splice(intro2Index + 1, 0, {
          id: 'autonomous',
          text: AUTONOMOUS_TEXT,
          audio_url: '', // 자율 모드는 음성 가이드 없음
          silenceAfter: AUTONOMOUS_DURATION, // 자율 모드 지속 시간 (자동 진행)
        })
      }
      
      return steps
    }

    // detailed 모드일 때는 selectedSteps에 따라 필터링
    if (routineMode === 'detailed') {
      // 항상 포함되는 단계: intro1, intro2, finish1, finish2
      const alwaysIncluded = ['intro1', 'intro2', 'finish1', 'finish2']
      
      // selectedSteps를 기반으로 포함할 step_id 패턴 생성
      // 'toner' -> 'toner1', 'toner2'
      // 'essence' -> 'essence1', 'essence2'
      // 'cream' -> 'cream1', 'cream2'
      const stepPatterns: string[] = []
      selectedSteps.forEach((step) => {
        if (step === 'toner') {
          stepPatterns.push('toner1', 'toner2')
        } else if (step === 'essence') {
          stepPatterns.push('essence1', 'essence2')
        } else if (step === 'cream') {
          stepPatterns.push('cream1', 'cream2')
        }
      })
      
      // 필터링: alwaysIncluded + stepPatterns에 포함된 것만
      filteredGuides = voiceGuides.filter((guide) => 
        alwaysIncluded.includes(guide.step_id) || stepPatterns.includes(guide.step_id)
      )
    }

    return filteredGuides.map((guide) => ({
      id: guide.step_id,
      text: STEP_TEXTS[guide.step_id] || '',
      audio_url: guide.audio_url,
      silenceAfter: guide.silence_after,
    }))
  }, [voiceGuides, routineMode, selectedSteps])

  // 현재 단계
  const currentStep = useMemo(() => {
    if (routineSteps.length === 0) {
      // 기본값 반환
      return { id: 'intro1', text: '', audio_url: '', silenceAfter: 0 }
    }
    return routineSteps[currentStepIndex] || routineSteps[0]
  }, [currentStepIndex, routineSteps])

  // BGM URL (Supabase에서 가져온 데이터 사용)
  const bgmUrl = useMemo(() => {
    if (!bgmId || bgmId === 'none') return undefined
    
    const bgm = bgms.find((b) => b.id === bgmId)
    return bgm?.audio_url || undefined
  }, [bgmId, bgms])

  // 현재 단계의 음성 URL
  const voiceUrl = useMemo(() => {
    return currentStep.audio_url || undefined
  }, [currentStep])

  // UI 단계 이름 배열 (모드별로 다름)
  const stepUiNames = useMemo(() => {
    if (routineMode === 'basic') {
      return ['시작', '자율', '마무리']
    } else {
      // detailed 모드: selectedSteps 기반으로 동적 생성
      const stepLabels: Record<string, string> = {
        'toner': '토너',
        'essence': '에센스',
        'cream': '크림',
      }
      
      // 항상 시작과 마무리 포함
      const names: string[] = ['시작']
      
      // selectedSteps 순서대로 추가
      selectedSteps.forEach((step) => {
        if (stepLabels[step]) {
          names.push(stepLabels[step])
        }
      })
      
      names.push('마무리')
      return names
    }
  }, [routineMode, selectedSteps])

  // 진행 단계 UI 인덱스 계산
  const uiStepIndex = useMemo(() => {
    if (routineMode === 'basic') {
      // basic 모드: intro1(0), intro2(1), autonomous(2), finish1(3), finish2(4)
      // 시작(0): intro1, intro2 (0-1)
      // 자율(1): autonomous (2)
      // 마무리(2): finish1, finish2 (3-4)
      if (currentStepIndex < 2) return 0 // 시작 (intro1, intro2)
      if (currentStepIndex === 2) return 1 // 자율 (autonomous)
      return 2 // 마무리 (finish1, finish2)
    } else {
      // detailed 모드: routineSteps의 실제 구조에 맞게 계산
      // routineSteps 구조: [intro1, intro2, ...선택된단계들(각 2개), finish1, finish2]
      // stepUiNames 구조: ['시작', ...선택된단계이름들, '마무리']
      // currentStepIndex 0-1 -> uiStepIndex 0 (시작)
      // currentStepIndex 2-3 -> uiStepIndex 1 (첫 번째 선택된 단계)
      // currentStepIndex 4-5 -> uiStepIndex 2 (두 번째 선택된 단계)
      // ... 마지막 2개 -> uiStepIndex 마지막 (마무리)
      
      const currentStep = routineSteps[currentStepIndex]
      if (!currentStep) return 0
      
      // intro 단계 (0-1) -> 시작 (0)
      if (currentStep.id === 'intro1' || currentStep.id === 'intro2') {
        return 0
      }
      
      // finish 단계 (마지막 2개) -> 마무리 (마지막)
      if (currentStep.id === 'finish1' || currentStep.id === 'finish2') {
        return stepUiNames.length - 1
      }
      
      // 중간 단계들: intro 다음부터 finish 전까지
      // intro는 인덱스 0-1 (2개), 각 선택된 단계는 2개씩
      // (currentStepIndex - 2) / 2 + 1 = UI 인덱스
      const middleStepIndex = Math.floor((currentStepIndex - 2) / 2) + 1
      return Math.min(middleStepIndex, stepUiNames.length - 1)
    }
  }, [currentStepIndex, routineMode, routineSteps, stepUiNames.length])

  // 현재 단계명 표시용
  const currentStepName = useMemo(() => {
    return stepUiNames[uiStepIndex] || '시작'
  }, [uiStepIndex, stepUiNames])

  // 완료된 단계 인덱스 배열 (UI 기준)
  const completedSteps = useMemo(() => {
    return Array.from({ length: uiStepIndex }, (_, i) => i)
  }, [uiStepIndex])


  // 표시할 메시지 텍스트
  const displayText = useMemo(() => {
    return currentStep.text
  }, [currentStep.text])

  // 마지막 단계인지 확인
  const isLastStep = useMemo(() => {
    return routineSteps.length > 0 && currentStepIndex >= routineSteps.length - 1
  }, [currentStepIndex, routineSteps.length])

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

  // 음성 재생 완료 핸들러
  const onVoiceEnded = useCallback(() => {
    setIsVoicePlaying(false)
    
    // 현재 단계 정보 가져오기
    const step = routineSteps[currentStepIndex]
    if (!step) return
    
    const silenceAfter = step.silenceAfter
    
    // 기존 타이머 정리
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }
    
    if (silenceAfter > 0) {
      // 침묵 시간 후 다음 단계로 이동
      silenceTimerRef.current = setTimeout(() => {
        silenceTimerRef.current = null
        if (routineSteps.length > 0 && currentStepIndex < routineSteps.length - 1) {
          setCurrentStepIndex((prev) => prev + 1)
        }
      }, silenceAfter)
    } else {
      // 침묵 시간이 없으면 즉시 다음 단계로 이동
      if (routineSteps.length > 0 && currentStepIndex < routineSteps.length - 1) {
        setCurrentStepIndex((prev) => prev + 1)
      }
    }
  }, [currentStepIndex, routineSteps])
  
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
    // 데이터가 로드되지 않았거나 없으면 실행하지 않음
    if (routineSteps.length === 0) {
      return
    }

    if (isAborted || isPaused) {
      return
    }

    if (isLastStep) {
      return
    }

    // 현재 단계 정보 가져오기
    const step = routineSteps[currentStepIndex]
    if (!step) return

    // 음성 재생 시작
    if (step.audio_url) {
      setIsVoicePlaying(true)
      
      // 타이머 정리용 배열
      const timers: NodeJS.Timeout[] = []
      
      // intro1일 경우 2초 지연 후 재생
      if (step.id === 'intro1') {
        const playTimer = setTimeout(() => {
          audioManagerRef.current?.play()
        }, 2000)
        timers.push(playTimer)
      } else {
        // AudioManager가 재생을 시작하도록 play 호출
        audioManagerRef.current?.play()
      }
      
      // 음성 off일 때는 onVoiceEnded가 호출되지 않으므로, 타임아웃으로 다음 단계 진행
      if (!voiceGuideEnabled) {
        // 음성 off일 때는 기본 대기 시간(3초) + 침묵 시간 후 다음 단계로 진행
        const waitTime = 3000 + (step.silenceAfter || 0)
        const waitTimer = setTimeout(() => {
          if (routineSteps.length > 0 && currentStepIndex < routineSteps.length - 1) {
            setCurrentStepIndex((prev) => prev + 1)
          }
        }, waitTime)
        timers.push(waitTimer)
      }
      
      // cleanup 함수 반환
      if (timers.length > 0) {
        return () => {
          timers.forEach(timer => clearTimeout(timer))
        }
      }
    } else {
      // audio_url이 없으면 (자율 모드 등) 자동으로 다음 단계로 진행
      if (step.id === 'autonomous') {
        // 자율 모드는 설정된 시간(AUTONOMOUS_DURATION) 후 자동으로 다음 단계로 진행
        const timer = setTimeout(() => {
          if (routineSteps.length > 0 && currentStepIndex < routineSteps.length - 1) {
            setCurrentStepIndex((prev) => prev + 1)
          }
        }, step.silenceAfter || AUTONOMOUS_DURATION)
        
        return () => {
          clearTimeout(timer)
        }
      }
      
      // 그 외의 경우 (audio_url이 없는 다른 단계) 1초 후 다음 단계로
      const timer = setTimeout(() => {
        if (routineSteps.length > 0 && currentStepIndex < routineSteps.length - 1) {
          setCurrentStepIndex((prev) => prev + 1)
        }
      }, 1000) // 1초 후 다음 단계로
      
      return () => {
        clearTimeout(timer)
      }
    }
  }, [currentStepIndex, isAborted, isPaused, isLastStep, routineSteps, voiceGuideEnabled])

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

  // 로딩 중일 때 표시
  if (isLoadingVoiceGuides || isLoadingBgms) {
    return (
      <AppLayout>
        <div className="flex flex-col min-h-[100svh] items-center justify-center">
          <p className="text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </AppLayout>
    )
  }

  // 데이터가 없을 때 표시
  if (routineSteps.length === 0) {
    return (
      <AppLayout>
        <div className="flex flex-col min-h-[100svh] items-center justify-center">
          <p className="text-gray-600">음성 가이드 데이터를 불러올 수 없습니다.</p>
          <Button
            onClick={() => router.push('/routine/setup')}
            variant="primary"
            size="lg"
            className="mt-4"
          >
            다시 시작하기
          </Button>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="flex flex-col min-h-[100svh]">
        {/* AudioManager 컴포넌트 */}
        <AudioManager
          ref={audioManagerRef}
          bgmUrl={bgmUrl}
          voiceUrl={voiceUrl}
          playVoice={voiceGuideEnabled}
          onVoiceEnded={onVoiceEnded}
        />

        {/* 상단: 현재 단계명 */}
        <StepHeader
          stepName={currentStepName}
          stepNumber={uiStepIndex + 1}
          totalSteps={stepUiNames.length}
        />

        {/* 진행 상태 시각화 */}
        <ProgressIndicator
          steps={stepUiNames}
          currentStep={uiStepIndex}
          completedSteps={completedSteps}
          variant="dots"
        />

        {/* 중앙: 현재 명상 문장 */}
        <div className="flex-1 flex items-center justify-center px-6 pb-32 relative">
          <MeditationText text={displayText} animate={false} />
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
      </div>
    </AppLayout>
  )
}
