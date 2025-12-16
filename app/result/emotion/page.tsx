'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import CTAContainer from '@/components/CTAContainer'
import Button from '@/components/Button'
import EmotionSelector from '@/components/EmotionSelector'

export default function AfterEmotionPage() {
  const router = useRouter()

  // 로컬 상태 관리
  const [afterEmotion, setAfterEmotion] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  // Mock 데이터: 루틴 전 감정 점수 (추후 전역 상태에서 가져올 예정)
  const beforeEmotion = 3 // 예시 값

  // 다음 버튼 활성화 조건: 감정 점수 선택 필수
  const isNextButtonEnabled = afterEmotion !== null

  const handleNext = () => {
    if (!afterEmotion) {
      setSubmitted(true)
      return
    }

    // TODO: 전역 상태에 저장
    router.push('/result/summary')
  }

  const shouldShowError = submitted && afterEmotion === null

  return (
    <AppLayout>
      <div className="flex flex-col min-h-[100svh]">
        {/* 상단: 질문 텍스트 */}
        <div className="px-6 pt-16 pb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
            지금 기분은 어떤가요?
          </h1>
          {/* 루틴 전 감정 점수 힌트 */}
          <p className="text-sm text-gray-500 mt-3">
            이전: {beforeEmotion}점
          </p>
        </div>

        {/* 중앙: 감정 점수 선택 */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-32">
          <div className="w-full max-w-md">
            <EmotionSelector
              value={afterEmotion}
              onChange={setAfterEmotion}
              showLabels={true}
            />
            {shouldShowError && (
              <p className="text-center text-sm text-red-600 mt-4">
                감정 점수를 선택해주세요
              </p>
            )}
          </div>
        </div>

        {/* 하단 CTA */}
        <CTAContainer>
          <Button
            onClick={handleNext}
            disabled={!isNextButtonEnabled}
            variant="primary"
            size="lg"
            fullWidth
          >
            결과 보기
          </Button>
        </CTAContainer>
      </div>
    </AppLayout>
  )
}

