'use client'

interface BGMCardProps {
  id: string
  name: string
  description: string
  imageUrl?: string
  selected: boolean
  onSelect: (id: string | null) => void
}

export default function BGMCard({
  id,
  name,
  description,
  imageUrl,
  selected,
  onSelect,
}: BGMCardProps) {
  return (
    <button
      onClick={() => onSelect(selected ? null : id)}
      className={`
        w-full rounded-lg overflow-hidden
        border-2 transition-all duration-200
        text-left
        ${
          selected
            ? 'bg-blue-50 border-blue-500 shadow-md'
            : 'bg-white border-gray-300 hover:border-gray-400'
        }
        active:scale-98
      `}
      aria-label={`BGM 선택: ${name}`}
    >
      {/* 이미지 영역 (4:3 비율) */}
      <div className="w-full aspect-[4/3] bg-gray-100 border-b border-gray-200 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover object-bottom"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            이미지 없음
          </div>
        )}
      </div>

      <div className="p-4 flex items-center justify-between">
        <div className="flex-1">
          <h3
            className={`font-semibold mb-1 ${
              selected ? 'text-blue-700' : 'text-gray-800'
            }`}
          >
            {name}
          </h3>
          <p className={`text-sm ${selected ? 'text-blue-600' : 'text-gray-600'}`}>
            {description}
          </p>
        </div>
        <div
          className={`
            w-6 h-6 rounded-full border-2 flex items-center justify-center
            ml-4
            ${
              selected
                ? 'bg-blue-500 border-blue-600'
                : 'bg-white border-gray-400'
            }
          `}
        >
          {selected && (
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
      </div>
    </button>
  )
}

