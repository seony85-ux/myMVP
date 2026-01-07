'use client'

interface SkincareStepToggleProps {
  step: string
  label: string
  checked: boolean
  onToggle: (step: string, checked: boolean) => void
}

export default function SkincareStepToggle({
  step,
  label,
  checked,
  onToggle,
}: SkincareStepToggleProps) {
  return (
    <button
      onClick={() => onToggle(step, !checked)}
      className={`
        w-full p-4 rounded-lg
        border-2 transition-all duration-200
        flex flex-col items-center justify-center gap-3
        ${
          checked
            ? 'bg-[#F5F4F0] border-[#6E8578] shadow-md'
            : 'bg-white border-[#CDCAC3] hover:border-[#b8b5ae]'
        }
        active:scale-98
      `}
      aria-label={`${label} ${checked ? '선택 해제' : '선택'}`}
    >
      <span
        className={`font-medium text-center ${
          checked ? 'text-[#1A202C]' : 'text-[#333333]'
        }`}
      >
        {label}
      </span>
      <div
        className={`
          w-6 h-6 rounded border-2 flex items-center justify-center
          ${
            checked
              ? 'bg-[#6E8578] border-[#5a6f63]'
              : 'bg-white border-[#CDCAC3]'
          }
        `}
      >
        {checked && (
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>
    </button>
  )
}

