'use client'

interface ToggleSwitchProps {
  value: boolean
  onChange: (value: boolean) => void
  label?: string
  size?: 'sm' | 'md' | 'lg'
  ariaLabel?: string
}

export default function ToggleSwitch({
  value,
  onChange,
  label,
  size = 'md',
  ariaLabel,
}: ToggleSwitchProps) {
  const sizeStyles = {
    sm: {
      container: 'h-10 w-20',
      thumb: 'h-8 w-8',
      text: 'text-xs',
    },
    md: {
      container: 'h-12 w-24',
      thumb: 'h-10 w-10',
      text: 'text-sm',
    },
    lg: {
      container: 'h-14 w-28',
      thumb: 'h-12 w-12',
      text: 'text-base',
    },
  }

  const currentSize = sizeStyles[size]

  const handleToggle = () => {
    onChange(!value)
  }

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
          {label}
        </label>
      )}
      <div className="flex items-center justify-center">
        <button
          type="button"
          role="switch"
          aria-checked={value}
          aria-label={ariaLabel || (value ? '켜짐' : '꺼짐')}
          onClick={handleToggle}
          className={`
            relative ${currentSize.container}
            rounded-full transition-all duration-300 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
            ${value ? 'bg-green-500' : 'bg-gray-300'}
          `}
        >
          {/* 원형 thumb */}
          <div
            className={`
              absolute top-1 ${currentSize.thumb}
              bg-white rounded-full shadow-lg
              transition-all duration-300 ease-in-out
              ${
                size === 'sm'
                  ? value
                    ? 'translate-x-[2.875rem]'
                    : 'translate-x-0.5'
                  : size === 'md'
                  ? value
                    ? 'translate-x-[3.375rem]'
                    : 'translate-x-0.5'
                  : value
                  ? 'translate-x-[3.875rem]'
                  : 'translate-x-0.5'
              }
            `}
          />

          {/* ON/OFF 텍스트 - 각 영역의 가운데에 배치 */}
          <div className="absolute inset-0 flex items-center pointer-events-none">
            {/* 왼쪽 영역 - ON 텍스트 가운데 정렬 */}
            <div className="absolute left-0 w-1/2 h-full flex items-center justify-center">
              <span
                className={`
                  ${currentSize.text} font-semibold text-white
                  transition-opacity duration-300
                  ${value ? 'opacity-100' : 'opacity-0'}
                `}
              >
                ON
              </span>
            </div>
            {/* 오른쪽 영역 - OFF 텍스트 가운데 정렬 */}
            <div className="absolute right-0 w-1/2 h-full flex items-center justify-center">
              <span
                className={`
                  ${currentSize.text} font-semibold text-white
                  transition-opacity duration-300
                  ${value ? 'opacity-0' : 'opacity-100'}
                `}
              >
                OFF
              </span>
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}

