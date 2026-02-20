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
      <div className="flex flex-col min-h-[100svh] pt-12 sm:pt-16">
        {/* 상단 절반: 음성 가이드 토글 */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 min-h-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight font-heading text-center mb-10 sm:mb-12">
            음성 가이드를 들으시겠어요?
          </h1>
          <div className="w-full max-w-sm mx-auto mt-2">
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

        {/* 하단 절반: 팁 박스 */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-24 min-h-0">
          <div className="w-full max-w-sm mx-auto px-4 py-4 sm:py-5 bg-[#F5F4F0] rounded-xl border border-[#CDCAC3]">
            <p className="text-base sm:text-lg font-semibold text-[#333333] mb-3">
              💡 Tip
            </p>
            <p className="text-base sm:text-lg text-[#333333] leading-relaxed">
              루틴을 진행하는 도중 딴생각이 들어도 괜찮아요. 그런 나를 그저 조용히 알아차리고, 생각이 흘러가도록 가만히 지켜보세요. 온전히 나에게만 집중하는 가장 편안한 시간이 되기를 바랍니다.
            </p>
          </div>
        </div>

        <CTAContainer>
          <Button onClick={handleStart} variant="primary" size="lg" fullWidth>
            루틴 시작
          </Button>
        </CTAContainer>
      </div>
    </AppLayout>
  )
}

