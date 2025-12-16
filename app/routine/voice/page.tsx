'use client'

import { useState } from 'react'
import AppLayout from '@/components/AppLayout'
import CTAContainer from '@/components/CTAContainer'
import Button from '@/components/Button'
import Toggle from '@/components/Toggle'

export default function VoiceGuidePage() {
  // 로컬 상태 관리
  const [voiceGuideEnabled, setVoiceGuideEnabled] = useState<boolean>(true) // 기본값: On (권장)

  const handleStart = () => {
    // TODO: 전역 상태에 저장
    // TODO: 루틴 진행 화면(/routine)으로 라우팅
    console.log('루틴 시작:', {
      voiceGuideEnabled,
    })
  }

  return (
    <AppLayout>
      <div className="flex flex-col min-h-[100svh]">
        {/* 상단: 질문 텍스트 */}
        <div className="px-6 pt-16 pb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
            음성 가이드를 들으시겠어요?
          </h1>
        </div>

        {/* 중앙: On/Off 토글 */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-32">
          <div className="w-full max-w-sm">
            <Toggle
              value={voiceGuideEnabled}
              onChange={setVoiceGuideEnabled}
              size="lg"
            />
            <p className="text-center text-sm text-gray-500 mt-4">
              {voiceGuideEnabled
                ? '음성 가이드가 재생됩니다'
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

