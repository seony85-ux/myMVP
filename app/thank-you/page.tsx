'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import AppLayout from '@/components/AppLayout'
import CTAContainer from '@/components/CTAContainer'
import Button from '@/components/Button'
import { useSessionStore } from '@/stores/sessionStore'

export default function ThankYouPage() {
  const router = useRouter()
  const resetSession = useSessionStore((state) => state.resetSession)

  const handleGoHome = () => {
    // 세션 리셋 후 인트로로 이동
    resetSession()
    router.push('/intro')
  }

  const handleLearnMore = () => {
    // TODO: 추후 링크 연결 예정
    console.log('더 알아보기 클릭')
  }

  return (
    <AppLayout>
      <div className="flex flex-col min-h-[100svh] justify-between">
        {/* 상단: 이미지 + 감사 문구 + 더 알아보기 버튼 */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-6 sm:py-8 pb-24 sm:pb-28">
          <div className="flex flex-col items-center space-y-5 sm:space-y-6 md:space-y-8 w-full max-w-md">
            {/* 이미지 영역 */}
            <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full border-2 border-gray-200 overflow-hidden shadow-lg flex-shrink-0 relative">
              <Image
                src="/images/lastone.webp"
                alt="감사 이미지"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* 감사 문구 */}
            <div className="text-center space-y-2 sm:space-y-3 px-4">
              <p className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                체험해주셔서 감사합니다
              </p>
              <div className="text-lg sm:text-xl text-gray-700 leading-relaxed font-medium space-y-1.5">
                <p>매일 조금씩,</p>
                <p>나에게 집중하는 순간을...</p>
              </div>
            </div>

            {/* 더 알아보기 버튼 */}
            <div className="pt-3 sm:pt-4">
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
          <Button
            onClick={handleGoHome}
            variant="primary"
            size="lg"
            fullWidth
          >
            처음으로
          </Button>
        </CTAContainer>
      </div>
    </AppLayout>
  )
}

