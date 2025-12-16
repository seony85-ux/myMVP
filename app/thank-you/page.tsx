'use client'

import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import CTAContainer from '@/components/CTAContainer'
import Button from '@/components/Button'

export default function ThankYouPage() {
  const router = useRouter()

  const handleGoHome = () => {
    router.push('/intro')
  }

  const handleRestart = () => {
    router.push('/routine/setup')
  }

  const handleLearnMore = () => {
    // TODO: 추후 링크 연결 예정
    console.log('더 알아보기 클릭')
  }

  return (
    <AppLayout>
      <div className="flex flex-col min-h-[100svh]">
        {/* 중앙: 이미지 + 감사 문구 + 더 알아보기 버튼 */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-32">
          <div className="flex flex-col items-center space-y-8 w-full max-w-md">
            {/* 이미지 영역 (추후 이미지 삽입) */}
            <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full border-2 border-gray-200 overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400 text-sm">이미지 영역</span>
            </div>

            {/* 감사 문구 (두 줄) */}
            <div className="text-center space-y-2">
              <p className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                체험해주셔서 감사합니다
              </p>
              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed font-medium">
                매일 조금씩, 나에게 집중하는 순간을 만들어보세요.
              </p>
            </div>

            {/* 더 알아보기 버튼 */}
            <Button
              onClick={handleLearnMore}
              variant="ghost"
              size="md"
            >
              더 알아보기
            </Button>
          </div>
        </div>

        {/* 하단 CTA */}
        <CTAContainer>
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleGoHome}
              variant="primary"
              size="lg"
              fullWidth
            >
              처음으로
            </Button>
            <Button
              onClick={handleRestart}
              variant="secondary"
              size="lg"
              fullWidth
            >
              다시 하기
            </Button>
          </div>
        </CTAContainer>
      </div>
    </AppLayout>
  )
}

