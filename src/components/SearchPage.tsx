import { useMemo, useState } from 'react'
import Footer from './Footer'
import { hrefToAppPage, useSiteSearch, type SearchResult, type SearchResultType } from '../lib/search'

const T = {
  ink900: '#0E1116', ink600: '#2A3039', ink400: '#5C6673', ink200: '#A8B0BB', ink100: '#E2E6EC',
  surface50: '#F7F8FA', surface100: '#EEF1F5',
  brand: '#E10B17', brandDim: '#FFF1F2', brass: '#B98B43',
}

const TYPE_COLORS: Record<SearchResultType, { bg: string; color: string }> = {
  Page: { bg: '#EFF6FF', color: '#1D4ED8' },
  Notice: { bg: T.brandDim, color: T.brand },
  Member: { bg: '#FFF7E6', color: T.brass },
  Album: { bg: '#F0FDF4', color: '#16A34A' },
  News: { bg: '#F5F3FF', color: '#6D28D9' },
  Facility: { bg: '#ECFEFF', color: '#0E7490' },
}

const TYPE_ICON: Record<SearchResultType, React.ReactNode> = {
  Page: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Notice: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  Member: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Album: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  News: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8M15 18h-5M10 6h8v4h-8V6z"/></svg>,
  Facility: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18"/><path d="M5 21V9l7-5 7 5v12"/><path d="M9 21v-6h6v6"/></svg>,
}

const FILTERS: (SearchResultType | 'All')[] = ['All', 'Page', 'Notice', 'Member', 'Album', 'News', 'Facility']

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

function ResultRow({ result, query, onOpen }: { result: SearchResult; query: string; onOpen: (r: SearchResult) => void }) {
  const tc = TYPE_COLORS[result.type]
  const isBangla = /[\u0980-\u09FF]/.test(result.title)

  return (
    <button
      type="button"
      onClick={() => onOpen(result)}
      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', transition: 'background 140ms', cursor: 'pointer', borderRadius: 12, border: 'none', background: 'transparent', textAlign: 'left' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = T.surface50 }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
    >
      {result.avatar ? (
        <div style={{ width: 44, height: 44, borderRadius: result.type === 'Member' ? '50%' : 10, overflow: 'hidden', background: T.surface100, flexShrink: 0, border: result.type === 'Member' ? '1.5px solid rgba(185,139,67,0.40)' : `1px solid ${T.ink100}` }}>
          <img src={result.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
      ) : (
        <div style={{ width: 44, height: 44, borderRadius: 10, background: tc.bg, border: `1px solid ${tc.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: tc.color }}>
          {TYPE_ICON[result.type]}
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'CKCL', fontSize: isBangla ? 15 : 14, fontWeight: 600, color: T.ink900, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <Highlight text={result.title} query={query} />
        </div>
        <div style={{ fontFamily: 'CKCL', fontSize: 12, color: T.ink400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <Highlight text={result.subtitle} query={query} />
        </div>
      </div>

      <span style={{ fontFamily: 'CKCL', fontWeight: 500, fontSize: 9, letterSpacing: '0.07em', color: tc.color, background: tc.bg, border: `1px solid ${tc.color}30`, borderRadius: 999, padding: '4px 9px', flexShrink: 0 }}>{result.type.toUpperCase()}</span>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.ink200} strokeWidth="2.5" style={{ flexShrink: 0 }}><polyline points="9 18 15 12 9 6"/></svg>
    </button>
  )
}

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
        style={{ padding: '11px 24px', fontFamily: 'CKCL', fontSize: 13, fontWeight: 600, color: T.brand, background: T.brandDim, border: '1px solid rgba(225,11,23,0.20)', borderRadius: 999, cursor: 'pointer' }}
      >
        Clear search
      </button>
    </div>
  )
}

export default function SearchPage({
  initialQuery = '',
  onNavigate,
  onOpenSearch,
}: {
  initialQuery?: string
  onNavigate?: (page: string) => void
  onOpenSearch?: () => void
}) {
  const query = initialQuery.trim()
  const [filter, setFilter] = useState<SearchResultType | 'All'>('All')
  const { results: apiResults, loading, error } = useSiteSearch(query)

  const results = useMemo(() => {
    if (filter === 'All') return apiResults
    return apiResults.filter((r) => r.type === filter)
  }, [apiResults, filter])

  const openResult = (r: SearchResult) => {
    const page = hrefToAppPage(r.href)
    if (page && onNavigate) {
      onNavigate(page)
      return
    }
    if (r.href.startsWith('http')) {
      window.open(r.href, '_blank', 'noopener,noreferrer')
      return
    }
    if (r.href.startsWith('/')) window.location.href = r.href
  }

  return (
    <div style={{ background: T.surface50, minHeight: '100vh' }}>
      <div style={{ background: T.surface100, padding: 'clamp(48px,6vw,80px) clamp(24px,5vw,80px) 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(225,11,23,0.07) 0%,transparent 65%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 720, margin: '0 auto clamp(32px,4vw,56px)', position: 'relative', zIndex: 1 }}>
          <div className="eyebrow mb-4" style={{ fontSize: 11, color: T.brass }}>SEARCH RESULTS</div>
          <h1 style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 'clamp(28px,4vw,40px)', color: T.ink900, margin: '0 0 12px', letterSpacing: '-0.02em' }}>
            {query ? <>Results for “{query}”</> : 'Search the club'}
          </h1>
          <p style={{ fontFamily: 'CKCL', fontSize: 15, color: T.ink400, margin: '0 0 20px', lineHeight: 1.55 }}>
            Matching pages, notices, members, albums and facilities from the live club site.
          </p>
          <button
            type="button"
            onClick={onOpenSearch}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, width: '100%',
              background: 'rgba(255,255,255,0.88)', border: '1.5px solid rgba(226,230,236,0.80)',
              borderRadius: 16, padding: '14px 18px', cursor: 'pointer', textAlign: 'left',
              boxShadow: '0 8px 32px rgba(14,17,22,0.06)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.ink200} strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <span style={{ flex: 1, fontFamily: 'CKCL', fontSize: 16, color: query ? T.ink900 : T.ink200 }}>{query || 'Search again…'}</span>
            <span style={{ fontFamily: 'CKCL', fontSize: 12, fontWeight: 600, color: T.brand }}>Edit</span>
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(32px,4vw,48px) clamp(24px,5vw,80px)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {FILTERS.map((f) => {
              const active = filter === f
              const tc = f !== 'All' ? TYPE_COLORS[f as SearchResultType] : null
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: '6px 14px',
                    fontFamily: 'CKCL', fontSize: 12, fontWeight: active ? 700 : 500,
                    color: active ? (f === 'All' ? '#FFFFFF' : tc!.color) : T.ink400,
                    background: active ? (f === 'All' ? T.brand : tc!.bg) : '#FFFFFF',
                    border: `1px solid ${active ? (f === 'All' ? T.brand : `${tc!.color}50`) : T.ink100}`,
                    borderRadius: 999, cursor: 'pointer',
                  }}
                >
                  {f}
                </button>
              )
            })}
          </div>
          <div className="eyebrow" style={{ fontSize: 10, color: T.ink200, marginLeft: 'auto' }}>
            {loading ? 'Searching…' : `${results.length} result${results.length !== 1 ? 's' : ''}${query ? ` for "${query}"` : ''}`}
          </div>
        </div>

        {error && (
          <div style={{ fontFamily: 'CKCL', fontSize: 14, color: T.brand, padding: '20px 0' }}>{error}</div>
        )}

        {!error && loading && (
          <div style={{ fontFamily: 'CKCL', fontSize: 14, color: T.ink400, padding: '40px 0', textAlign: 'center' }}>Searching the club…</div>
        )}

        {!error && !loading && query.length < 2 && (
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'CKCL', fontSize: 15, color: T.ink400 }}>Use the search bar above to find pages, notices, members and more.</div>
          </div>
        )}

        {!error && !loading && query.length >= 2 && results.length === 0 && (
          <EmptyState query={query} onClear={() => onOpenSearch?.()} />
        )}

        {!error && !loading && results.length > 0 && (
          <div style={{ background: '#FFFFFF', borderRadius: 20, border: `1px solid ${T.ink100}`, overflow: 'hidden', padding: '8px 0' }}>
            {results.map((r, i) => (
              <div key={`${r.type}-${r.id}-${i}`}>
                <ResultRow result={r} query={query} onOpen={openResult} />
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
