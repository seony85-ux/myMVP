'use client'

interface SectionHeaderProps {
  title: string
  description?: string
}

export default function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="pb-4 border-b border-[#CDCAC3]">
      <h2 className="text-lg font-semibold text-[#1A202C]">{title}</h2>
      {description ? (
        <p className="text-sm text-[#333333] mt-1">{description}</p>
      ) : null}
    </div>
  )
}

