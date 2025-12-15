'use client'

interface CTAContainerProps {
  children: React.ReactNode
}

export default function CTAContainer({ children }: CTAContainerProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 bg-white border-t-2 border-gray-200">
      <div className="mx-auto max-w-md px-6 py-6">{children}</div>
    </div>
  )
}

