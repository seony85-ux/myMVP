'use client'

interface SatisfactionSelectorProps {
  value: number | null
  onChange: (value: number) => void
}

const satisfactionLabels = {
  1: '매우 불만족',
  2: '불만족',
  3: '보통',
  4: '만족',
  5: '매우 만족',
}

export default function SatisfactionSelector({
  value,
  onChange,
}: SatisfactionSelectorProps) {
  return (
    <div className="w-full">
      <div className="flex justify-center gap-2 sm:gap-3 mb-4">
        {[1, 2, 3, 4, 5].map((score) => (
          <button
            key={score}
            onClick={() => onChange(score)}
            className={`
              flex flex-col items-center justify-center
              w-12 h-12 sm:w-14 sm:h-14 rounded-lg
              transition-all duration-200
              border-2
              ${
                value === score
                  ? 'bg-[#6E8578] border-[#5a6f63] scale-110 shadow-lg'
                  : 'bg-[#F5F4F0] border-[#CDCAC3] hover:bg-[#e8e6e0]'
              }
              active:scale-95
            `}
            aria-label={`만족도 ${score}`}
          >
            <span
              className={`text-lg sm:text-xl font-bold ${
                value === score ? 'text-white' : 'text-gray-700'
              }`}
            >
              {score}
            </span>
          </button>
        ))}
      </div>
      {value && value >= 1 && value <= 5 && (
        <p className="text-center text-sm text-gray-600 mt-2">
          {satisfactionLabels[value as 1 | 2 | 3 | 4 | 5]}
        </p>
      )}
    </div>
  )
}

