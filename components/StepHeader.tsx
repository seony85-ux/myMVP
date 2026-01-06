'use client'

import WakeLockButton from './WakeLockButton'

interface StepHeaderProps {
  stepName: string
  stepNumber?: number
  totalSteps?: number
  wakeLockActive?: boolean
  wakeLockSupported?: boolean
  onToggleWakeLock?: () => void
}

export default function StepHeader({
  stepName,
  stepNumber,
  totalSteps,
  wakeLockActive = false,
  wakeLockSupported = false,
  onToggleWakeLock,
}: StepHeaderProps) {
  return (
    <div className="px-6 pt-8 pb-6 text-center relative">
      {/* 화면 꺼짐 방지 버튼 (우측 상단) */}
      {onToggleWakeLock && (
        <div className="absolute top-8 right-6">
          <WakeLockButton
            isActive={wakeLockActive}
            isSupported={wakeLockSupported}
            onClick={onToggleWakeLock}
          />
        </div>
      )}
      
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
        {stepName}
      </h1>
      {stepNumber && totalSteps && (
        <p className="text-sm text-gray-500 mt-2">
          {stepNumber} / {totalSteps}
        </p>
      )}
    </div>
  )
}

