'use client'

interface MeditationTextProps {
  text: string
  animate?: boolean
}

export default function MeditationText({
  text,
  animate = false,
}: MeditationTextProps) {
  return (
    <div
      className={`
        px-6 py-8 text-center
        ${animate ? 'animate-fade-in' : ''}
      `}
    >
      <p className="text-xl sm:text-2xl text-gray-800 leading-relaxed font-medium whitespace-pre-line break-keep">
        {text}
      </p>
    </div>
  )
}

