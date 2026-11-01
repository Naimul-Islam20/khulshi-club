import { useEffect, useRef, useState } from 'react'

const T = {
  ink900: '#0E1116', ink400: '#5C6673', ink200: '#A8B0BB', ink100: '#E2E6EC',
  surface0: '#FFFFFF', brand: '#E10B17',
}

/**
 * Top search panel — opens from the navbar search button.
 * Submitting (Enter / Search) navigates to the results page with ?q=.
 */
export default function SearchOverlay({
  open,
  onClose,
  onSearch,
  initialQuery = '',
}: {
  open: boolean
  onClose: () => void
  onSearch: (q: string) => void
  initialQuery?: string
}) {
  const [q, setQ] = useState(initialQuery)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setQ(initialQuery)
      const id = window.requestAnimationFrame(() => inputRef.current?.focus())
      return () => window.cancelAnimationFrame(id)
    }
  }, [open, initialQuery])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const submit = () => {
    const next = q.trim()
    if (next.length < 2) {
      inputRef.current?.focus()
      return
    }
    onSearch(next)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200 }} role="dialog" aria-modal="true" aria-label="Search">
      <div
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(14,17,22,0.45)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
      />
      <div
        style={{
          position: 'relative',
          background: T.surface0,
          borderBottom: `1px solid ${T.ink100}`,
          boxShadow: '0 16px 40px rgba(14,17,22,0.12)',
          padding: '18px clamp(16px,4vw,40px) 20px',
          animation: 'searchDrop 220ms cubic-bezier(.22,1,.36,1) both',
        }}
      >
        <style>{`@keyframes searchDrop{from{transform:translateY(-100%);opacity:.4}to{transform:translateY(0);opacity:1}}`}</style>
        <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              height: 52,
              padding: '0 16px',
              borderRadius: 14,
              border: `1.5px solid ${T.ink100}`,
              background: '#F7F8FA',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.ink200} strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') submit() }}
              placeholder="Search pages, notices, members, albums…"
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'CKCL', fontSize: 16, color: T.ink900 }}
            />
            {q && (
              <button type="button" onClick={() => setQ('')} aria-label="Clear" style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.ink200, display: 'flex', padding: 4 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={submit}
            style={{ height: 52, padding: '0 22px', borderRadius: 14, border: 'none', background: T.brand, color: '#FFF', fontFamily: 'CKCL', fontWeight: 700, fontSize: 14, cursor: 'pointer', flexShrink: 0 }}
          >
            Search
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            style={{ width: 44, height: 44, borderRadius: 12, border: `1px solid ${T.ink100}`, background: T.surface0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.ink400, flexShrink: 0 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div style={{ maxWidth: 880, margin: '10px auto 0', fontFamily: 'CKCL', fontSize: 12, color: T.ink400 }}>
          Type at least 2 characters, then press Enter to open results.
        </div>
      </div>
    </div>
  )
}
