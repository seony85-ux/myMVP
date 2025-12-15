'use client'

interface SectionBlockProps {
  children: React.ReactNode
  className?: string
}

export default function SectionBlock({ children, className = '' }: SectionBlockProps) {
  return <section className={`space-y-4 ${className}`.trim()}>{children}</section>
}

