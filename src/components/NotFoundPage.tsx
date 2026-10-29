import { useState, useRef, useEffect } from 'react'

const T = {
  ink900: '#0E1116', ink600: '#2A3039', ink400: '#5C6673', ink200: '#A8B0BB', ink100: '#E2E6EC',
  surface50: '#F7F8FA', surface100: '#EEF1F5',
  brand: '#E10B17', brandDim: '#FFF1F2', brass: '#B98B43',
}

type SuggestedLink = { label: string; description: string; page: string; icon: React.ReactNode }
const SUGGESTED_LINKS: SuggestedLink[] = [
  { label: 'Home', description: 'Return to the CKCL home page', page: 'home', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { label: 'Facilities', description: 'Explore our 7 member facilities', page: 'facilities', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><rect x="9" y="12" width="6" height="10" rx="1"/></svg> },
  { label: 'Membership', description: 'Learn how to join the club', page: 'membership-process', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg> },
  { label: 'Contact Us', description: 'Reach the Club Secretariat', page: 'contact', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.77 19.79 19.79 0 01.02 1.18 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg> },
]

export default function NotFoundPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 300) }, [])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: T.surface50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(24px,5vw,80px)',
      }}
    >
      <div style={{ maxWidth: 520, width: '100%' }}>
        {/* Glass card */}
        <div
          style={{
            background: 'rgba(255,255,255,0.82)',
            backdropFilter: 'blur(32px)',
            WebkitBackdropFilter: 'blur(32px)',
            border: '1px solid rgba(255,255,255,0.70)',
            borderRadius: 28,
            padding: 'clamp(40px,5vw,60px)',
            boxShadow: '0 24px 64px rgba(14,17,22,0.10)',
            textAlign: 'center',
          }}
        >
          {/* 404 numeral with glow */}
          <div style={{ position: 'relative', marginBottom: 8 }}>
            <div
              style={{
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 200, height: 140,
                borderRadius: '50%',
                background: 'radial-gradient(ellipse, rgba(225,11,23,0.12) 0%, transparent 70%)',
                filter: 'blur(24px)',
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                fontFamily: 'CKCL',
                fontWeight: 600,
                fontSize: 120,
                lineHeight: 1,
                letterSpacing: '-0.04em',
                color: T.ink900,
                position: 'relative',
                zIndex: 1,
                WebkitTextStroke: '0px',
              }}
            >
              <span style={{ color: T.brand }}>4</span>
              <span>0</span>
              <span style={{ color: T.brand }}>4</span>
            </div>
          </div>

          <h1
            style={{
              fontFamily: 'CKCL',
              fontWeight: 600,
              fontSize: 22,
              color: T.ink900,
              margin: '0 0 10px',
              letterSpacing: '-0.01em',
            }}
          >
            We couldn't find that page.
          </h1>
          <p
            style={{
              fontFamily: 'CKCL',
              fontSize: 14,
              lineHeight: 1.65,
              color: T.ink400,
              margin: '0 0 28px',
            }}
          >
            The page you are looking for may have moved, been renamed, or no longer exists. Try searching below, or use one of the links to find your way.
          </p>

          {/* Search field */}
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              border: `1.5px solid ${T.ink100}`,
              borderRadius: 14,
              background: T.surface50,
              padding: '12px 16px',
              marginBottom: 28,
              transition: 'border-color 160ms, box-shadow 160ms',
            }}
            onFocusCapture={(e) => { (e.currentTarget as HTMLElement).style.borderColor = T.brand; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 3px rgba(225,11,23,0.12)` }}
            onBlurCapture={(e) => { (e.currentTarget as HTMLElement).style.borderColor = T.ink100; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={T.ink200} strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && query.trim()) onNavigate('search') }}
              placeholder="Search the CKCL website…"
              style={{ flex: 1, fontFamily: 'CKCL', fontSize: 15, color: T.ink900, background: 'transparent', border: 'none', outline: 'none' }}
            />
            {query && (
              <button
                onClick={() => onNavigate('search')}
                style={{ padding: '7px 14px', fontFamily: 'CKCL', fontSize: 12, fontWeight: 700, color: '#FFFFFF', background: T.brand, border: 'none', borderRadius: 8, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'background 160ms' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#B70813' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = T.brand }}
              >
                Search
              </button>
            )}
          </div>

          {/* Suggested links */}
          <div style={{ textAlign: 'left' }}>
            <div className="eyebrow mb-3" style={{ fontSize: 9, color: T.ink200, textAlign: 'left' }}>SUGGESTED PAGES</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {SUGGESTED_LINKS.map((link) => (
                <button
                  key={link.page}
                  onClick={() => onNavigate(link.page)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 14px',
                    background: 'transparent',
                    border: `1px solid ${T.ink100}`,
                    borderRadius: 12,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 160ms',
                    width: '100%',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = T.brandDim; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(225,11,23,0.25)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = T.ink100 }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: T.surface100, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: T.ink400 }}>
                    {link.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'CKCL', fontSize: 13, fontWeight: 700, color: T.ink900 }}>{link.label}</div>
                    <div style={{ fontFamily: 'CKCL', fontSize: 11, color: T.ink400, marginTop: 1 }}>{link.description}</div>
                  </div>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.ink200} strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Back home shortcut */}
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <button
            onClick={() => onNavigate('home')}
            style={{ fontFamily: 'CKCL', fontSize: 13, fontWeight: 600, color: T.ink400, background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'color 160ms' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = T.ink900 }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = T.ink400 }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Back to home
          </button>
        </div>
      </div>
    </div>
  )
}
