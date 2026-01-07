'use client'

import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import CTAContainer from '@/components/CTAContainer'
import Button from '@/components/Button'
import ToggleSwitch from '@/components/ToggleSwitch'
import { useSessionStore } from '@/stores/sessionStore'

export default function VoiceGuidePage() {
  const router = useRouter()

  // Zustand 스토어에서 상태 가져오기
  const voiceGuideEnabled = useSessionStore((state) => state.voiceGuideEnabled)
  const setVoiceGuideEnabled = useSessionStore((state) => state.setVoiceGuideEnabled)

  const handleStart = () => {
    router.push('/routine/play')
  }

  return (
    <AppLayout>
      <div className="flex flex-col min-h-[100svh]">
        {/* 상단: 질문 텍스트 */}
        <div className="px-6 pt-16 pb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight font-heading">
            음성 가이드를 들으시겠어요?
          </h1>
        </div>

        {/* 중앙: On/Off 토글 */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-32">
          <div className="w-full max-w-sm">
            <ToggleSwitch
              value={voiceGuideEnabled}
              onChange={setVoiceGuideEnabled}
              size="lg"
              ariaLabel="음성 가이드"
            />
            <p className="text-center text-base sm:text-lg text-gray-500 mt-4">
              {voiceGuideEnabled
                ? '음성과 텍스트 가이드가 같이 재생됩니다.'
                : '텍스트 가이드만 표시됩니다'}
            </p>
          </div>
        </div>

        {/* 하단 CTA */}
        <CTAContainer>
          <Button onClick={handleStart} variant="primary" size="lg" fullWidth>
            루틴 시작
          </Button>
        </CTAContainer>
      </div>
    </AppLayout>
  )
}

