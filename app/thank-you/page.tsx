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
        {/* 중앙: 이미지 + 감사 문구 + 더 알아보기 버튼 (스크롤 가능) */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 pb-40 overflow-y-auto">
          <div className="flex flex-col items-center space-y-10 w-full max-w-md py-8">
            {/* 이미지 영역 */}
            <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full border-2 border-gray-200 overflow-hidden shadow-lg">
              <img
                src="/images/lastone.webp"
                alt="감사 이미지"
                className="w-full h-full object-cover"
              />
            </div>

            {/* 감사 문구 */}
            <div className="text-center space-y-3 px-4">
              <p className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                체험해주셔서 감사합니다
              </p>
              <div className="text-lg sm:text-xl text-gray-700 leading-relaxed font-medium space-y-1">
                <p>매일 조금씩,</p>
                <p>나에게 집중하는 순간을 만들어보세요.</p>
              </div>
            </div>

            {/* 더 알아보기 버튼 */}
            <div className="pt-2">
              <Button
                onClick={handleLearnMore}
                variant="ghost"
                size="md"
                className="text-gray-600 hover:text-gray-800"
              >
                더 알아보기
              </Button>
            </div>
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

