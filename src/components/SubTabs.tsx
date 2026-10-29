import { useEffect, useRef } from 'react'

// ─── Subsection tabs ──────────────────────────────────────────────────────────
// Underlined tab bar used for page subsections (Media Centre, Resources, About…).
// Scrolls horizontally when the tabs don't fit, keeping the active tab in view.
export default function SubTabs<T extends string>({
  tabs,
  active,
  onChange,
  className,
}: {
  tabs: { id: T; label: string }[]
  active: T
  onChange: (id: T) => void
  className?: string
}) {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = barRef.current
    const el = bar?.querySelector<HTMLElement>('[aria-selected="true"]')
    if (!bar || !el) return
    const target = el.offsetLeft - (bar.clientWidth - el.offsetWidth) / 2
    bar.scrollTo({ left: Math.max(0, target), behavior: 'smooth' })
  }, [active])

  return (
    <div
      ref={barRef}
      role="tablist"
      className={`sub-tabs ${className ?? ''}`}
      style={{ display: 'flex', borderBottom: '1px solid #E2E6EC', overflowX: 'auto', scrollbarWidth: 'none' }}
    >
      <style>{`.sub-tabs::-webkit-scrollbar { display: none; }`}</style>
      {tabs.map((tab) => {
        const isActive = tab.id === active
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className="px-4 sm:px-5"
            style={{
              flexShrink: 0,
              whiteSpace: 'nowrap',
              paddingTop: 12,
              paddingBottom: 12,
              fontFamily: 'CKCL',
              fontWeight: isActive ? 700 : 500,
              fontSize: 14,
              color: isActive ? '#E10B17' : '#5C6673',
              background: 'none',
              border: 'none',
              borderBottom: isActive ? '2px solid #E10B17' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 160ms',
              marginBottom: -1,
            }}
            onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.color = '#2A3039' }}
            onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.color = '#5C6673' }}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
