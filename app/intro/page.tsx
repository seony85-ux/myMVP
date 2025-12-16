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
      <div className="flex flex-col min-h-[100svh]">
        {/* 상단: 태그라인 */}
        <div className="px-6 pt-16 pb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
            잠깐, 피부에만 집중하는 시간
          </h1>
        </div>

        {/* 중앙: 원형 이미지 + 안내 문구 */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-32">
          <div className="flex flex-col items-center space-y-8 w-full max-w-sm">
            {/* 원형 이미지 영역 */}
            <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full border-2 border-gray-200 overflow-hidden shadow-lg">
              <img
                src="/images/mainimage.png"
                alt="메인 이미지"
                className="w-full h-full object-cover"
              />
            </div>
            {/* 안내 문구 */}
            <div className="text-center px-4">
              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed font-medium">
                짧은 루틴을 시작하세요
              </p>
            </div>
          </div>
        </div>

        {/* 하단 CTA */}
        <CTAContainer>
          <Button onClick={handleStart} variant="primary" size="lg" fullWidth>
            오늘의 루틴 고르기
          </Button>
        </CTAContainer>
      </div>
    </AppLayout>
  )
}

