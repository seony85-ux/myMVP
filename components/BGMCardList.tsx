'use client'

import BGMCard from './BGMCard'

interface BGM {
  id: string
  name: string
  description: string
  imageUrl?: string
}

interface BGMCardListProps {
  bgms: BGM[]
  selectedId: string | null
  onSelect: (id: string | null) => void
}

export default function BGMCardList({
  bgms,
  selectedId,
  onSelect,
}: BGMCardListProps) {
  return (
    <div
      className="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory"
      style={{ scrollbarWidth: 'none' }} // Firefox 스크롤바 숨김
      role="listbox"
      aria-label="배경음 선택"
    >
      {bgms.map((bgm) => (
        <div
          key={bgm.id}
          className="flex-none w-[220px] sm:w-[240px] snap-start"
        >
          <BGMCard
            id={bgm.id}
            name={bgm.name}
            description={bgm.description}
            imageUrl={bgm.imageUrl}
            selected={bgm.id === 'none' ? selectedId === null : selectedId === bgm.id}
            onSelect={onSelect}
          />
        </div>
      ))}
    </div>
  )
}

