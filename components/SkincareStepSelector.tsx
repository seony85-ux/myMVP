'use client'

import SkincareStepToggle from './SkincareStepToggle'

interface SkincareStepSelectorProps {
  selectedSteps: string[]
  onChange: (steps: string[]) => void
}

const skincareSteps = [
  { id: 'toner', label: '토너' },
  { id: 'essence', label: '에센스' },
  { id: 'cream', label: '크림' },
]

export default function SkincareStepSelector({
  selectedSteps,
  onChange,
}: SkincareStepSelectorProps) {
  const handleToggle = (step: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedSteps, step])
    } else {
      onChange(selectedSteps.filter((s) => s !== step))
    }
  }

  return (
    <div
      className="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory"
      style={{ scrollbarWidth: 'none' }} // Firefox 스크롤바 숨김
    >
      {skincareSteps.map((step) => (
        <div
          key={step.id}
          className="flex-none w-[90px] sm:w-[100px] snap-start"
        >
          <SkincareStepToggle
            step={step.id}
            label={step.label}
            checked={selectedSteps.includes(step.id)}
            onToggle={handleToggle}
          />
        </div>
      ))}
    </div>
  )
}

