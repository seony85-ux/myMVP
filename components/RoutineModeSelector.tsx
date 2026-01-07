'use client'

interface RoutineModeSelectorProps {
  value: 'basic' | 'detailed'
  onChange: (value: 'basic' | 'detailed') => void
}

export default function RoutineModeSelector({
  value,
  onChange,
}: RoutineModeSelectorProps) {
  return (
    <div className="w-full">
      {/* 세그먼트 컨트롤 */}
      <div className="flex items-center justify-center gap-3 mb-4">
        {/* 기본 버튼 */}
        <button
          onClick={() => onChange('basic')}
          className={`
            h-14 px-6 sm:px-8 rounded-lg border-2 font-semibold transition-all duration-200
            min-w-[140px] sm:min-w-[160px]
            ${
              value === 'basic'
                ? 'bg-[#6E8578] text-white border-[#5a6f63] shadow-md'
                : 'bg-white text-[#333333] border-[#CDCAC3] hover:border-[#b8b5ae] hover:text-[#1A202C]'
            }
            active:scale-95
          `}
          aria-label="기본 모드 선택"
        >
          기본
        </button>
        {/* 단계별 가이드 버튼 */}
        <button
          onClick={() => onChange('detailed')}
          className={`
            h-14 px-6 sm:px-8 rounded-lg border-2 font-semibold transition-all duration-200
            min-w-[140px] sm:min-w-[160px]
            ${
              value === 'detailed'
                ? 'bg-[#6E8578] text-white border-[#5a6f63] shadow-md'
                : 'bg-white text-[#333333] border-[#CDCAC3] hover:border-[#b8b5ae] hover:text-[#1A202C]'
            }
            active:scale-95
          `}
          aria-label="단계별 가이드 모드 선택"
        >
          단계별 가이드
        </button>
      </div>

      {/* 설명 문구 */}
      <div className="px-4 py-3 bg-[#F5F4F0] rounded-lg border border-[#CDCAC3]">
        <p className="text-sm text-[#333333] text-center">
          {value === 'basic'
            ? '시작과 마무리 안내만 제공되는 간결한 루틴'
            : '제품 단계에 맞춰 감각 안내가 이어지는 루틴'}
        </p>
      </div>
    </div>
  )
}

