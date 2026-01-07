'use client'

import Image from 'next/image'

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
  const handleSelect = () => {
    if (selected) {
      onSelect(null)
    } else {
      // 'none' 값을 null로 변환 (Supabase 외래키 제약 조건 준수)
      onSelect(id === 'none' ? null : id)
    }
  }

  return (
    <button
      onClick={handleSelect}
      className={`
        w-full rounded-lg overflow-hidden
        border-2 transition-all duration-200
        text-left
        ${
          selected
            ? 'bg-[#F5F4F0] border-[#6E8578] shadow-md'
            : 'bg-white border-[#CDCAC3] hover:border-[#b8b5ae]'
        }
        active:scale-98
      `}
      aria-label={`BGM 선택: ${name}`}
    >
      {/* 이미지 영역 (4:3 비율) */}
      <div className="w-full aspect-[4/3] bg-[#F5F4F0] border-b border-[#CDCAC3] overflow-hidden relative">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover object-bottom"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#CDCAC3] text-sm">
            이미지 없음
          </div>
        )}
      </div>

      <div className="p-4 flex items-center justify-between">
        <div className="flex-1">
          <h3
            className={`font-semibold mb-1 ${
              selected ? 'text-[#1A202C]' : 'text-[#333333]'
            }`}
          >
            {name}
          </h3>
          <p className={`text-sm ${selected ? 'text-[#6E8578]' : 'text-[#333333]'}`}>
            {description}
          </p>
        </div>
        <div
          className={`
            w-6 h-6 rounded-full border-2 flex items-center justify-center
            ml-4
            ${
              selected
                ? 'bg-[#6E8578] border-[#5a6f63]'
                : 'bg-white border-[#CDCAC3]'
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

