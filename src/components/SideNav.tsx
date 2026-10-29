// ─── Sibling nav card ─────────────────────────────────────────────────────────
// Glass card listing sibling pages, with a red bar on the active one.
// Used by the About/Membership inner pages and the committee pages.
export default function SideNavCard<T extends string>({
  section,
  pages,
  currentId,
  onNavigate,
}: {
  section: string
  pages: { id: T; label: string }[]
  currentId: T
  onNavigate: (id: T) => void
}) {
  return (
    <div
      className="glass-strong"
      style={{ borderRadius: 20, overflow: 'hidden' }}
    >
      <div
        className="eyebrow px-5 py-4"
        style={{ fontSize: 10, color: '#5C6673', borderBottom: '1px solid rgba(226,230,236,0.7)' }}
      >
        {section}
      </div>
      <nav>
        {pages.map((page) => {
          const active = page.id === currentId
          return (
            <button
              key={page.id}
              onClick={() => onNavigate(page.id)}
              className="w-full text-left flex items-center px-5 py-3.5 transition-colors"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                borderLeft: active ? '3px solid #E10B17' : '3px solid transparent',
                fontFamily: 'CKCL',
                fontSize: 14,
                fontWeight: active ? 600 : 400,
                color: active ? '#0E1116' : '#5C6673',
                transition: 'all 160ms',
              }}
              onMouseEnter={(e) => {
                if (!active) (e.currentTarget as HTMLElement).style.color = '#0E1116'
              }}
              onMouseLeave={(e) => {
                if (!active) (e.currentTarget as HTMLElement).style.color = '#5C6673'
              }}
            >
              {page.label}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
