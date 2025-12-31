'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import CTAContainer from '@/components/CTAContainer'
import Button from '@/components/Button'
import EmotionComparison from '@/components/EmotionComparison'
import SatisfactionSelector from '@/components/SatisfactionSelector'
import ReuseIntentionSelector from '@/components/ReuseIntentionSelector'
import SectionHeader from '@/components/SectionHeader'
import SectionBlock from '@/components/SectionBlock'
import { useSessionStore } from '@/stores/sessionStore'
import { createSession } from '@/lib/api/sessions'

export default function SummaryContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isAborted = searchParams.get('aborted') === '1'

  // Zustand 스토어에서 상태 가져오기
  const beforeEmotion = useSessionStore((state) => state.beforeEmotion)
  const afterEmotion = useSessionStore((state) => state.afterEmotion)
  const bgmId = useSessionStore((state) => state.bgmId)
  const routineMode = useSessionStore((state) => state.routineMode)
  const selectedSteps = useSessionStore((state) => state.selectedSteps)
  const voiceGuideEnabled = useSessionStore((state) => state.voiceGuideEnabled)
  const satisfaction = useSessionStore((state) => state.satisfaction)
  const reuseIntention = useSessionStore((state) => state.reuseIntention)
  const setSatisfaction = useSessionStore((state) => state.setSatisfaction)
  const setReuseIntention = useSessionStore((state) => state.setReuseIntention)

  // 로컬 UI 상태
  const [submitted, setSubmitted] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // 다음 버튼 활성화 조건: 만족도와 재사용 의향 모두 선택 필수
  const isCompleteButtonEnabled =
    satisfaction !== null && reuseIntention !== null

  useEffect(() => {
    // TODO: aborted 상태에 따라 UI를 다르게 표시하거나 처리
    if (isAborted) {
      // 중단된 세션 처리
      console.log('루틴이 중단되었습니다')
    }
  }, [isAborted])

  const handleComplete = async () => {
    if (!satisfaction || reuseIntention === null) {
      setSubmitted(true)
      return
    }

    // 저장 중 상태로 변경
    setIsSaving(true)

    try {
      // 세션 데이터 준비
      const sessionData = {
        before_emotion: beforeEmotion ?? undefined,
        after_emotion: afterEmotion ?? undefined,
        bgm_id: bgmId ?? undefined,
        routine_mode: routineMode,
        selected_steps: selectedSteps.length > 0 ? selectedSteps : undefined,
        voice_guide_enabled: voiceGuideEnabled,
        satisfaction: satisfaction ?? undefined,
        reuse_intention: reuseIntention ?? undefined,
        status: isAborted ? ('aborted' as const) : ('completed' as const),
        completed_at: new Date().toISOString(),
      }

      // 세션 데이터 저장
      await createSession(sessionData)

      // 성공 시 감사 페이지로 이동
      router.push('/thank-you')
    } catch (error) {
      // 에러 발생 시 콘솔에 출력
      console.error('세션 저장 실패:', error)
      setIsSaving(false)
      // 에러가 발생해도 사용자에게는 계속 진행할 수 있도록 처리
      // 필요시 에러 메시지를 표시하거나 재시도 로직 추가 가능
    }
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
          {/* 중단된 세션 안내 메시지 */}
          {isAborted && (
            <div className="bg-gray-100 rounded-lg px-4 py-3 text-center">
              <p className="text-sm text-gray-700">
                ⚠ 루틴이 중단되었습니다. 결과는 저장되지 않습니다.
              </p>
            </div>
          )}

          {/* 감정 변화 요약 */}
          {beforeEmotion !== null && afterEmotion !== null && (
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
          )}

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
            disabled={!isCompleteButtonEnabled || isSaving}
            variant="primary"
            size="lg"
            fullWidth
          >
            {isSaving ? '저장 중...' : '완료'}
          </Button>
        </CTAContainer>
      </div>
    </AppLayout>
  )
}

