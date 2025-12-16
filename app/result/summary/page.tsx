'use client'

import { useState } from 'react'
import AppLayout from '@/components/AppLayout'
import CTAContainer from '@/components/CTAContainer'
import Button from '@/components/Button'
import EmotionComparison from '@/components/EmotionComparison'
import SatisfactionSelector from '@/components/SatisfactionSelector'
import ReuseIntentionSelector from '@/components/ReuseIntentionSelector'
import SectionHeader from '@/components/SectionHeader'
import SectionBlock from '@/components/SectionBlock'

export default function SummaryPage() {
  // 로컬 상태 관리
  const [satisfaction, setSatisfaction] = useState<number | null>(null)
  const [reuseIntention, setReuseIntention] = useState<boolean | null>(null)
  const [submitted, setSubmitted] = useState(false)

  // Mock 데이터 (추후 전역 상태에서 가져올 예정)
  const beforeEmotion = 3
  const afterEmotion = 5

  // 다음 버튼 활성화 조건: 만족도와 재사용 의향 모두 선택 필수
  const isCompleteButtonEnabled =
    satisfaction !== null && reuseIntention !== null

  const handleComplete = () => {
    if (!satisfaction || reuseIntention === null) {
      setSubmitted(true)
      return
    }

    // TODO: 전역 상태에 저장
    // TODO: 세션 데이터 저장
    // TODO: 인트로 화면(/)으로 라우팅
    console.log('결과 저장:', {
      beforeEmotion,
      afterEmotion,
      satisfaction,
      reuseIntention,
    })
  }

  const shouldShowSatisfactionError = submitted && satisfaction === null
  const shouldShowReuseError = submitted && reuseIntention === null

  return (
    <AppLayout>
      <div className="flex flex-col min-h-[100svh]">
        {/* 상단: 요약 제목 */}
        <div className="px-6 pt-8 pb-6 border-b-2 border-gray-200">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">오늘의 루틴 요약</h1>
        </div>

        {/* 스크롤 가능한 콘텐츠 영역 */}
        <div className="px-6 py-6 space-y-8 pb-32">
          {/* 감정 변화 요약 */}
          <SectionBlock>
            <SectionHeader title="감정 변화" />
            <div className="pt-4">
              <EmotionComparison
                beforeScore={beforeEmotion}
                afterScore={afterEmotion}
                variant="number"
              />
            </div>
          </SectionBlock>

          {/* 만족도 점수 선택 */}
          <SectionBlock>
            <SectionHeader
              title="이번 루틴에 만족하셨나요?"
              description="만족도를 선택해주세요"
            />
            <div className="pt-4">
              <SatisfactionSelector
                value={satisfaction}
                onChange={setSatisfaction}
              />
              {shouldShowSatisfactionError && (
                <p className="text-center text-sm text-red-600 mt-4">
                  만족도를 선택해주세요
                </p>
              )}
            </div>
          </SectionBlock>

          {/* 재사용 의향 선택 */}
          <SectionBlock>
            <SectionHeader
              title="다시 사용하시겠어요?"
              description="재사용 의향을 선택해주세요"
            />
            <div className="pt-4">
              <ReuseIntentionSelector
                value={reuseIntention}
                onChange={setReuseIntention}
              />
              {shouldShowReuseError && (
                <p className="text-center text-sm text-red-600 mt-4">
                  재사용 의향을 선택해주세요
                </p>
              )}
            </div>
          </SectionBlock>
        </div>

        {/* 하단 CTA */}
        <CTAContainer>
          <Button
            onClick={handleComplete}
            disabled={!isCompleteButtonEnabled}
            variant="primary"
            size="lg"
            fullWidth
          >
            완료
          </Button>
        </CTAContainer>
      </div>
    </AppLayout>
  )
}

