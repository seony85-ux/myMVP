import { Suspense } from 'react'
import RoutinePlayContent from './RoutinePlayContent'

export default function RoutinePlayPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[100svh]">
        <p className="text-gray-600">로딩 중...</p>
      </div>
    }>
      <RoutinePlayContent />
    </Suspense>
  )
}

