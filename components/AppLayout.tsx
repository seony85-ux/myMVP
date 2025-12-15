'use client'

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-[100svh] bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-[100svh]">
        {children}
      </div>
    </div>
  )
}

