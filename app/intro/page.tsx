'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import AppLayout from '@/components/AppLayout'
import CTAContainer from '@/components/CTAContainer'
import Button from '@/components/Button'
import { useSessionStore } from '@/stores/sessionStore'

export default function IntroPage() {
  const router = useRouter()
  const resetSession = useSessionStore((state) => state.resetSession)

  const handleStart = () => {
    // 모든 세팅값 초기화 후 루틴 설정 화면으로 이동
    resetSession()
    router.push('/routine/setup')
  }

  return (
    <AppLayout>
      <div className="flex flex-col min-h-[100svh]">
        {/* 상단: 태그라인 */}
        <div className="px-6 pt-16 pb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight font-heading">
            잠시, 피부에만 집중하는 시간
          </h1>
        </div>

        {/* 중앙: 원형 이미지 + 안내 문구 */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-32">
          <div className="flex flex-col items-center space-y-8 w-full max-w-sm">
            {/* 원형 이미지 영역 */}
            <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full border-2 border-[#CDCAC3] overflow-hidden shadow-lg relative">
              <Image
                src="/images/mainimage.webp"
                alt="메인 이미지"
                fill
                className="object-cover"
                priority
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

