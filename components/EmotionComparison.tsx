'use client'

interface EmotionComparisonProps {
  beforeScore: number
  afterScore: number
  variant?: 'number' | 'graph' | 'emoji'
}

export default function EmotionComparison({
  beforeScore,
  afterScore,
  variant = 'number',
}: EmotionComparisonProps) {
  const change = afterScore - beforeScore
  const changeText = change > 0 ? `+${change}점 상승` : change < 0 ? `${change}점 하락` : '변화 없음'
  const changeColor = change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600'

  if (variant === 'emoji') {
    const emotionEmojis = {
      1: '😢',
      2: '😕',
      3: '😐',
      4: '🙂',
      5: '😊',
    }
    return (
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <p className="text-sm text-gray-600 mb-2">이전</p>
            <div className="text-4xl mb-1">
              {emotionEmojis[beforeScore as keyof typeof emotionEmojis]}
            </div>
            <p className="text-lg font-bold text-gray-800">{beforeScore}점</p>
          </div>
          <div className="text-2xl text-gray-400 mx-4">→</div>
          <div className="text-center flex-1">
            <p className="text-sm text-gray-600 mb-2">이후</p>
            <div className="text-4xl mb-1">
              {emotionEmojis[afterScore as keyof typeof emotionEmojis]}
            </div>
            <p className="text-lg font-bold text-gray-800">{afterScore}점</p>
          </div>
        </div>
        <div className={`text-center mt-4 pt-4 border-t border-gray-200`}>
          <p className={`text-base font-semibold ${changeColor}`}>{changeText}</p>
        </div>
      </div>
    )
  }

  if (variant === 'graph') {
    const maxScore = 5
    const beforePercent = (beforeScore / maxScore) * 100
    const afterPercent = (afterScore / maxScore) * 100

    return (
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>이전</span>
              <span>{beforeScore}점</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gray-400 h-3 rounded-full transition-all duration-300"
                style={{ width: `${beforePercent}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>이후</span>
              <span>{afterScore}점</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${afterPercent}%` }}
              />
            </div>
          </div>
        </div>
        <div className={`text-center mt-4 pt-4 border-t border-gray-200`}>
          <p className={`text-base font-semibold ${changeColor}`}>{changeText}</p>
        </div>
      </div>
    )
  }

  // number variant (기본)
  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-center flex-1">
          <p className="text-sm text-gray-600 mb-1">이전</p>
          <p className="text-3xl font-bold text-gray-800">{beforeScore}점</p>
        </div>
        <div className="text-2xl text-gray-400 mx-4">→</div>
        <div className="text-center flex-1">
          <p className="text-sm text-gray-600 mb-1">이후</p>
          <p className="text-3xl font-bold text-blue-600">{afterScore}점</p>
        </div>
      </div>
      <div className={`text-center pt-4 border-t border-gray-200`}>
        <p className={`text-lg font-semibold ${changeColor}`}>{changeText}</p>
      </div>
    </div>
  )
}

