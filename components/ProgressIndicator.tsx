'use client'

interface ProgressIndicatorProps {
  steps: string[]
  currentStep: number
  completedSteps?: number[]
  variant?: 'bar' | 'dots'
}

export default function ProgressIndicator({
  steps,
  currentStep,
  completedSteps = [],
  variant = 'dots',
}: ProgressIndicatorProps) {
  if (variant === 'dots') {
    return (
      <div className="flex items-center justify-center gap-3 px-6 py-4">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(index)
          const isCurrent = index === currentStep

          return (
            <div
              key={index}
              className={`
                w-3 h-3 rounded-full transition-all duration-300
                ${
                  isCompleted
                    ? 'bg-green-500 scale-110'
                    : isCurrent
                    ? 'bg-blue-500 scale-125 ring-2 ring-blue-200'
                    : 'bg-gray-300'
                }
              `}
              aria-label={`${step} ${isCompleted ? '완료' : isCurrent ? '진행 중' : '대기'}`}
            />
          )
        })}
      </div>
    )
  }

  // Bar variant
  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="px-6 py-4">
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        {steps.map((step, index) => (
          <span
            key={index}
            className={
              index === currentStep
                ? 'font-semibold text-blue-600'
                : completedSteps.includes(index)
                ? 'text-green-600'
                : ''
            }
          >
            {step}
          </span>
        ))}
      </div>
    </div>
  )
}

