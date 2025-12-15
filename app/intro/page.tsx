'use client'

import AppLayout from '@/components/AppLayout'
import CTAContainer from '@/components/CTAContainer'
import Button from '@/components/Button'

export default function IntroPage() {
  const handleStart = () => {
    // TODO: /setup 또는 /routine/setup 라우팅 연결
    console.log('루틴 시작하기 클릭')
  }

  return (
    <AppLayout>
      {/* 상단: 앱명/태그라인 */}
      <div className="px-6 pt-12 pb-8 text-center">
        <p className="text-sm font-semibold text-blue-600 tracking-wide">
          감각 기반 명상 웹앱
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          피부와 마음을 위한 루틴
        </h1>
      </div>

      {/* 중앙: 안내 문구 */}
      <div className="px-6 pb-32">
        <div className="mt-10 bg-gray-50 border border-gray-200 rounded-2xl px-6 py-10 text-center">
          <p className="text-lg text-gray-800 leading-relaxed">
            지금 이 순간, 나에게 집중해보세요.
            <br />
            호흡과 감각을 따라 스킨케어 루틴을 시작합니다.
          </p>
        </div>
      </div>

      {/* 하단 CTA */}
      <CTAContainer>
        <Button onClick={handleStart} variant="primary" size="lg" fullWidth>
          루틴 시작하기
        </Button>
      </CTAContainer>
    </AppLayout>
  )
}

