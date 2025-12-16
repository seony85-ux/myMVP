'use client'

interface StepHeaderProps {
  stepName: string
  stepNumber?: number
  totalSteps?: number
}

export default function StepHeader({
  stepName,
  stepNumber,
  totalSteps,
}: StepHeaderProps) {
  return (
    <div className="px-6 pt-8 pb-6 text-center">
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

