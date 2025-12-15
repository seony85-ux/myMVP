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
            ? 'bg-green-50 border-green-500 shadow-md'
            : 'bg-white border-gray-300 hover:border-gray-400'
        }
        active:scale-98
      `}
      aria-label={`${label} ${checked ? '선택 해제' : '선택'}`}
    >
      <span
        className={`font-medium text-center ${
          checked ? 'text-green-700' : 'text-gray-800'
        }`}
      >
        {label}
      </span>
      <div
        className={`
          w-6 h-6 rounded border-2 flex items-center justify-center
          ${
            checked
              ? 'bg-green-500 border-green-600'
              : 'bg-white border-gray-400'
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

