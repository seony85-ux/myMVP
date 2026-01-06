'use client'

interface WakeLockButtonProps {
  isActive: boolean
  isSupported: boolean
  onClick: () => void
}

export default function WakeLockButton({
  isActive,
  isSupported,
  onClick,
}: WakeLockButtonProps) {
  // Wake Lock API를 지원하지 않으면 버튼을 표시하지 않음
  if (!isSupported) {
    return null
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={onClick}
        className={`
          flex items-center justify-center
          w-10 h-10 rounded-full
          transition-all duration-200
          active:scale-95
          ${isActive 
            ? 'bg-blue-600 text-white hover:bg-blue-700' 
            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }
        `}
        aria-label={isActive ? '화면 꺼짐 방지 해제' : '화면 꺼짐 방지 활성화'}
        title={isActive ? '화면 꺼짐 방지 해제' : '화면 꺼짐 방지 활성화'}
      >
        {isActive ? (
          // 활성화 상태: 잠금 아이콘
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        ) : (
          // 비활성화 상태: 열림 아이콘
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
            />
          </svg>
        )}
      </button>
      <span className="text-xs text-gray-500 whitespace-nowrap">
        화면 꺼짐 방지
      </span>
    </div>
  )
}

