'use client'

interface SectionHeaderProps {
  title: string
  description?: string
}

export default function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="pb-4 border-b border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      {description ? (
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      ) : null}
    </div>
  )
}

