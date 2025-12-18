import { Suspense } from 'react'
import SummaryContent from './SummaryContent'

export default function SummaryPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[100svh]">
        <p className="text-gray-600">로딩 중...</p>
      </div>
    }>
      <SummaryContent />
    </Suspense>
  )
}

