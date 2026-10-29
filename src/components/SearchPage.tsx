import { useState, useMemo, useRef, useEffect } from 'react'
import Footer from './Footer'

const T = {
  ink900: '#0E1116', ink600: '#2A3039', ink400: '#5C6673', ink200: '#A8B0BB', ink100: '#E2E6EC',
  surface50: '#F7F8FA', surface100: '#EEF1F5',
  brand: '#E10B17', brandDim: '#FFF1F2', brass: '#B98B43',
}

type ResultType = 'Page' | 'Notice' | 'Member' | 'Album'

type SearchResult = {
  id: number
  type: ResultType
  title: string
  subtitle: string
  url?: string
  avatar?: string
  date?: string
}

const ALL_RESULTS: SearchResult[] = [
  { id: 1,  type: 'Page',   title: 'About the Club',            subtitle: 'History, mission and values of Chittagong Khulshi Club Limited', url: 'about-club' },
  { id: 2,  type: 'Page',   title: 'Membership Process',        subtitle: 'Four-step guide to becoming a CKCL member', url: 'membership-process' },
  { id: 3,  type: 'Page',   title: 'Swimming Pool',             subtitle: 'Olympic-standard pool — open daily · booking available', url: 'facility:swimming-pool' },
  { id: 4,  type: 'Page',   title: 'Convention Hall',           subtitle: 'Up to 500 guests · conference and banquet packages', url: 'facility:convention-hall' },
  { id: 5,  type: 'Page',   title: 'Mission & Vision',          subtitle: 'Our founding principles and long-term strategic vision', url: 'mission-vision' },
  { id: 6,  type: 'Page',   title: 'Terms & Conditions',        subtitle: 'Full membership terms and club rules', url: 'terms' },
  { id: 7,  type: 'Notice', title: '2ND CONVENER COMMITTEE Meeting (Agenda Notice)', subtitle: '03 Jul 2026 · PDF · 180 KB', date: 'Jul 2026' },
  { id: 8,  type: 'Notice', title: 'বকেয়া পরিশোধ সংক্রান্ত বিশেষ নোটিশ',            subtitle: '08 Jul 2026 · PDF · 95 KB',  date: 'Jul 2026' },
  { id: 9,  type: 'Notice', title: 'Annual General Meeting 2026 — Notice of Meeting', subtitle: '11 May 2026 · PDF · 220 KB', date: 'May 2026' },
  { id: 10, type: 'Notice', title: 'দৈনিক আজাদী নিউজ',                              subtitle: '19 May 2026 · JPG · 1.2 MB', date: 'May 2026' },
  { id: 11, type: 'Member', title: 'Niaz Morshed Elite',        subtitle: 'Managing Director · Borotakia Motors · Founding Member', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&auto=format' },
  { id: 12, type: 'Member', title: 'Dr. Rehena Siddiqua',       subtitle: 'Assistant Professor · Asha University · Founding Member', avatar: 'https://images.unsplash.com/photo-1652471943570-f3590a4e52ed?w=80&h=80&fit=crop&auto=format' },
  { id: 13, type: 'Member', title: 'Mamun-Ur-Rashid Chowdhury', subtitle: 'Managing Director · Four H Group · Life Member', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format' },
  { id: 14, type: 'Member', title: 'Hosne Ara-Naz',             subtitle: 'Director · Homeland Insurance · Founding Member', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format' },
  { id: 15, type: 'Album',  title: 'Club Night 2015',           subtitle: '61 photos · 2015', avatar: 'https://images.unsplash.com/photo-1781955781178-6ea29c66e860?w=80&h=80&fit=crop&auto=format' },
  { id: 16, type: 'Album',  title: "Valentine's Day 2014",      subtitle: '38 photos · 2014', avatar: 'https://images.unsplash.com/photo-1545128485-c400e7702796?w=80&h=80&fit=crop&auto=format' },
  { id: 17, type: 'Album',  title: 'Annual Picnic 2014',        subtitle: '52 photos · 2014', avatar: 'https://images.unsplash.com/photo-1680609989998-6183fcea718b?w=80&h=80&fit=crop&auto=format' },
  { id: 18, type: 'Album',  title: 'Pohela Boishakh 2015',      subtitle: '44 photos · 2015', avatar: 'https://images.unsplash.com/photo-1775467225376-1127edc8cc8a?w=80&h=80&fit=crop&auto=format' },
]

const TYPE_COLORS: Record<ResultType, { bg: string; color: string }> = {
  'Page':   { bg: '#EFF6FF', color: '#1D4ED8' },
  'Notice': { bg: T.brandDim, color: T.brand },
  'Member': { bg: '#FFF7E6', color: T.brass },
  'Album':  { bg: '#F0FDF4', color: '#16A34A' },
}

const TYPE_ICON: Record<ResultType, React.ReactNode> = {
  'Page':   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  'Notice': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  'Member': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  'Album':  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
}

const FILTERS: (ResultType | 'All')[] = ['All', 'Page', 'Notice', 'Member', 'Album']

// ─── Highlight matching text ──────────────────────────────────────────────────
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background: '#FDEEA8', color: 'inherit', borderRadius: 2 }}>{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  )
}

// ─── Result row ───────────────────────────────────────────────────────────────
function ResultRow({ result, query }: { result: SearchResult; query: string }) {
  const tc = TYPE_COLORS[result.type]
  const isBangla = result.type === 'Notice' && /[ঀ-৿]/.test(result.title)

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', transition: 'background 140ms', cursor: 'pointer', borderRadius: 12 }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = T.surface50 }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '' }}
    >
      {/* Avatar / icon */}
      {result.avatar ? (
        <div style={{ width: 44, height: 44, borderRadius: result.type === 'Member' ? '50%' : 10, overflow: 'hidden', background: T.surface100, flexShrink: 0, border: result.type === 'Member' ? `1.5px solid rgba(185,139,67,0.40)` : `1px solid ${T.ink100}` }}>
          <img src={result.avatar} alt={result.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
      ) : (
        <div style={{ width: 44, height: 44, borderRadius: 10, background: tc.bg, border: `1px solid ${tc.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: tc.color }}>
          {TYPE_ICON[result.type]}
        </div>
      )}

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: 'CKCL',
            fontSize: isBangla ? 15 : 14,
            fontWeight: 600,
            color: T.ink900,
            marginBottom: 2,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}
        >
          <Highlight text={result.title} query={query} />
        </div>
        <div style={{ fontFamily: 'CKCL', fontSize: 12, color: T.ink400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <Highlight text={result.subtitle} query={query} />
        </div>
      </div>

      {/* Type chip */}
      <span style={{ fontFamily: 'CKCL', fontWeight: 500, fontSize: 9, letterSpacing: '0.07em', color: tc.color, background: tc.bg, border: `1px solid ${tc.color}30`, borderRadius: 999, padding: '4px 9px', flexShrink: 0 }}>{result.type.toUpperCase()}</span>

      {/* Arrow */}
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.ink200} strokeWidth="2.5" style={{ flexShrink: 0 }}><polyline points="9 18 15 12 9 6"/></svg>
    </div>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <div style={{ padding: '72px 24px', textAlign: 'center' }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: T.surface100, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={T.ink200} strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </div>
      <div style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 20, color: T.ink900, marginBottom: 8 }}>No results for "{query}"</div>
      <div style={{ fontFamily: 'CKCL', fontSize: 14, color: T.ink400, lineHeight: 1.65, marginBottom: 24, maxWidth: 360, margin: '0 auto 24px' }}>
        Try a different search term, check your spelling, or browse by section.
      </div>
      <button
        onClick={onClear}
        style={{ padding: '11px 24px', fontFamily: 'CKCL', fontSize: 13, fontWeight: 600, color: T.brand, background: T.brandDim, border: `1px solid rgba(225,11,23,0.20)`, borderRadius: 999, cursor: 'pointer', transition: 'all 160ms' }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = T.brand; (e.currentTarget as HTMLElement).style.color = '#FFFFFF' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = T.brandDim; (e.currentTarget as HTMLElement).style.color = T.brand }}
      >
        Clear search
      </button>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SearchPage({ initialQuery = '' }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery)
  const [filter, setFilter] = useState<ResultType | 'All'>('All')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const results = useMemo(() => {
    const q = query.toLowerCase().trim()
    return ALL_RESULTS.filter((r) => {
      if (filter !== 'All' && r.type !== filter) return false
      if (!q) return true
      return r.title.toLowerCase().includes(q) || r.subtitle.toLowerCase().includes(q)
    })
  }, [query, filter])

  return (
    <div style={{ background: T.surface50, minHeight: '100vh' }}>
      {/* Header band */}
      <div style={{ background: T.surface100, padding: 'clamp(48px,6vw,80px) clamp(24px,5vw,80px) 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(225,11,23,0.07) 0%,transparent 65%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 720, margin: '0 auto clamp(32px,4vw,56px)', position: 'relative', zIndex: 1 }}>
          <div className="eyebrow mb-4" style={{ fontSize: 11, color: T.brass }}>SEARCH</div>

          {/* Large glass search field */}
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              background: 'rgba(255,255,255,0.88)',
              backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
              border: '1.5px solid rgba(226,230,236,0.80)',
              borderRadius: 20,
              padding: '16px 20px',
              boxShadow: '0 8px 32px rgba(14,17,22,0.08)',
              transition: 'border-color 160ms, box-shadow 160ms',
            }}
            onFocusCapture={(e) => { (e.currentTarget as HTMLElement).style.borderColor = T.brand; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px rgba(14,17,22,0.08), 0 0 0 3px rgba(225,11,23,0.12)` }}
            onBlurCapture={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(226,230,236,0.80)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(14,17,22,0.08)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.ink200} strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pages, notices, members, albums…"
              style={{ flex: 1, fontFamily: 'CKCL', fontSize: 18, color: T.ink900, background: 'transparent', border: 'none', outline: 'none' }}
            />
            {query && (
              <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 4, color: T.ink200 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(32px,4vw,48px) clamp(24px,5vw,80px)' }}>
        {/* Filter + result count */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {FILTERS.map((f) => {
              const active = filter === f
              const tc = f !== 'All' ? TYPE_COLORS[f as ResultType] : null
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: '6px 14px',
                    fontFamily: 'CKCL', fontSize: 12, fontWeight: active ? 700 : 500,
                    color: active ? (f === 'All' ? '#FFFFFF' : tc!.color) : T.ink400,
                    background: active ? (f === 'All' ? T.brand : tc!.bg) : '#FFFFFF',
                    border: `1px solid ${active ? (f === 'All' ? T.brand : tc!.color + '50') : T.ink100}`,
                    borderRadius: 999, cursor: 'pointer', transition: 'all 160ms',
                  }}
                >
                  {f}
                </button>
              )
            })}
          </div>
          <div className="eyebrow" style={{ fontSize: 10, color: T.ink200, marginLeft: 'auto' }}>
            {results.length} result{results.length !== 1 ? 's' : ''}{query ? ` for "${query}"` : ''}
          </div>
        </div>

        {/* Results */}
        {results.length === 0 && query ? (
          <EmptyState query={query} onClear={() => setQuery('')} />
        ) : results.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'CKCL', fontSize: 15, color: T.ink400 }}>Start typing to search the CKCL website.</div>
          </div>
        ) : (
          <div style={{ background: '#FFFFFF', borderRadius: 20, border: `1px solid ${T.ink100}`, overflow: 'hidden', padding: '8px 0' }}>
            {results.map((r, i) => (
              <div key={r.id}>
                <ResultRow result={r} query={query} />
                {i < results.length - 1 && <div style={{ height: 1, background: T.surface50, margin: '0 20px' }} />}
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
