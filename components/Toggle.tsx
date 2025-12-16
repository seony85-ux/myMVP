'use client'

interface ToggleProps {
  value: boolean
  onChange: (value: boolean) => void
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function Toggle({
  value,
  onChange,
  label,
  size = 'md',
}: ToggleProps) {
  const sizeStyles = {
    sm: 'h-10 px-4 text-sm',
    md: 'h-14 px-6 text-base',
    lg: 'h-16 px-8 text-lg',
  }

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
          {label}
        </label>
      )}
      <div className="flex items-center justify-center">
        <div
          className={`
            relative inline-flex rounded-lg border-2 border-gray-300 bg-gray-100
            ${sizeStyles[size]}
          `}
        >
          {/* On 버튼 */}
          <button
            onClick={() => onChange(true)}
            className={`
              ${sizeStyles[size]}
              rounded-l-md font-semibold transition-all duration-200
              ${
                value
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-transparent text-gray-600 hover:text-gray-800'
              }
              active:scale-95
            `}
            aria-label="음성 가이드 켜기"
          >
            On
          </button>
          {/* Off 버튼 */}
          <button
            onClick={() => onChange(false)}
            className={`
              ${sizeStyles[size]}
              rounded-r-md font-semibold transition-all duration-200
              ${
                !value
                  ? 'bg-gray-600 text-white shadow-md'
                  : 'bg-transparent text-gray-600 hover:text-gray-800'
              }
              active:scale-95
            `}
            aria-label="음성 가이드 끄기"
          >
            Off
          </button>
        </div>
      </div>
    </div>
  )
}

