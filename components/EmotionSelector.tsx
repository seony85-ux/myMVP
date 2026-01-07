'use client'

import { useState } from 'react'

interface EmotionSelectorProps {
  value: number | null
  onChange: (value: number) => void
  showLabels?: boolean
}

const emotionLabels = {
  1: '매우 나쁨',
  2: '나쁨',
  3: '보통',
  4: '좋음',
  5: '매우 좋음',
}

const emotionEmojis = {
  1: '😢',
  2: '😕',
  3: '😐',
  4: '🙂',
  5: '😊',
}

export default function EmotionSelector({
  value,
  onChange,
  showLabels = true,
}: EmotionSelectorProps) {
  return (
    <div className="w-full">
      <div className="flex justify-center gap-3 mb-4">
        {[1, 2, 3, 4, 5].map((score) => (
          <button
            key={score}
            onClick={() => onChange(score)}
            className={`
              flex flex-col items-center justify-center
              w-16 h-16 rounded-full
              transition-all duration-200
              border-2
              ${
                value === score
                  ? 'bg-[#6E8578] border-[#5a6f63] scale-110 shadow-lg'
                  : 'bg-[#F5F4F0] border-[#CDCAC3] hover:bg-[#e8e6e0]'
              }
              active:scale-95
            `}
            aria-label={`감정 점수 ${score}`}
          >
            <span className="text-2xl">{emotionEmojis[score as 1 | 2 | 3 | 4 | 5]}</span>
            {showLabels && (
              <span
                className={`text-xs mt-1 ${
                  value === score ? 'text-white font-bold' : 'text-gray-600'
                }`}
              >
                {score}
              </span>
            )}
          </button>
        ))}
      </div>
      {showLabels && value && value >= 1 && value <= 5 && (
        <p className="text-center text-sm text-gray-600 mt-2">
          {emotionLabels[value as 1 | 2 | 3 | 4 | 5]}
        </p>
      )}
    </div>
  )
}

