'use client'

interface ReuseIntentionSelectorProps {
  value: boolean | null
  onChange: (value: boolean) => void
}

export default function ReuseIntentionSelector({
  value,
  onChange,
}: ReuseIntentionSelectorProps) {
  return (
    <div className="w-full">
      <div className="flex gap-3">
        <button
          onClick={() => onChange(true)}
          className={`
            flex-1 py-4 rounded-lg
            border-2 transition-all duration-200
            font-semibold text-base
            ${
              value === true
                ? 'bg-[#6E8578] border-[#5a6f63] text-white shadow-md'
                : 'bg-white border-[#CDCAC3] text-[#333333] hover:border-[#b8b5ae]'
            }
            active:scale-95
          `}
          aria-label="재사용 의향: 예"
        >
          예
        </button>
        <button
          onClick={() => onChange(false)}
          className={`
            flex-1 py-4 rounded-lg
            border-2 transition-all duration-200
            font-semibold text-base
            ${
              value === false
                ? 'bg-red-500 border-red-600 text-white shadow-md'
                : 'bg-white border-[#CDCAC3] text-[#333333] hover:border-[#b8b5ae]'
            }
            active:scale-95
          `}
          aria-label="재사용 의향: 아니오"
        >
          아니오
        </button>
      </div>
    </div>
  )
}

