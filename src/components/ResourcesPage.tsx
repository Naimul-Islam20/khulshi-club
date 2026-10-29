import { useState, useRef, useEffect } from 'react'
import Footer from './Footer'
import SubTabs from './SubTabs'
import { MEMBERS, type Member, type MemberTier } from '../data/members'

// ─── Design tokens ────────────────────────────────────────────────────────────
const T = {
  ink900: '#0E1116', ink600: '#2A3039', ink400: '#5C6673', ink200: '#A8B0BB', ink100: '#E2E6EC',
  surface50: '#F7F8FA', surface100: '#EEF1F5',
  brand: '#E10B17', brandDim: '#FFF1F2',
  brass: '#B98B43', brassDim: '#FFF7E6',
  green: '#16A34A', greenDim: '#DCFCE7',
  amber: '#D97706', amberDim: '#FFFBEB',
  blue: '#1D4ED8', blueDim: '#EFF6FF',
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
type ResourceTab = 'reports' | 'dues'
const TABS: { id: ResourceTab; label: string }[] = [
  { id: 'reports', label: 'Annual Reports' },
  { id: 'dues',    label: 'Club Dues' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// ANNUAL REPORTS DATA
// ═══════════════════════════════════════════════════════════════════════════════
type Report = {
  id: number; year: string; title: string; subtitle: string; pages: number; size: string
  cover: string; featured?: boolean; publishedDate: string
}

const REPORTS: Report[] = [
  {
    id: 1, year: '2025–26', featured: true,
    title: 'Annual Report 2025–26',
    subtitle: 'Financial statements, committee proceedings, facility upgrades, and membership highlights for the year ending June 2026.',
    pages: 84, size: '12.4 MB',
    publishedDate: 'August 2026',
    cover: 'https://images.unsplash.com/photo-1700514077430-3659e38eb5e7?w=480&h=640&fit=crop&auto=format',
  },
  {
    id: 2, year: '2024–25',
    title: 'Annual Report 2024–25',
    subtitle: 'Year in review, audited accounts, and strategic outlook.',
    pages: 76, size: '9.8 MB',
    publishedDate: 'September 2025',
    cover: 'https://images.unsplash.com/photo-1720623784273-f9388b9aa535?w=480&h=640&fit=crop&auto=format',
  },
  {
    id: 3, year: '2023–24',
    title: 'Annual Report 2023–24',
    subtitle: 'Ten-year anniversary edition — financial statements and membership growth.',
    pages: 92, size: '14.2 MB',
    publishedDate: 'August 2024',
    cover: 'https://images.unsplash.com/photo-1545128485-c400e7702796?w=480&h=640&fit=crop&auto=format',
  },
  {
    id: 4, year: '2022–23',
    title: 'Annual Report 2022–23',
    subtitle: 'Post-pandemic recovery, facility reinvestment, and new memberships.',
    pages: 68, size: '8.1 MB',
    publishedDate: 'October 2023',
    cover: 'https://images.unsplash.com/photo-1676302144341-10563603f99a?w=480&h=640&fit=crop&auto=format',
  },
  {
    id: 5, year: '2021–22',
    title: 'Annual Report 2021–22',
    subtitle: 'Resilience and growth through a challenging year.',
    pages: 60, size: '7.4 MB',
    publishedDate: 'November 2022',
    cover: 'https://images.unsplash.com/photo-1602081115720-72e5b0a254b8?w=480&h=640&fit=crop&auto=format',
  },
  {
    id: 6, year: '2020–21',
    title: 'Annual Report 2020–21',
    subtitle: 'Navigating extraordinary circumstances — financial statements and outlook.',
    pages: 55, size: '6.9 MB',
    publishedDate: 'December 2021',
    cover: 'https://images.unsplash.com/photo-1572331165267-854da2b10ccc?w=480&h=640&fit=crop&auto=format',
  },
  {
    id: 7, year: '2019–20',
    title: 'Annual Report 2019–20',
    subtitle: 'Membership milestones, convention hall expansion, and five-year outlook.',
    pages: 72, size: '10.1 MB',
    publishedDate: 'October 2020',
    cover: 'https://images.unsplash.com/photo-1643101570532-88c8ecc07c1f?w=480&h=640&fit=crop&auto=format',
  },
]

// ─── PDF Viewer ───────────────────────────────────────────────────────────────
function ReportViewer({ report, onClose }: { report: Report; onClose: () => void }) {
  const [zoom, setZoom] = useState(100)
  const [page, setPage] = useState(1)

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(14,17,22,0.90)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', display: 'flex', flexDirection: 'column' }}
      onClick={onClose}
    >
      {/* Top bar */}
      <div
        style={{ background: 'rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'CKCL', fontSize: 14, fontWeight: 600, color: '#FFFFFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{report.title}</div>
          <div style={{ fontFamily: 'CKCL', fontSize: 10, color: 'rgba(255,255,255,0.40)', marginTop: 2 }}>{report.pages} pages · {report.size}</div>
        </div>

        {/* Page nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} style={overlayBtn}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.80)" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg></button>
          <span style={{ fontFamily: 'CKCL', fontSize: 11, color: 'rgba(255,255,255,0.55)', minWidth: 64, textAlign: 'center' }}>p. {page} / {report.pages}</span>
          <button onClick={() => setPage((p) => Math.min(report.pages, p + 1))} disabled={page === report.pages} style={overlayBtn}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.80)" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg></button>
        </div>

        {/* Zoom */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button onClick={() => setZoom((z) => Math.max(50, z - 25))} style={overlayBtn}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.80)" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="8" y1="11" x2="14" y2="11"/></svg></button>
          <span style={{ fontFamily: 'CKCL', fontSize: 11, color: 'rgba(255,255,255,0.55)', minWidth: 36, textAlign: 'center' }}>{zoom}%</span>
          <button onClick={() => setZoom((z) => Math.min(200, z + 25))} style={overlayBtn}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.80)" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg></button>
        </div>

        <button style={overlayBtn}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.80)" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button>
        <button onClick={onClose} style={overlayBtn}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.80)" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>

      {/* Page */}
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: 24 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ width: `${zoom}%`, maxWidth: 720, minWidth: 300, background: '#FFFFFF', borderRadius: 10, boxShadow: '0 20px 64px rgba(0,0,0,0.40)', padding: 48, transition: 'width 200ms' }}>
          {/* Simulated report page */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: `2px solid ${T.brand}`, paddingBottom: 20, marginBottom: 24 }}>
            <div>
              <div style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 20, color: T.ink900 }}>Chittagong Khulshi Club Limited</div>
              <div style={{ fontFamily: 'CKCL', fontSize: 12, color: T.ink400, marginTop: 2 }}>{report.title}</div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: T.brand, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'CKCL', fontWeight: 700, fontSize: 14, color: '#FFFFFF', flexShrink: 0 }}>CK</div>
          </div>

          {page === 1 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 28, color: T.ink900, lineHeight: 1.15 }}>{report.title}</div>
              <div style={{ fontFamily: 'CKCL', fontSize: 14, color: T.ink400, lineHeight: 1.65 }}>{report.subtitle}</div>
              <img src={report.cover} alt="Cover" style={{ width: '100%', borderRadius: 8, marginTop: 8 }} />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 18, color: T.ink900, marginBottom: 8 }}>Page {page}</div>
              {[...Array(8)].map((_, i) => (
                <div key={i} style={{ height: 12, background: T.surface100, borderRadius: 4, width: i % 4 === 3 ? '60%' : '100%' }} />
              ))}
              <div style={{ height: 80, background: T.surface100, borderRadius: 8, marginTop: 8 }} />
              {[...Array(4)].map((_, i) => (
                <div key={i} style={{ height: 12, background: T.surface100, borderRadius: 4, width: i % 3 === 2 ? '75%' : '100%' }} />
              ))}
            </div>
          )}

          <div style={{ fontFamily: 'CKCL', fontSize: 10, color: T.ink200, textAlign: 'center', marginTop: 40, paddingTop: 16, borderTop: `1px solid ${T.ink100}` }}>
            Chittagong Khulshi Club Limited · {report.title} · Page {page} of {report.pages}
          </div>
        </div>
      </div>

      <div style={{ padding: '8px', textAlign: 'center', flexShrink: 0 }}>
        <span style={{ fontFamily: 'CKCL', fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>Press ESC to close · ← → to navigate pages</span>
      </div>
    </div>
  )
}

// ─── Annual Reports Section ───────────────────────────────────────────────────
function ReportsSection() {
  const [viewing, setViewing] = useState<Report | null>(null)
  const featured = REPORTS.find((r) => r.featured)!
  const rest = REPORTS.filter((r) => !r.featured)

  return (
    <>
      {viewing && <ReportViewer report={viewing} onClose={() => setViewing(null)} />}

      {/* Featured report card — mobile: cover stacked above the content; from sm: cover column beside it */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 24,
          border: `1px solid rgba(185,139,67,0.30)`,
          overflow: 'hidden',
          marginBottom: 40,
          boxShadow: '0 4px 20px rgba(14,17,22,0.08)',
        }}
        className="grid grid-cols-1 sm:grid-cols-[200px_1fr]"
      >
        {/* Cover thumbnail */}
        <div className="h-44 sm:h-auto" style={{ position: 'relative', overflow: 'hidden', background: T.surface100 }}>
          <img src={featured.cover} alt={featured.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent, rgba(14,17,22,0.06))' }} />
        </div>

        {/* Content */}
        <div style={{ padding: 'clamp(20px,3vw,40px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'CKCL', fontSize: 9, fontWeight: 500, letterSpacing: '0.08em', color: T.brass, background: T.brassDim, border: `1px solid ${T.brass}40`, borderRadius: 999, padding: '4px 10px' }}>LATEST REPORT</span>
            <span className="eyebrow" style={{ fontSize: 10, color: T.ink200 }}>{featured.publishedDate}</span>
          </div>

          <div style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 'clamp(20px,2.5vw,30px)', color: T.ink900, lineHeight: 1.15, letterSpacing: '-0.01em' }}>{featured.title}</div>
          <p style={{ fontFamily: 'CKCL', fontSize: 14, color: T.ink400, lineHeight: 1.65, margin: 0, maxWidth: 520 }}>{featured.subtitle}</p>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginTop: 4 }}>
            <div style={{ display: 'flex', gap: 16 }}>
              {[{ icon: '📄', label: `${featured.pages} pages` }, { icon: '💾', label: featured.size }].map((m) => (
                <div key={m.label} style={{ fontFamily: 'CKCL', fontSize: 12, color: T.ink400, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ fontSize: 13 }}>{m.icon}</span>{m.label}
                </div>
              ))}
            </div>

            {/* Mobile: full-width pair on its own row; from sm: pushed right */}
            <div className="w-full sm:w-auto sm:ml-auto" style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setViewing(featured)}
                className="flex-1 sm:flex-none"
                style={{ whiteSpace: 'nowrap', padding: '10px 20px', fontFamily: 'CKCL', fontSize: 13, fontWeight: 700, color: '#FFFFFF', background: T.brand, border: 'none', borderRadius: 999, cursor: 'pointer', transition: 'background 160ms' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#B70813' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = T.brand }}
              >
                View Report
              </button>
              <button
                className="flex-1 sm:flex-none"
                style={{ whiteSpace: 'nowrap', padding: '10px 16px', fontFamily: 'CKCL', fontSize: 13, fontWeight: 600, color: T.ink600, background: T.surface100, border: `1px solid ${T.ink100}`, borderRadius: 999, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 160ms' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = T.ink100 }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = T.surface100 }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Year-grouped list */}
      <div className="eyebrow mb-4" style={{ fontSize: 10, color: T.brass }}>PREVIOUS REPORTS</div>
      <div style={{ background: '#FFFFFF', borderRadius: 20, border: `1px solid ${T.ink100}`, overflow: 'hidden' }}>
        {rest.map((report, i) => (
          <div
            key={report.id}
            style={{
              display: 'flex', alignItems: 'center', gap: 16,
              padding: '18px 24px',
              borderBottom: i < rest.length - 1 ? `1px solid ${T.ink100}` : 'none',
              transition: 'background 140ms',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = T.surface50 }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '' }}
          >
            {/* Year badge */}
            <div
              style={{
                width: 72, height: 52,
                background: T.surface100,
                borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 14, color: T.ink900, letterSpacing: '-0.01em' }}>{report.year}</span>
            </div>

            {/* Title */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 14, color: T.ink900, marginBottom: 3 }}>{report.title}</div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'CKCL', fontSize: 10, color: T.ink200 }}>{report.pages} pp</span>
                <span style={{ fontFamily: 'CKCL', fontSize: 10, color: T.ink200 }}>{report.size}</span>
                <span style={{ fontFamily: 'CKCL', fontSize: 11, color: T.ink200 }}>Published {report.publishedDate}</span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button
                onClick={() => setViewing(report)}
                style={{ padding: '8px 16px', fontFamily: 'CKCL', fontSize: 12, fontWeight: 600, color: T.brand, background: T.brandDim, border: `1px solid rgba(225,11,23,0.20)`, borderRadius: 8, cursor: 'pointer', transition: 'all 140ms' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = T.brand; (e.currentTarget as HTMLElement).style.color = '#FFFFFF' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = T.brandDim; (e.currentTarget as HTMLElement).style.color = T.brand }}
              >
                View
              </button>
              <button
                style={{ width: 34, height: 34, borderRadius: 8, background: T.surface100, border: `1px solid ${T.ink100}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 140ms' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = T.ink100 }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = T.surface100 }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.ink400} strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLUB DUES DATA
// ═══════════════════════════════════════════════════════════════════════════════
type DueStatus = 'Paid' | 'Overdue' | 'Upcoming'
type DueEntry = {
  id: number; period: string; description: string; amount: number; dueDate: string; paidDate?: string; status: DueStatus
}

const DUES: DueEntry[] = [
  { id: 1,  period: 'Jul 2025 – Jun 2026', description: 'Annual Subscription FY 2025–26',    amount: 12000, dueDate: '01 Jul 2025', paidDate: '28 Jun 2025', status: 'Paid' },
  { id: 2,  period: 'Jul 2025 – Jun 2026', description: 'Convention Hall Booking — Oct 2025', amount: 8500,  dueDate: '01 Oct 2025', paidDate: '30 Sep 2025', status: 'Paid' },
  { id: 3,  period: 'Jul 2025 – Jun 2026', description: 'Guest House (2 nights) — Nov 2025',  amount: 4000,  dueDate: '15 Nov 2025', paidDate: '14 Nov 2025', status: 'Paid' },
  { id: 4,  period: 'Jul 2026 – Jun 2027', description: 'Annual Subscription FY 2026–27',    amount: 12000, dueDate: '01 Jul 2026', status: 'Overdue' },
  { id: 5,  period: 'Jul 2026 – Jun 2027', description: 'Late Payment Surcharge (10%)',       amount:  500,  dueDate: '01 Oct 2026', status: 'Overdue' },
  { id: 6,  period: 'Jul 2026 – Jun 2027', description: 'Swimming Pool Seasonal Pass',        amount: 3600,  dueDate: '15 Oct 2026', status: 'Upcoming' },
]

const OUTSTANDING = DUES.filter((d) => d.status !== 'Paid').reduce((s, d) => s + d.amount, 0)

type PayMethod = 'card' | 'bkash' | 'nagad' | 'bank'
const PAY_METHODS: { id: PayMethod; label: string; icon: React.ReactNode }[] = [
  {
    id: 'card', label: 'Card',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  },
  {
    id: 'bkash', label: 'bKash',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" fill="#E2136E" opacity=".12"/><text x="12" y="16" textAnchor="middle" fontSize="9" fontFamily="CKCL" fontWeight="700" fill="#E2136E">bK</text></svg>,
  },
  {
    id: 'nagad', label: 'Nagad',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" fill="#F26522" opacity=".12"/><text x="12" y="16" textAnchor="middle" fontSize="8" fontFamily="CKCL" fontWeight="700" fill="#F26522">N</text></svg>,
  },
  {
    id: 'bank', label: 'Bank Transfer',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>,
  },
]

// ─── Status chip ──────────────────────────────────────────────────────────────
function StatusChip({ status }: { status: DueStatus }) {
  const styles: Record<DueStatus, { bg: string; color: string }> = {
    Paid:     { bg: T.greenDim, color: T.green },
    Overdue:  { bg: T.amberDim, color: T.amber },
    Upcoming: { bg: T.blueDim, color: T.blue },
  }
  const s = styles[status]
  return (
    <span style={{ fontFamily: 'CKCL', fontWeight: 500, fontSize: 9, letterSpacing: '0.07em', color: s.color, background: s.bg, border: `1px solid ${s.color}30`, borderRadius: 999, padding: '4px 9px', whiteSpace: 'nowrap' }}>
      {status.toUpperCase()}
    </span>
  )
}

// ─── Payment success screen ───────────────────────────────────────────────────
function PaymentSuccess({ amount, onDone }: { amount: number; onDone: () => void }) {
  const ref = `TXN${Math.random().toString(36).slice(2, 10).toUpperCase()}`
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 420, gap: 0 }}>
      <div style={{ background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', border: `1px solid ${T.ink100}`, borderRadius: 28, padding: 'clamp(36px,4vw,52px)', maxWidth: 420, width: '100%', textAlign: 'center', boxShadow: '0 16px 48px rgba(14,17,22,0.10)' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: T.greenDim, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: T.green, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
        </div>

        <div style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 24, color: T.ink900, marginBottom: 6 }}>Payment successful.</div>
        <div style={{ fontFamily: 'CKCL', fontSize: 14, color: T.ink400, lineHeight: 1.6, marginBottom: 24 }}>Your payment has been processed. A receipt has been sent to your registered email address.</div>

        <div style={{ background: T.surface50, border: `1px solid ${T.ink100}`, borderRadius: 14, padding: '16px 20px', marginBottom: 24 }}>
          <div style={{ fontFamily: 'CKCL', fontSize: 11, color: T.ink200, marginBottom: 4 }}>AMOUNT PAID</div>
          <div style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 28, color: T.ink900, letterSpacing: '-0.01em' }}>৳ {amount.toLocaleString('en-BD')}</div>
          <div style={{ height: 1, background: T.ink100, margin: '14px 0' }} />
          <div style={{ fontFamily: 'CKCL', fontSize: 11, color: T.ink200, marginBottom: 3 }}>TRANSACTION ID</div>
          <div style={{ fontFamily: 'CKCL', fontWeight: 500, fontSize: 13, color: T.ink600, letterSpacing: '0.06em' }}>{ref}</div>
        </div>

        <button
          onClick={onDone}
          style={{ width: '100%', padding: '13px', fontFamily: 'CKCL', fontSize: 14, fontWeight: 700, color: '#FFFFFF', background: T.green, border: 'none', borderRadius: 999, cursor: 'pointer', transition: 'background 160ms' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#15803D' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = T.green }}
        >
          Done
        </button>
      </div>
    </div>
  )
}

// ─── Payment failed screen ────────────────────────────────────────────────────
function PaymentFailed({ onRetry }: { onRetry: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 380 }}>
      <div style={{ background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', border: `1px solid ${T.ink100}`, borderRadius: 28, padding: 'clamp(36px,4vw,52px)', maxWidth: 420, width: '100%', textAlign: 'center', boxShadow: '0 16px 48px rgba(14,17,22,0.10)' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#FFF1F2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: T.brand, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </div>
        </div>

        <div style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 24, color: T.ink900, marginBottom: 6 }}>Payment failed.</div>
        <div style={{ fontFamily: 'CKCL', fontSize: 14, color: T.ink400, lineHeight: 1.6, marginBottom: 20 }}>Your payment could not be processed at this time. No amount has been charged. Please try again or contact the club office.</div>

        <div style={{ background: '#FFF1F2', border: '1px solid rgba(225,11,23,0.15)', borderRadius: 12, padding: '14px 18px', marginBottom: 24 }}>
          <div style={{ fontFamily: 'CKCL', fontSize: 13, color: T.ink600, marginBottom: 8 }}>Need help? Contact us:</div>
          <a href="tel:+8801988896906" style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 18, color: T.brand, textDecoration: 'none', display: 'block', marginBottom: 2 }}>+880 1988 896 906</a>
          <div style={{ fontFamily: 'CKCL', fontSize: 12, color: T.ink400 }}>Club Secretary · Sat–Thu 10 AM – 6 PM</div>
        </div>

        <button
          onClick={onRetry}
          style={{ width: '100%', padding: '13px', fontFamily: 'CKCL', fontSize: 14, fontWeight: 700, color: '#FFFFFF', background: T.brand, border: 'none', borderRadius: 999, cursor: 'pointer', transition: 'background 160ms', marginBottom: 10 }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#B70813' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = T.brand }}
        >
          Try again
        </button>
        <div style={{ fontFamily: 'CKCL', fontSize: 12, color: T.ink200 }}>Error code: PAYMENT_DECLINED · {new Date().toLocaleTimeString()}</div>
      </div>
    </div>
  )
}

// ─── Payment summary card ─────────────────────────────────────────────────────
type PayState = 'idle' | 'processing' | 'success' | 'failed'

function PaymentCard() {
  const [method, setMethod] = useState<PayMethod>('bkash')
  const [payState, setPayState] = useState<PayState>('idle')
  const overdueDues = DUES.filter((d) => d.status === 'Overdue')

  const simulatePay = () => {
    setPayState('processing')
    setTimeout(() => setPayState(Math.random() > 0.25 ? 'success' : 'failed'), 2200)
  }

  if (payState === 'success') {
    return <PaymentSuccess amount={OUTSTANDING} onDone={() => setPayState('idle')} />
  }
  if (payState === 'failed') {
    return <PaymentFailed onRetry={() => setPayState('idle')} />
  }

  return (
    <div
      id="pay-card"
      style={{
        position: 'sticky',
        top: 100,
        background: 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
        border: `1px solid rgba(185,139,67,0.30)`,
        borderRadius: 24,
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(14,17,22,0.08)',
      }}
    >
      {/* Header band */}
      <div style={{ background: 'linear-gradient(135deg,rgba(225,11,23,0.06) 0%,rgba(185,139,67,0.06) 100%)', padding: '24px 24px 20px', borderBottom: `1px solid ${T.ink100}` }}>
        <div className="eyebrow" style={{ fontSize: 10, color: T.brass, marginBottom: 10 }}>OUTSTANDING BALANCE</div>
        <div style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 38, color: T.ink900, letterSpacing: '-0.02em', lineHeight: 1 }}>
          <span style={{ fontFamily: 'CKCL', fontSize: 20, verticalAlign: 'super', marginRight: 2, fontWeight: 700 }}>৳</span>
          {OUTSTANDING.toLocaleString('en-BD')}
        </div>
        <div style={{ fontFamily: 'CKCL', fontSize: 12, color: T.ink400, marginTop: 6 }}>Due immediately — incl. late surcharge</div>
      </div>

      {/* Breakdown */}
      <div style={{ padding: '18px 24px', borderBottom: `1px solid ${T.ink100}` }}>
        <div className="eyebrow mb-3" style={{ fontSize: 9, color: T.ink200 }}>BREAKDOWN</div>
        {overdueDues.map((d) => (
          <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${T.surface100}` }}>
            <span style={{ fontFamily: 'CKCL', fontSize: 12, color: T.ink400, flex: 1, paddingRight: 8, lineHeight: 1.4 }}>{d.description}</span>
            <span style={{ fontFamily: 'CKCL', fontWeight: 500, fontSize: 13, color: T.amber, whiteSpace: 'nowrap' }}>৳ {d.amount.toLocaleString('en-BD')}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10 }}>
          <span style={{ fontFamily: 'CKCL', fontSize: 13, fontWeight: 700, color: T.ink900 }}>Total</span>
          <span style={{ fontFamily: 'CKCL', fontWeight: 500, fontSize: 14, color: T.ink900 }}>৳ {OUTSTANDING.toLocaleString('en-BD')}</span>
        </div>
      </div>

      {/* Payment method selector */}
      <div style={{ padding: '18px 24px', borderBottom: `1px solid ${T.ink100}` }}>
        <div className="eyebrow mb-3" style={{ fontSize: 9, color: T.ink200 }}>PAY WITH</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {PAY_METHODS.map((pm) => {
            const active = method === pm.id
            return (
              <button
                key={pm.id}
                onClick={() => setMethod(pm.id)}
                style={{
                  padding: '11px 12px',
                  background: active ? '#FFF1F2' : '#FFFFFF',
                  border: `1.5px solid ${active ? T.brand : T.ink100}`,
                  borderRadius: 12,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'all 160ms',
                  boxShadow: active ? `0 0 0 3px rgba(225,11,23,0.10)` : 'none',
                  color: active ? T.brand : T.ink400,
                }}
              >
                {pm.icon}
                <span style={{ fontFamily: 'CKCL', fontSize: 12, fontWeight: active ? 700 : 500, color: active ? T.brand : T.ink600 }}>{pm.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Pay button */}
      <div style={{ padding: '18px 24px' }}>
        <button
          onClick={simulatePay}
          disabled={payState === 'processing'}
          style={{
            width: '100%',
            padding: '15px',
            fontFamily: 'CKCL',
            fontSize: 15,
            fontWeight: 700,
            color: '#FFFFFF',
            background: payState === 'processing' ? '#B70813' : T.brand,
            border: 'none',
            borderRadius: 999,
            cursor: payState === 'processing' ? 'default' : 'pointer',
            transition: 'background 160ms',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            letterSpacing: '-0.01em',
          }}
          onMouseEnter={(e) => { if (payState !== 'processing') (e.currentTarget as HTMLElement).style.background = '#B70813' }}
          onMouseLeave={(e) => { if (payState !== 'processing') (e.currentTarget as HTMLElement).style.background = T.brand }}
        >
          {payState === 'processing' ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" style={{ animation: 'spin 0.8s linear infinite' }}><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
              Processing…
            </>
          ) : (
            <>
              Pay <span style={{ fontFamily: 'CKCL' }}>৳</span> {OUTSTANDING.toLocaleString('en-BD')}
            </>
          )}
        </button>
        <div style={{ fontFamily: 'CKCL', fontSize: 11, color: T.ink200, textAlign: 'center', marginTop: 10, display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'center' }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={T.ink200} strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          Secured by SSL encryption
        </div>
      </div>
    </div>
  )
}

// ─── Dues statement table ─────────────────────────────────────────────────────
function DuesTable() {
  const cols = ['Period', 'Description', 'Amount', 'Due Date', 'Status', '']

  return (
    <div className="hidden sm:block" style={{ background: '#FFFFFF', borderRadius: 20, border: `1px solid ${T.ink100}`, overflow: 'hidden' }}>
      {/* Table header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 2.4fr 1.2fr 1.2fr 1fr 0.7fr',
          background: T.surface50,
          borderBottom: `1px solid ${T.ink100}`,
          padding: '0 20px',
        }}
        className="hidden sm:grid"
      >
        {cols.map((col) => (
          <div
            key={col}
            style={{ padding: '13px 0', fontFamily: 'CKCL', fontWeight: 500, fontSize: 9, letterSpacing: '0.08em', color: T.ink200, textAlign: col === 'Amount' ? 'right' : 'left' }}
          >
            {col.toUpperCase()}
          </div>
        ))}
      </div>

      {/* Rows */}
      {DUES.map((due, i) => (
        <div
          key={due.id}
          style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 2.4fr 1.2fr 1.2fr 1fr 0.7fr',
            padding: '16px 20px',
            borderBottom: i < DUES.length - 1 ? `1px solid ${T.ink100}` : 'none',
            alignItems: 'center',
            background: due.status === 'Overdue' ? 'rgba(255,251,235,0.40)' : 'transparent',
            transition: 'background 140ms',
          }}
          className="hidden sm:grid"
          onMouseEnter={(e) => { if (due.status !== 'Overdue') (e.currentTarget as HTMLElement).style.background = T.surface50 }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = due.status === 'Overdue' ? 'rgba(255,251,235,0.40)' : 'transparent' }}
        >
          {/* Period */}
          <div style={{ fontFamily: 'CKCL', fontSize: 12, color: T.ink400 }}>{due.period}</div>
          {/* Description */}
          <div style={{ fontFamily: 'CKCL', fontSize: 13, fontWeight: 500, color: T.ink900, paddingRight: 12 }}>{due.description}</div>
          {/* Amount */}
          <div style={{ fontFamily: 'CKCL', fontWeight: 500, fontSize: 14, color: due.status === 'Overdue' ? T.amber : T.ink900, textAlign: 'right', paddingRight: 16 }}>
            ৳ {due.amount.toLocaleString('en-BD')}
          </div>
          {/* Due date */}
          <div style={{ fontFamily: 'CKCL', fontSize: 12, color: due.status === 'Overdue' ? T.amber : T.ink400 }}>
            {due.status === 'Paid' ? due.paidDate : due.dueDate}
          </div>
          {/* Status */}
          <div><StatusChip status={due.status} /></div>
          {/* Action */}
          <div>
            {due.status === 'Paid' ? (
              <button style={{ fontFamily: 'CKCL', fontSize: 11, fontWeight: 600, color: T.green, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Receipt</button>
            ) : due.status === 'Overdue' ? (
              <span style={{ fontFamily: 'CKCL', fontSize: 11, fontWeight: 600, color: T.amber }}>Pay now</span>
            ) : null}
          </div>
        </div>
      ))}

    </div>
  )
}

// ─── Mobile statement: summary + dues grouped by billing period ──────────────
const taka = (n: number) => `৳ ${n.toLocaleString('en-BD')}`

function MobileStatement() {
  const overdue = DUES.filter((d) => d.status === 'Overdue')
  const paidTotal = DUES.filter((d) => d.status === 'Paid').reduce((s, d) => s + d.amount, 0)
  // Current period first
  const periods = [...new Set(DUES.map((d) => d.period))].reverse()

  const stats = [
    { label: 'Outstanding', value: taka(OUTSTANDING), color: T.ink900 },
    { label: 'Overdue', value: `${overdue.length} ${overdue.length === 1 ? 'item' : 'items'}`, color: T.amber },
    { label: 'Paid', value: taka(paidTotal), color: T.green },
  ]

  return (
    <div className="sm:hidden" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', background: '#FFFFFF', border: `1px solid ${T.ink100}`, borderRadius: 16 }}>
        {stats.map((st, i) => (
          <div key={st.label} style={{ padding: '14px 12px', borderLeft: i > 0 ? `1px solid ${T.ink100}` : 'none', minWidth: 0 }}>
            <div className="eyebrow" style={{ fontSize: 9, color: T.ink400, marginBottom: 4 }}>{st.label}</div>
            <div style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 15, color: st.color, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{st.value}</div>
          </div>
        ))}
      </div>

      {periods.map((period) => {
        const items = DUES.filter((d) => d.period === period)
        const total = items.reduce((s, d) => s + d.amount, 0)
        return (
          <section key={period}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, marginBottom: 10, padding: '0 2px' }}>
              <div className="eyebrow" style={{ fontSize: 10, color: T.ink600 }}>{period}</div>
              <div style={{ fontFamily: 'CKCL', fontSize: 12, color: T.ink400 }}>{items.length} items · {taka(total)}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {items.map((due) => {
                const isOverdue = due.status === 'Overdue'
                return (
                  <div
                    key={due.id}
                    style={{
                      background: '#FFFFFF',
                      border: `1px solid ${isOverdue ? 'rgba(217,119,6,0.30)' : T.ink100}`,
                      borderLeft: `3px solid ${isOverdue ? T.amber : due.status === 'Paid' ? T.green : T.blue}`,
                      borderRadius: 14,
                      padding: '14px 16px',
                    }}
                  >
                    {/* Description + amount */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                      <div style={{ fontFamily: 'CKCL', fontSize: 14, fontWeight: 600, color: T.ink900, lineHeight: 1.35, minWidth: 0 }}>{due.description}</div>
                      <div style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 15, color: isOverdue ? T.amber : T.ink900, whiteSpace: 'nowrap' }}>{taka(due.amount)}</div>
                    </div>

                    {/* Date + status */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginTop: 10 }}>
                      <div style={{ fontFamily: 'CKCL', fontSize: 12, color: isOverdue ? T.amber : T.ink400 }}>
                        {due.status === 'Paid' ? `Paid ${due.paidDate}` : `Due ${due.dueDate}`}
                      </div>
                      <StatusChip status={due.status} />
                    </div>

                    {/* Action */}
                    {due.status !== 'Upcoming' && (
                      <div style={{ borderTop: `1px solid ${T.ink100}`, marginTop: 12, paddingTop: 10 }}>
                        {due.status === 'Paid' ? (
                          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'CKCL', fontSize: 12, fontWeight: 600, color: T.green, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            Download receipt
                          </button>
                        ) : (
                          <button
                            onClick={() => document.getElementById('pay-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'CKCL', fontSize: 12, fontWeight: 600, color: T.amber, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                          >
                            Pay now
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}

function DuesSection() {
  return (
    <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
      {/* Left — statement table */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          <div>
            <div className="eyebrow mb-1" style={{ fontSize: 10, color: T.brass }}>STATEMENT</div>
            <h2 style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 22, color: T.ink900, margin: 0, letterSpacing: '-0.01em' }}>Account Statement</h2>
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', fontFamily: 'CKCL', fontSize: 12, fontWeight: 600, color: T.ink600, background: '#FFFFFF', border: `1px solid ${T.ink100}`, borderRadius: 10, cursor: 'pointer' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export PDF
          </button>
        </div>
        <DuesTable />
        <MobileStatement />

        {/* Overdue notice */}
        <div style={{ marginTop: 16, padding: '14px 18px', background: T.amberDim, border: `1px solid rgba(217,119,6,0.25)`, borderRadius: 12, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.amber} strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <div style={{ fontFamily: 'CKCL', fontSize: 13, color: T.ink600, lineHeight: 1.55 }}>
            Your account has <strong style={{ color: T.amber }}>2 overdue items</strong> totalling <strong style={{ fontFamily: 'CKCL' }}>৳ {OUTSTANDING.toLocaleString('en-BD')}</strong>. A 10% late-payment surcharge has been applied. Please settle before 30 October 2026 to avoid suspension of facility access.
          </div>
        </div>
      </div>

      {/* Right — sticky payment card */}
      <PaymentCard />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// DUES ACCESS — find member → verify by OTP → statement
// Front-end only: the OTP is simulated (DEMO_OTP) until there's a backend to send it.
// ═══════════════════════════════════════════════════════════════════════════════
const DEMO_OTP = '123456'
const OTP_LENGTH = 6
const RESEND_SECONDS = 30

const TIER_CHIP: Record<MemberTier, { bg: string; color: string }> = {
  'Founding Member': { bg: T.brassDim, color: T.brass },
  'Life Member':     { bg: T.brandDim, color: T.brand },
  'General Member':  { bg: T.surface100, color: T.ink400 },
}

const memberId = (m: Member) => `CKCL-${String(m.id).padStart(4, '0')}`

// Registered contacts, masked — placeholders derived from the member until real records exist
const maskedPhone = (m: Member) => `+880 1${7 + (m.id % 3)}•• ••• ${String((m.id * 37) % 90 + 10)}`
const maskedEmail = (m: Member) => {
  const domain = m.company.toLowerCase().replace(/[^a-z]/g, '').slice(0, 12) || 'mail'
  return `${m.name.replace(/^(Dr|Md|Mr|Mrs)\.?\s+/i, '')[0].toLowerCase()}•••••@${domain}.com`
}

type Channel = 'phone' | 'email'

function MemberAvatar({ m, size }: { m: Member; size: number }) {
  const initials = m.name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: T.surface100, border: '2px solid rgba(185,139,67,0.55)', boxShadow: '0 0 0 3px rgba(185,139,67,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {m.avatar
        ? <img src={m.avatar} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
        : <span style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: size * 0.34, color: T.brass }}>{initials}</span>}
    </div>
  )
}

function TierChip({ tier }: { tier: MemberTier }) {
  const s = TIER_CHIP[tier]
  return (
    <span style={{ fontFamily: 'CKCL', fontWeight: 500, fontSize: 9, letterSpacing: '0.07em', color: s.color, background: s.bg, border: `1px solid ${s.color}40`, borderRadius: 999, padding: '4px 9px', whiteSpace: 'nowrap' }}>
      {tier.toUpperCase()}
    </span>
  )
}

function GateSteps({ step }: { step: 1 | 2 }) {
  const steps = ['Find member', 'Verify', 'Statement']
  return (
    <div className="flex items-center gap-2" style={{ marginBottom: 24 }}>
      {steps.map((label, i) => {
        const n = i + 1
        const done = n < step
        const on = n === step
        return (
          <div key={label} className="flex items-center gap-2" style={{ minWidth: 0 }}>
            <span style={{ width: 22, height: 22, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'CKCL', fontSize: 11, fontWeight: 700, background: on ? T.brand : done ? T.green : T.surface100, color: on || done ? '#FFFFFF' : T.ink400 }}>
              {done ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> : n}
            </span>
            <span style={{ fontFamily: 'CKCL', fontSize: 12, fontWeight: on ? 600 : 500, color: on ? T.ink900 : T.ink400, whiteSpace: 'nowrap' }}>{label}</span>
            {i < steps.length - 1 && <span style={{ width: 18, height: 1, background: T.ink100, flexShrink: 0 }}/>}
          </div>
        )
      })}
    </div>
  )
}

const gateCard: React.CSSProperties = {
  maxWidth: 600, margin: '0 auto', background: '#FFFFFF', border: '1px solid rgba(185,139,67,0.30)',
  borderRadius: 24, padding: 'clamp(22px,3.5vw,36px)', boxShadow: '0 8px 32px rgba(14,17,22,0.06)',
}

const fieldStyle: React.CSSProperties = {
  width: '100%', height: 46, padding: '0 14px', fontFamily: 'CKCL', fontSize: 14, color: T.ink900,
  background: T.surface50, border: `1.5px solid ${T.ink100}`, borderRadius: 12, outline: 'none',
}

const primaryBtn = (disabled: boolean): React.CSSProperties => ({
  width: '100%', padding: '13px', fontFamily: 'CKCL', fontSize: 14, fontWeight: 700, color: '#FFFFFF',
  background: disabled ? '#F3A3A8' : T.brand, border: 'none', borderRadius: 999, cursor: disabled ? 'default' : 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 160ms',
})

const Spinner = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" style={{ animation: 'spin 0.8s linear infinite' }}><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>

// ─── Step 1 — find member ─────────────────────────────────────────────────────
// Same categories as the Membership Process page, plus Founding
const MEMBER_TYPES = [
  'Founding Member', 'Life Member', 'Permanent Member', 'Donor Member', 'Service Member',
  'Temporary Member', 'Honorary Member', 'Corporate Member', 'Diplomat Member',
]

function FindMember({ onSelect }: { onSelect: (m: Member) => void }) {
  const [type, setType] = useState('')
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const results = q.length < 2 ? [] : MEMBERS.filter((m) =>
    (!type || m.tier === type) &&
    (m.name.toLowerCase().includes(q) || memberId(m).toLowerCase().includes(q) || String(m.id) === q),
  )

  return (
    <div style={gateCard}>
      <GateSteps step={1}/>
      <div className="eyebrow mb-2" style={{ fontSize: 10, color: T.brass }}>CLUB DUES</div>
      <h2 style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 'clamp(20px,2.4vw,26px)', color: T.ink900, margin: '0 0 6px', letterSpacing: '-0.01em' }}>Find your membership.</h2>
      <p style={{ fontFamily: 'CKCL', fontSize: 14, color: T.ink400, lineHeight: 1.6, margin: '0 0 22px' }}>
        Select your member type and search by name or membership ID. We'll verify it's you before showing your statement.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-3">
        <label style={{ display: 'block' }}>
          <span className="eyebrow" style={{ display: 'block', fontSize: 9, color: T.ink400, marginBottom: 6 }}>MEMBER TYPE</span>
          <div style={{ position: 'relative' }}>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="dues-field"
              style={{ ...fieldStyle, appearance: 'none', WebkitAppearance: 'none', paddingRight: 36, cursor: 'pointer' }}
            >
              <option value="">All types</option>
              {MEMBER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.ink400} strokeWidth="2.2" style={{ position: 'absolute', right: 14, top: 16, pointerEvents: 'none' }}><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </label>
        <label style={{ display: 'block' }}>
          <span className="eyebrow" style={{ display: 'block', fontSize: 9, color: T.ink400, marginBottom: 6 }}>MEMBER SEARCH</span>
          <div style={{ position: 'relative' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.ink200} strokeWidth="2" style={{ position: 'absolute', left: 14, top: 15, pointerEvents: 'none' }}><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Name or ID, e.g. CKCL-0007"
              className="dues-field"
              style={{ ...fieldStyle, paddingLeft: 40 }}
              autoComplete="off"
            />
          </div>
        </label>
      </div>

      {/* Results */}
      <div style={{ marginTop: 16 }}>
        {q.length < 2 ? (
          <div style={{ fontFamily: 'CKCL', fontSize: 12.5, color: T.ink200, textAlign: 'center', padding: '14px 0' }}>Type at least 2 characters to search.</div>
        ) : results.length === 0 ? (
          <div style={{ fontFamily: 'CKCL', fontSize: 13, color: T.ink400, textAlign: 'center', padding: '18px 12px', background: T.surface50, borderRadius: 12 }}>
            No members match “{query.trim()}”{type ? ` in ${type}` : ''}. Check the spelling or try your membership ID.
          </div>
        ) : (
          <div style={{ border: `1px solid ${T.ink100}`, borderRadius: 14, overflow: 'hidden', maxHeight: 320, overflowY: 'auto' }}>
            {results.map((m, i) => (
              <button
                key={m.id}
                onClick={() => onSelect(m)}
                className="dues-result"
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: '#FFFFFF', border: 'none', borderTop: i ? `1px solid ${T.ink100}` : 'none', cursor: 'pointer', textAlign: 'left' }}
              >
                <MemberAvatar m={m} size={40}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 14, color: T.ink900, lineHeight: 1.3 }}>{m.name}</div>
                  <div style={{ fontFamily: 'CKCL', fontSize: 12, color: T.ink400, marginTop: 2 }}>{memberId(m)} · {m.tier}</div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.ink200} strokeWidth="2.2"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Step 2 — verify by OTP ───────────────────────────────────────────────────
function OtpInput({ value, onChange, error }: { value: string; onChange: (v: string) => void; error: boolean }) {
  const refs = useRef<(HTMLInputElement | null)[]>([])
  const set = (v: string) => onChange(v.replace(/\D/g, '').slice(0, OTP_LENGTH))

  return (
    <div className="flex justify-between gap-2" onPaste={(e) => { e.preventDefault(); const v = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH); set(v); refs.current[Math.min(v.length, OTP_LENGTH - 1)]?.focus() }}>
      {Array.from({ length: OTP_LENGTH }, (_, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el }}
          value={value[i] ?? ''}
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          aria-label={`Digit ${i + 1}`}
          autoFocus={i === 0}
          onChange={(e) => {
            const d = e.target.value.replace(/\D/g, '').slice(-1)
            if (!d) return
            set(value.slice(0, i) + d + value.slice(i + 1))
            refs.current[i + 1]?.focus()
          }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace') {
              e.preventDefault()
              if (value[i]) set(value.slice(0, i) + value.slice(i + 1))
              else if (i > 0) { set(value.slice(0, i - 1) + value.slice(i)); refs.current[i - 1]?.focus() }
            } else if (e.key === 'ArrowLeft') refs.current[i - 1]?.focus()
            else if (e.key === 'ArrowRight') refs.current[i + 1]?.focus()
          }}
          className="dues-field"
          style={{ width: '100%', maxWidth: 54, height: 56, textAlign: 'center', fontFamily: 'CKCL', fontSize: 22, fontWeight: 600, color: T.ink900, background: T.surface50, border: `1.5px solid ${error ? T.brand : value[i] ? T.ink400 : T.ink100}`, borderRadius: 12, outline: 'none' }}
        />
      ))}
    </div>
  )
}

function VerifyMember({ member, onBack, onVerified }: { member: Member; onBack: () => void; onVerified: (via: Channel) => void }) {
  const [channel, setChannel] = useState<Channel>('phone')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [resendIn, setResendIn] = useState(0)

  useEffect(() => {
    if (resendIn <= 0) return
    const id = window.setTimeout(() => setResendIn((s) => s - 1), 1000)
    return () => window.clearTimeout(id)
  }, [resendIn])

  const destination = channel === 'phone' ? maskedPhone(member) : maskedEmail(member)

  const sendCode = () => {
    setBusy(true)
    setError('')
    window.setTimeout(() => { setBusy(false); setSent(true); setCode(''); setResendIn(RESEND_SECONDS) }, 1100)
  }

  const verify = () => {
    setBusy(true)
    window.setTimeout(() => {
      setBusy(false)
      if (code === DEMO_OTP) onVerified(channel)
      else { setError('That code is incorrect. Check it and try again.'); setCode('') }
    }, 900)
  }

  const channels: { id: Channel; label: string; icon: React.ReactNode }[] = [
    { id: 'phone', label: 'Text message', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="6" y="2" width="12" height="20" rx="2"/><line x1="11" y1="18" x2="13" y2="18"/></svg> },
    { id: 'email', label: 'Email', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22 6 12 13 2 6"/></svg> },
  ]

  return (
    <div style={gateCard}>
      <GateSteps step={2}/>

      <button onClick={sent ? () => { setSent(false); setError('') } : onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'CKCL', fontSize: 12.5, fontWeight: 600, color: T.ink400, background: 'none', border: 'none', padding: 0, cursor: 'pointer', marginBottom: 16 }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="11 6 5 12 11 18"/></svg>
        {sent ? 'Use a different method' : 'Change member'}
      </button>

      {/* Selected member */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: T.surface50, border: `1px solid ${T.ink100}`, borderRadius: 14, marginBottom: 22 }}>
        <MemberAvatar m={member} size={44}/>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 14.5, color: T.ink900 }}>{member.name}</div>
          <div style={{ fontFamily: 'CKCL', fontSize: 12, color: T.ink400, marginTop: 2 }}>{memberId(member)} · {member.tier}</div>
        </div>
      </div>

      {!sent ? (
        <>
          <h2 style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 20, color: T.ink900, margin: '0 0 6px' }}>Verify it's you.</h2>
          <p style={{ fontFamily: 'CKCL', fontSize: 14, color: T.ink400, lineHeight: 1.6, margin: '0 0 16px' }}>We'll send a one-time code to the contact on your membership record.</p>

          <div role="radiogroup" aria-label="Send code by" className="grid grid-cols-1 sm:grid-cols-2 gap-2.5" style={{ marginBottom: 20 }}>
            {channels.map((c) => {
              const on = channel === c.id
              return (
                <button
                  key={c.id}
                  role="radio"
                  aria-checked={on}
                  onClick={() => setChannel(c.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px', textAlign: 'left', background: on ? T.brandDim : '#FFFFFF', border: `1.5px solid ${on ? T.brand : T.ink100}`, borderRadius: 14, cursor: 'pointer', color: on ? T.brand : T.ink400, boxShadow: on ? '0 0 0 3px rgba(225,11,23,0.10)' : 'none', transition: 'all 160ms', minWidth: 0 }}
                >
                  {c.icon}
                  <span style={{ minWidth: 0 }}>
                    <span style={{ display: 'block', fontFamily: 'CKCL', fontSize: 13, fontWeight: 600, color: T.ink900 }}>{c.label}</span>
                    <span style={{ display: 'block', fontFamily: 'CKCL', fontSize: 12, color: T.ink400, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.id === 'phone' ? maskedPhone(member) : maskedEmail(member)}</span>
                  </span>
                </button>
              )
            })}
          </div>

          <button onClick={sendCode} disabled={busy} style={primaryBtn(busy)}>
            {busy ? <><Spinner/> Sending…</> : 'Send OTP'}
          </button>
        </>
      ) : (
        <>
          <h2 style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 20, color: T.ink900, margin: '0 0 6px' }}>Enter your code.</h2>
          <p style={{ fontFamily: 'CKCL', fontSize: 14, color: T.ink400, lineHeight: 1.6, margin: '0 0 18px' }}>
            We sent a {OTP_LENGTH}-digit code to <strong style={{ color: T.ink900, fontWeight: 600 }}>{destination}</strong>.
          </p>

          <OtpInput value={code} onChange={(v) => { setCode(v); setError('') }} error={!!error}/>
          {error && <div role="alert" style={{ fontFamily: 'CKCL', fontSize: 12.5, color: T.brand, marginTop: 10 }}>{error}</div>}

          <button onClick={verify} disabled={busy || code.length < OTP_LENGTH} style={{ ...primaryBtn(busy || code.length < OTP_LENGTH), marginTop: 20 }}>
            {busy ? <><Spinner/> Verifying…</> : 'Verify & continue'}
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
            <span style={{ fontFamily: 'CKCL', fontSize: 11.5, color: T.ink200 }}>Demo code: {DEMO_OTP}</span>
            <button onClick={sendCode} disabled={resendIn > 0 || busy} style={{ fontFamily: 'CKCL', fontSize: 12.5, fontWeight: 600, color: resendIn > 0 ? T.ink200 : T.brand, background: 'none', border: 'none', padding: 0, cursor: resendIn > 0 ? 'default' : 'pointer' }}>
              {resendIn > 0 ? `Resend code in ${resendIn}s` : 'Resend code'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Verified member summary — top of the statement ───────────────────────────
function MemberSummary({ member, via, onSignOut }: { member: Member; via: Channel; onSignOut: () => void }) {
  return (
    <div style={{ background: '#FFFFFF', border: '1px solid rgba(185,139,67,0.30)', borderRadius: 20, padding: 'clamp(18px,2.5vw,24px)', marginBottom: 28, boxShadow: '0 4px 20px rgba(14,17,22,0.05)' }}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-4" style={{ flex: 1, minWidth: 0 }}>
          <MemberAvatar m={member} size={72}/>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 'clamp(17px,2vw,21px)', color: T.ink900, lineHeight: 1.2, letterSpacing: '-0.01em' }}>{member.name}</div>
            <div style={{ fontFamily: 'CKCL', fontSize: 13, color: T.ink400, marginTop: 3, lineHeight: 1.45 }}>
              {member.designation}, {member.company}
            </div>
            <div className="flex flex-wrap items-center gap-2" style={{ marginTop: 8 }}>
              <TierChip tier={member.tier}/>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'CKCL', fontWeight: 500, fontSize: 9, letterSpacing: '0.07em', color: T.green, background: T.greenDim, border: `1px solid ${T.green}30`, borderRadius: 999, padding: '4px 9px' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.green }}/>ACTIVE
              </span>
            </div>
          </div>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t border-[#E2E6EC] pt-3 sm:border-t-0 sm:pt-0">
          <div className="sm:text-right">
            <div className="eyebrow" style={{ fontSize: 9, color: T.ink200 }}>MEMBERSHIP ID</div>
            <div style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 15, color: T.ink900, letterSpacing: '0.04em', marginTop: 2 }}>{memberId(member)}</div>
          </div>
          <button onClick={onSignOut} style={{ fontFamily: 'CKCL', fontSize: 12, fontWeight: 600, color: T.ink400, background: T.surface50, border: `1px solid ${T.ink100}`, borderRadius: 999, padding: '7px 14px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            Not you? Sign out
          </button>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'CKCL', fontSize: 11.5, color: T.ink200, marginTop: 14 }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.green} strokeWidth="2.4"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
        Verified by {via === 'phone' ? 'text message' : 'email'} for this session
      </div>
    </div>
  )
}

type DuesAccess = { member: Member; via: Channel } | null

function DuesGate({ access, onAccess }: { access: DuesAccess; onAccess: (a: DuesAccess) => void }) {
  const [selected, setSelected] = useState<Member | null>(null)

  if (access) {
    return (
      <>
        <MemberSummary member={access.member} via={access.via} onSignOut={() => { onAccess(null); setSelected(null) }}/>
        <DuesSection/>
      </>
    )
  }
  return (
    <>
      <style>{`
        .dues-field:focus { border-color: ${T.ink400} !important; background: #FFFFFF !important; box-shadow: 0 0 0 3px rgba(14,17,22,0.06); }
        .dues-result:hover { background: ${T.surface50} !important; }
        .dues-field::-webkit-search-cancel-button { cursor: pointer; }
      `}</style>
      {selected
        ? <VerifyMember member={selected} onBack={() => setSelected(null)} onVerified={(via) => onAccess({ member: selected, via })}/>
        : <FindMember onSelect={setSelected}/>}
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE SHELL
// ═══════════════════════════════════════════════════════════════════════════════
function PageHeader({ tab, onTab }: { tab: ResourceTab; onTab: (t: ResourceTab) => void }) {
  return (
    <div style={{ minHeight: 'clamp(200px, 28vw, 320px)', background: T.surface100, position: 'relative', overflow: 'hidden', paddingBottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div style={{ position: 'absolute', top: '-10%', right: '5%', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle,rgba(225,11,23,0.09) 0%,transparent 65%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%', boxSizing: 'border-box', padding: '108px clamp(24px,5vw,80px) 0', position: 'relative', zIndex: 1 }}>
        <div className="flex items-center gap-1.5 mb-3">
          {['Home', 'Resources'].map((c, i, arr) => (
            <span key={i} className="flex items-center gap-1.5">
              <span className="eyebrow" style={{ fontSize: 11, color: i < arr.length - 1 ? T.ink400 : T.ink900 }}>{c}</span>
              {i < arr.length - 1 && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={T.ink200} strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>}
            </span>
          ))}
        </div>
        <div className="eyebrow mb-2" style={{ fontSize: 11, color: T.brass }}>RESOURCES</div>
        <h1 style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 'clamp(32px,4vw,52px)', lineHeight: 1.05, letterSpacing: '-0.02em', color: T.ink900, margin: '0 0 32px' }}>Member Resources.</h1>

        <SubTabs tabs={TABS} active={tab} onChange={onTab} />
      </div>
    </div>
  )
}

const overlayBtn: React.CSSProperties = {
  width: 34, height: 34, borderRadius: '50%',
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.12)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', transition: 'background 140ms',
}

export default function ResourcesPage() {
  const [tab, setTab] = useState<ResourceTab>('reports')
  // Held here so switching tabs doesn't drop a verified session
  const [duesAccess, setDuesAccess] = useState<DuesAccess>(null)

  return (
    <div style={{ background: T.surface50, minHeight: '100vh' }}>
      <PageHeader tab={tab} onTab={setTab} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(40px,5vw,64px) clamp(24px,5vw,80px)' }}>
        {tab === 'reports' && <ReportsSection />}
        {tab === 'dues'    && <DuesGate access={duesAccess} onAccess={setDuesAccess} />}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <Footer />
    </div>
  )
}
