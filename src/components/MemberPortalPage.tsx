import React, { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import logoImg from '@/imports/logo-1.png'
import { useSiteInfo } from '../lib/siteInfo'

function useCopy() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const copy = useCallback((val: string, key: string) => {
    navigator.clipboard.writeText(val).catch(() => {})
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }, [])
  return { copiedKey, copy }
}

function CopyBtn({ value, id, size = 28 }: { value: string; id: string; size?: number }) {
  const { copiedKey, copy } = useCopy()
  const copied = copiedKey === id
  return (
    <button
      onClick={() => copy(value, id)}
      title={copied ? 'Copied!' : 'Copy'}
      style={{ width: size, height: size, borderRadius: 6, border: `1px solid ${copied ? '#16A34A' : '#E2E6EC'}`, background: copied ? '#DCFCE7' : 'transparent', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: copied ? '#16A34A' : '#A8B0BB', transition: 'all 160ms', flexShrink: 0 }}
      onMouseEnter={(e) => { if (!copied) { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#2A3039'; el.style.color = '#2A3039' } }}
      onMouseLeave={(e) => { if (!copied) { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#E2E6EC'; el.style.color = '#A8B0BB' } }}
    >
      {copied
        ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
        : <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
      }
    </button>
  )
}

const T = {
  ink900: '#0E1116', ink700: '#1C2330', ink600: '#2A3039', ink400: '#5C6673', ink200: '#A8B0BB', ink100: '#E2E6EC',
  surface0: '#FFFFFF', surface50: '#F7F8FA', surface100: '#EEF1F5',
  brand: '#E10B17', brand700: '#B70813', brandDim: '#FFF1F2',
  brass: '#B98B43', brassLight: '#F9F3E8',
  green: '#16A34A', greenDim: '#DCFCE7',
  amber: '#D97706', amberDim: '#FEF3C7',
}

// ─── Types ────────────────────────────────────────────────────────────────────
type PortalPage = 'dashboard' | 'membership-card' | 'personal-info' | 'account-statement' | 'payment-history' | 'invoices' | 'bank-accounts' | 'change-request' | 'helpdesk' | 'change-password' | 'services'

type Member = {
  name: string; memberNo: string; tier: 'Founding Member' | 'Life Member' | 'General Member'
  status: 'Active' | 'Suspended' | 'Expired'; photo: string; email: string; phone: string
  joinDate: string; outstanding: number
}

const MOCK_MEMBER: Member = {
  name: 'Md. Rafiqul Islam', memberNo: 'FM0001', tier: 'Founding Member',
  status: 'Active', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&auto=format',
  email: 'rafiqul@islamgroup.com', phone: '+880 1711 000 001',
  joinDate: 'March 2013', outstanding: 12500,
}

const DUES = [
  { month: 'July 2026', type: 'Monthly subscription', amount: 2500, status: 'Overdue' as const, due: '01 Jul 2026' },
  { month: 'June 2026', type: 'Monthly subscription', amount: 2500, status: 'Overdue' as const, due: '01 Jun 2026' },
  { month: 'August 2026', type: 'Monthly subscription', amount: 2500, status: 'Upcoming' as const, due: '01 Aug 2026' },
  { month: 'May 2026', type: 'Monthly subscription', amount: 2500, status: 'Paid' as const, due: '01 May 2026' },
  { month: 'April 2026', type: 'Monthly subscription', amount: 2500, status: 'Paid' as const, due: '01 Apr 2026' },
]

const UPDATES = [
  { date: '03 Jul', title: '2nd Convener Committee Meeting — Agenda Notice', tag: 'Notice' },
  { date: '09 Jun', title: 'Annual Picnic 2026 — Registration now open', tag: 'Event' },
  { date: '19 May', title: 'Club Night 2026 — A Night to Remember', tag: 'News' },
]

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icons = {
  dashboard: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  user: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  wallet: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>,
  bank: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-6 9 6v13H3z"/><path d="M9 22V12h6v10"/></svg>,
  edit: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  headset: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3z"/><path d="M3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg>,
  lock: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  logout: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  chevron: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>,
  bell: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  alert: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
}

// ─── Status chip ──────────────────────────────────────────────────────────────
function StatusChip({ status }: { status: Member['status'] }) {
  const config = {
    Active: { bg: T.greenDim, color: T.green, dot: T.green },
    Suspended: { bg: T.amberDim, color: T.amber, dot: T.amber },
    Expired: { bg: T.brandDim, color: T.brand700, dot: T.brand },
  }[status]
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: config.bg, color: config.color, borderRadius: 999, padding: '3px 9px', fontFamily: 'CKCL', fontSize: 11, fontWeight: 700 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: config.dot, flexShrink: 0 }}/>
      {status}
    </span>
  )
}

function TierChip({ tier }: { tier: Member['tier'] }) {
  const config = {
    'Founding Member': { bg: 'transparent', color: T.brass, border: `1px solid ${T.brass}` },
    'Life Member': { bg: T.brandDim, color: T.brand700, border: 'none' },
    'General Member': { bg: T.surface100, color: T.ink400, border: 'none' },
  }[tier]
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', background: config.bg, color: config.color, border: config.border, borderRadius: 999, padding: '3px 9px', fontFamily: 'CKCL', fontSize: 11, fontWeight: 700 }}>
      {tier}
    </span>
  )
}

// ─── Avatar dropdown ──────────────────────────────────────────────────────────
function AvatarDropdown({ member, onNavigate, onLogout }: { member: Member; onNavigate: (p: PortalPage) => void; onLogout: () => void }) {
  const [open, setOpen] = useState(false)

  const items: { label: string; icon: React.ReactNode; action: () => void; danger?: boolean }[] = [
    { label: 'Dashboard', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>, action: () => { onNavigate('dashboard'); setOpen(false) } },
    { label: 'Personal information', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, action: () => { onNavigate('personal-info'); setOpen(false) } },
    { label: 'Change password', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>, action: () => { onNavigate('change-password'); setOpen(false) } },
    { label: 'Sign out', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>, action: () => { setOpen(false); onLogout() }, danger: true },
  ]

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px 6px 6px', borderRadius: 999, background: open ? T.surface100 : T.surface0, border: `1px solid ${open ? T.ink200 : T.ink100}`, cursor: 'pointer', flexShrink: 0, transition: 'background 140ms, border-color 140ms' }}
        onMouseEnter={(e) => { if (!open) { const el = e.currentTarget as HTMLElement; el.style.background = T.surface50; el.style.borderColor = T.ink200 } }}
        onMouseLeave={(e) => { if (!open) { const el = e.currentTarget as HTMLElement; el.style.background = T.surface0; el.style.borderColor = T.ink100 } }}
      >
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', border: `2px solid ${T.brass}`, overflow: 'hidden' }}>
            <img src={member.photo} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}/>
          </div>
          {/* Membership status dot — phones/tablets */}
          <span
            id="portal-status-dot"
            title={`Membership ${member.status === 'Active' ? 'active' : 'inactive'}`}
            aria-label={`Membership ${member.status === 'Active' ? 'active' : 'inactive'}`}
            style={{ display: 'none', position: 'absolute', right: -1, bottom: -1, width: 11, height: 11, borderRadius: '50%', background: member.status === 'Active' ? T.green : T.brand, border: '2px solid #FFFFFF' }}
          />
        </div>
        <div style={{ lineHeight: 1, display: 'none', textAlign: 'left' }} id="portal-avatar-name">
          <div style={{ fontFamily: 'CKCL', fontSize: 13, fontWeight: 600, color: T.ink900 }}>{member.name.split(' ')[0]}</div>
          <div style={{ fontFamily: 'CKCL', fontSize: 10, color: T.ink400 }}>{member.memberNo}</div>
        </div>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.ink200} strokeWidth="2.5" style={{ transition: 'transform 160ms', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}><polyline points="6 9 12 15 18 9"/></svg>
      </button>

      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 98 }} onClick={() => setOpen(false)}/>
          <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 99, width: 240, background: T.surface0, borderRadius: 14, border: `1px solid ${T.ink100}`, boxShadow: '0 8px 32px rgba(14,17,22,0.12), 0 2px 8px rgba(14,17,22,0.06)', overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', borderBottom: `1px solid ${T.ink100}`, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', border: `2px solid ${T.brass}`, overflow: 'hidden', flexShrink: 0 }}>
                <img src={member.photo} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}/>
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: 'CKCL', fontSize: 13, fontWeight: 700, color: T.ink900, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{member.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                  <span style={{ fontFamily: 'CKCL', fontSize: 11, color: T.ink400 }}>{member.memberNo}</span>
                  <CopyBtn value={member.memberNo} id="dropdown-memberNo" size={18}/>
                </div>
                <div style={{ marginTop: 4 }}><TierChip tier={member.tier}/></div>
              </div>
            </div>
            <div style={{ padding: '6px 0' }}>
              {items.map((item, i) => (
                <React.Fragment key={item.label}>
                  {i === items.length - 1 && <div style={{ height: 1, background: T.ink100, margin: '6px 0' }}/>}
                  <button
                    onClick={item.action}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'CKCL', fontSize: 13, fontWeight: 500, color: item.danger ? T.brand : T.ink700, textAlign: 'left' as const, transition: 'background 120ms' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = item.danger ? T.brandDim : T.surface50 }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                  >
                    <span style={{ color: item.danger ? T.brand : T.ink400, display: 'flex', flexShrink: 0 }}>{item.icon}</span>
                    {item.label}
                  </button>
                </React.Fragment>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Sidebar member identity ──────────────────────────────────────────────────
// `centered`: photo, name, member ID and badges centred (desktop sidebar)
function SidebarMemberCard({ member, onNavigate, centered = false }: { member: Member; onNavigate: (p: PortalPage) => void; centered?: boolean }) {
  return (
    <div style={{ padding: '4px 8px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ position: 'relative', width: 76, height: 76, alignSelf: centered ? 'center' : undefined }}>
        <div style={{ width: 76, height: 76, borderRadius: '50%', border: `2px solid ${T.brass}`, overflow: 'hidden', background: T.surface100 }}>
          <img src={member.photo} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}/>
        </div>
        <button
          onClick={() => onNavigate('personal-info')}
          title="Edit personal information"
          aria-label="Edit personal information"
          style={{ position: 'absolute', right: -2, bottom: -2, width: 26, height: 26, borderRadius: '50%', background: T.surface0, border: `1px solid ${T.ink100}`, boxShadow: '0 1px 4px rgba(14,17,22,0.10)', color: T.brand, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
      </div>

      <div>
        <div style={{ fontWeight: 600, fontSize: 18, color: T.ink900, lineHeight: 1.25, textAlign: centered ? 'center' : undefined }}>{member.name}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: centered ? 'center' : undefined, gap: 5, marginTop: 4 }}>
          <span style={{ fontSize: 12, color: T.ink400, letterSpacing: '0.04em' }}>{member.memberNo}</span>
          <CopyBtn value={member.memberNo} id="sidebar-memberNo" size={22}/>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: centered ? 'center' : undefined }}>
        <TierChip tier={member.tier}/>
        <StatusChip status={member.status}/>
      </div>
    </div>
  )
}

// ─── Sidebar nav ──────────────────────────────────────────────────────────────
type NavItem = { id: PortalPage | 'payments'; label: string; icon: React.ReactNode; children?: { id: PortalPage; label: string }[] }

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Icons.dashboard },
  { id: 'personal-info', label: 'Personal information', icon: Icons.user },
  {
    id: 'payments', label: 'Payments', icon: Icons.wallet,
    children: [
      { id: 'account-statement', label: 'Account statement' },
      { id: 'payment-history', label: 'Payment history' },
      { id: 'invoices', label: 'Invoices' },
    ],
  },
  { id: 'bank-accounts', label: 'Bank accounts', icon: Icons.bank },
  { id: 'change-request', label: 'Change request', icon: Icons.edit },
  { id: 'helpdesk', label: 'Online helpdesk', icon: Icons.headset },
  { id: 'change-password', label: 'Change password', icon: Icons.lock },
]

// Active item is a raised white card with brand-red label; inactive items are flat
function navItemStyle(active: boolean, height = 46): React.CSSProperties {
  return {
    width: '100%', display: 'flex', alignItems: 'center', gap: 12,
    padding: '0 14px', height, borderRadius: 10, cursor: 'pointer',
    border: `1px solid ${active ? T.ink100 : 'transparent'}`,
    background: active ? T.surface0 : 'transparent',
    boxShadow: active ? '0 2px 8px rgba(14,17,22,0.06)' : 'none',
    color: active ? T.brand : T.ink600,
    fontFamily: 'CKCL', fontSize: 14, fontWeight: active ? 600 : 400,
    transition: 'background 160ms, color 160ms', textAlign: 'left',
  }
}

const hoverOn = (active: boolean) => (e: React.MouseEvent) => { if (!active) (e.currentTarget as HTMLElement).style.background = T.surface50 }
const hoverOff = (active: boolean) => (e: React.MouseEvent) => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }

function SidebarNav({
  activePage, onNavigate, onLogout,
}: {
  activePage: PortalPage; onNavigate: (p: PortalPage) => void; onLogout: () => void
}) {
  const isPaymentActive = ['account-statement', 'payment-history', 'invoices'].includes(activePage)
  const [paymentsOpen, setPaymentsOpen] = useState(isPaymentActive)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {NAV_ITEMS.map((item) => {
            if (item.children) {
              return (
                <div key={item.id}>
                  <button
                    onClick={() => setPaymentsOpen((v) => !v)}
                    style={{ ...navItemStyle(false), color: isPaymentActive ? T.brand : T.ink600, fontWeight: isPaymentActive ? 600 : 400 }}
                    onMouseEnter={hoverOn(false)}
                    onMouseLeave={hoverOff(false)}
                  >
                    <span style={{ display: 'flex', color: isPaymentActive ? T.brand : T.ink400 }}>{item.icon}</span>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    <span style={{ display: 'flex', transform: paymentsOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms', color: T.ink200 }}>{Icons.chevron}</span>
                  </button>
                  {paymentsOpen && (
                    <div style={{ margin: '4px 0 4px 24px', paddingLeft: 10, borderLeft: `1px solid ${T.ink100}`, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {item.children.map((child) => {
                        const active = child.id === activePage
                        return (
                          <button
                            key={child.id}
                            onClick={() => onNavigate(child.id)}
                            style={{ ...navItemStyle(active, 40), fontSize: 13 }}
                            onMouseEnter={hoverOn(active)}
                            onMouseLeave={hoverOff(active)}
                          >
                            {child.label}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            }

            const active = item.id === activePage
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as PortalPage)}
                style={navItemStyle(active)}
                onMouseEnter={hoverOn(active)}
                onMouseLeave={hoverOff(active)}
              >
                <span style={{ display: 'flex', color: active ? T.brand : T.ink400 }}>{item.icon}</span>
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* Log out — pinned to the bottom of the sidebar */}
        <div style={{ marginTop: 'auto', paddingTop: 24 }}>
          <button
            onClick={() => setShowLogoutModal(true)}
            style={{ ...navItemStyle(false, 44), color: T.ink600 }}
            onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = T.brandDim; el.style.color = T.brand700 }}
            onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = T.ink600 }}
          >
            <span style={{ display: 'flex' }}>{Icons.logout}</span>
            Log out
          </button>
        </div>
      </div>

      {/* Logout modal — portaled to body so it escapes the sticky sidebar's stacking context */}
      {showLogoutModal && createPortal(
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(14,17,22,0.55)', backdropFilter: 'blur(8px)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            style={{ background: T.surface0, borderRadius: 20, padding: '36px 32px', maxWidth: 380, width: '100%', boxShadow: '0 24px 64px rgba(14,17,22,0.18)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: T.brandDim, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, color: T.brand }}>
              {Icons.logout}
            </div>
            <h3 style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 20, color: T.ink900, margin: '0 0 8px', letterSpacing: '-0.01em' }}>Log out of your account?</h3>
            <p style={{ fontFamily: 'CKCL', fontSize: 14, color: T.ink400, margin: '0 0 28px', lineHeight: 1.6 }}>You will be returned to the public website and will need to sign in again to access your account.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowLogoutModal(false)}
                style={{ flex: 1, height: 44, borderRadius: 10, border: `1.5px solid ${T.ink100}`, background: T.surface0, fontFamily: 'CKCL', fontSize: 14, fontWeight: 600, color: T.ink700, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={onLogout}
                style={{ flex: 1, height: 44, borderRadius: 10, border: 'none', background: T.brand, fontFamily: 'CKCL', fontSize: 14, fontWeight: 700, color: '#FFFFFF', cursor: 'pointer' }}
              >
                Log out
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

// ─── Page header (non-dashboard pages) ────────────────────────────────────────
function PageHeader({ breadcrumb, title, action }: {
  breadcrumb: string[]; title: string; action?: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
          {breadcrumb.map((crumb, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {i > 0 && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={T.ink200} strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>}
              <span style={{ fontFamily: 'CKCL', fontSize: 11, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase' as const, color: i === breadcrumb.length - 1 ? T.brand : T.ink400 }}>
                {crumb}
              </span>
            </span>
          ))}
        </div>
        <h1 style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 'clamp(22px,2.2vw,28px)', color: T.ink900, margin: 0, letterSpacing: '-0.01em' }}>{title}</h1>
      </div>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>
  )
}

// ─── Notice strip ─────────────────────────────────────────────────────────────
function NoticeStrip({ onNavigate }: { onNavigate: (p: PortalPage) => void }) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null
  return (
    <div id="dash-notice-strip" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', background: T.brandDim, borderRadius: 8, borderLeft: `3px solid ${T.brand}` }}>
      <span style={{ color: T.brand, flexShrink: 0, display: 'flex' }}>{Icons.alert}</span>
      <div style={{ flex: 1, fontFamily: 'CKCL', fontSize: 14, color: T.brand700, lineHeight: 1.5 }}>
        Two new notices were posted this month. Open the notice board to read them.
      </div>
      <button
        onClick={() => onNavigate('account-statement')}
        style={{ fontFamily: 'CKCL', fontSize: 13, fontWeight: 700, color: T.brand, background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', padding: 0, flexShrink: 0 }}
      >
        View notices
      </button>
      <button
        onClick={() => setDismissed(true)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.brand, display: 'flex', alignItems: 'center', flexShrink: 0, padding: 2, opacity: 0.6 }}
        aria-label="Dismiss"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  )
}

// ─── Dashboard building blocks ────────────────────────────────────────────────
const CARD: React.CSSProperties = {
  background: T.surface0,
  borderRadius: 14,
  border: `1px solid ${T.surface100}`,
  boxShadow: '0 1px 3px rgba(14,17,22,0.04)',
}

function SectionCard({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section style={{ ...CARD, padding: '18px 20px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingBottom: 12, marginBottom: 16, borderBottom: `1px solid ${T.ink100}` }}>
        <h2 style={{ margin: 0, fontFamily: 'CKCL', fontWeight: 600, fontSize: 16, color: T.ink700 }}>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}

function IconTile({ bg, color, children }: { bg: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{ width: 38, height: 38, borderRadius: 10, background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {children}
    </div>
  )
}

// ─── Dues card ────────────────────────────────────────────────────────────────
// Phones: compact (amount, overdue state, pay). Tablet/desktop: the fuller card
// beside the membership card, stretched to the card's height.
function DuesCard({ outstanding, onNavigate }: { outstanding: number; onNavigate: (p: PortalPage) => void }) {
  return (
    <>
      <DuesCardFull outstanding={outstanding} onNavigate={onNavigate}/>
      <DuesCardCompact outstanding={outstanding} onNavigate={onNavigate}/>
    </>
  )
}

const DAYS_OVERDUE = 31

function DuesCardFull({ outstanding, onNavigate }: { outstanding: number; onNavigate: (p: PortalPage) => void }) {
  const isPaid = outstanding === 0

  return (
    // height:0 + min-height:100% — the card doesn't add to the row height, so the
    // membership card's aspect ratio sets it and this stretches to match exactly
    <div id="dash-dues-full" style={{ ...CARD, padding: '18px 20px', flexDirection: 'column', justifyContent: 'space-between', gap: 10, minWidth: 0, height: 0, minHeight: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
      <div>
        <div className="eyebrow" style={{ fontSize: 10, color: T.ink400, marginBottom: 10 }}>Outstanding dues</div>
        <div style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 32, color: T.ink900, letterSpacing: '-0.02em', lineHeight: 1 }}>
          ৳ {outstanding.toLocaleString()}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, fontFamily: 'CKCL', fontSize: 12.5, fontWeight: 600, color: isPaid ? T.green : T.brand }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', flexShrink: 0 }}/>
          {isPaid ? 'Paid in full' : `Overdue · ${DAYS_OVERDUE} days`}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        {!isPaid && (
          <button
            onClick={() => onNavigate('account-statement')}
            style={{ height: 38, padding: '0 18px', borderRadius: 10, border: 'none', background: T.brand, fontFamily: 'CKCL', fontSize: 13, fontWeight: 700, color: '#FFF', cursor: 'pointer', transition: 'background 160ms' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = T.brand700 }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = T.brand }}
          >
            Pay now
          </button>
        )}
        <button onClick={() => onNavigate('account-statement')} style={{ fontFamily: 'CKCL', fontSize: 12.5, fontWeight: 600, color: T.brand, background: 'none', border: 'none', cursor: 'pointer', padding: 0, whiteSpace: 'nowrap' }}>
          View statement →
        </button>
      </div>
    </div>
  )
}

function DuesCardCompact({ outstanding, onNavigate }: { outstanding: number; onNavigate: (p: PortalPage) => void }) {
  const isPaid = outstanding === 0
  const daysOverdue = DAYS_OVERDUE

  return (
    <div id="dash-dues-compact" style={{ ...CARD, padding: '16px 18px', alignItems: 'center', gap: 14, minWidth: 0 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="eyebrow" style={{ fontSize: 10, color: T.ink400, marginBottom: 4 }}>Outstanding dues</div>
        <div style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 24, color: T.ink900, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          ৳ {isPaid ? '0' : outstanding.toLocaleString()}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, fontFamily: 'CKCL', fontSize: 12, fontWeight: 600, color: isPaid ? T.green : T.brand }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', flexShrink: 0 }}/>
          {isPaid ? 'Paid in full' : `Overdue · ${daysOverdue} days`}
        </div>
      </div>
      {!isPaid && (
        <button
          onClick={() => onNavigate('account-statement')}
          style={{ flexShrink: 0, height: 40, padding: '0 18px', borderRadius: 10, border: 'none', background: T.brand, fontFamily: 'CKCL', fontSize: 13, fontWeight: 700, color: '#FFF', cursor: 'pointer', transition: 'background 160ms' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = T.brand700 }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = T.brand }}
        >
          Pay now
        </button>
      )}
    </div>
  )
}

// ─── Membership card — styled like the Membership Process tier cards ──────────
const TIER_CARD_COLORS: Record<Member['tier'], [string, string]> = {
  'Founding Member': ['#6B4C1E', '#B98B43'],
  'Life Member': ['#7A0710', '#E10B17'],
  'General Member': ['#0E1116', '#3A424D'],
}

// Small caps label over a value, on the dark tier gradient
function CardField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div className="eyebrow" style={{ fontSize: 'clamp(7px,2.2cqw,8.5px)', lineHeight: 1.2, color: 'rgba(255,255,255,0.62)' }}>{label}</div>
      <div style={{ fontSize: 'clamp(11px,3.6cqw,14px)', fontWeight: 600, lineHeight: 1.25, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{children}</div>
    </div>
  )
}

function MembershipCard({ member, onOpen }: { member: Member; onOpen?: () => void }) {
  const [from, to] = TIER_CARD_COLORS[member.tier]
  const active = member.status === 'Active'
  const Tag = onOpen ? 'button' : 'div'

  return (
    <Tag
      onClick={onOpen}
      aria-label={onOpen ? `Membership card ${member.memberNo}${active ? '' : ' (inactive)'} — view details and transactions` : undefined}
      className={onOpen ? 'pcard pcard-clickable' : 'pcard'}
      style={{
        position: 'relative', display: 'block', width: '100%', aspectRatio: '1.586', padding: '18px 20px', borderRadius: 18, overflow: 'hidden', border: 'none', textAlign: 'left',
        background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`, color: '#FFFFFF', boxShadow: '0 18px 40px -18px rgba(14,17,22,0.55)',
        cursor: onOpen ? 'pointer' : 'default', fontFamily: 'CKCL', containerType: 'inline-size',
      }}
    >
      {/* Sheen and card arcs */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 90% at 100% 0%, rgba(255,255,255,0.22) 0%, transparent 55%)', pointerEvents: 'none' }}/>
      <div style={{ position: 'absolute', right: '-18%', bottom: '-55%', width: '75%', aspectRatio: '1', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.12)', pointerEvents: 'none' }}/>
      <div style={{ position: 'absolute', right: '-8%', bottom: '-40%', width: '55%', aspectRatio: '1', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.10)', pointerEvents: 'none' }}/>

      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', gap: '4cqw' }}>
        {/* Header band: club mark + membership status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, paddingBottom: '2.6cqw', borderBottom: '1px solid rgba(255,255,255,0.18)' }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 'clamp(14px,5cqw,18px)', letterSpacing: '0.04em', lineHeight: 1 }}>CKCL</div>
            <div style={{ fontSize: 'clamp(7.5px,2.4cqw,9.5px)', color: 'rgba(255,255,255,0.7)', marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Chittagong Khulshi Club Ltd. · Membership Card</div>
          </div>
          <span
            role="status"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 9px', borderRadius: 999, background: active ? 'rgba(255,255,255,0.92)' : '#FFF1F2', color: active ? T.green : T.brand700, fontSize: 'clamp(9px,2.8cqw,10.5px)', fontWeight: 700, letterSpacing: '0.06em', whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: active ? T.green : T.brand }}/>
            {active ? 'ACTIVE' : 'INACTIVE'}
          </span>
        </div>

        {/* Body: framed portrait | labelled fields */}
        <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: '4.5cqw', alignItems: 'stretch' }}>
          <div style={{ height: '100%', aspectRatio: '4 / 5', flexShrink: 0, borderRadius: 10, overflow: 'hidden', border: '2px solid rgba(255,255,255,0.85)', background: 'rgba(255,255,255,0.15)', boxShadow: '0 6px 16px rgba(0,0,0,0.25)' }}>
            <img src={member.photo} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}/>
          </div>

          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <CardField label="Name">
              <span style={{ fontSize: 'clamp(12px,4.4cqw,17px)', letterSpacing: '0.02em', textTransform: 'uppercase' }}>{member.name}</span>
            </CardField>
            <CardField label="Membership type">{member.tier}</CardField>
            {/* Job title only — the employer doesn't fit on the card */}
            <CardField label="Occupation">{MEMBER_PROFILE.profession.split(',')[0]}</CardField>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <CardField label="Membership code">
                <span style={{ letterSpacing: '0.14em' }}>{member.memberNo}</span>
              </CardField>
              <CardField label="Blood group">{MEMBER_PROFILE.bloodGroup}</CardField>
            </div>
            <CardField label="Date of issue">{MEMBER_PROFILE.issuedOn}</CardField>
          </div>
        </div>
      </div>
    </Tag>
  )
}

// Reason + next step under the card when the membership is not active
function InactiveNote({ member, onNavigate }: { member: Member; onNavigate: (p: PortalPage) => void }) {
  const st = membershipState(member.status)
  if (st.active) return null
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10, padding: '10px 12px', background: st.bg, border: `1px solid ${st.border}`, borderRadius: 12 }}>
      <span style={{ flex: 1, fontFamily: 'CKCL', fontSize: 13, color: T.ink600, lineHeight: 1.45 }}>{st.note}</span>
      {st.cta && (
        <button onClick={() => onNavigate(st.cta!.page)} style={{ flexShrink: 0, height: 34, padding: '0 14px', borderRadius: 9, border: 'none', background: T.brand, color: '#FFF', fontFamily: 'CKCL', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}>{st.cta.label}</button>
      )}
    </div>
  )
}

// ─── View-all tile ────────────────────────────────────────────────────────────
function ViewAllCard({ onNavigate }: { onNavigate: (p: PortalPage) => void }) {
  return (
    <button
      id="dash-viewall"
      onClick={() => onNavigate('account-statement')}
      aria-label="View account statement"
      style={{ ...CARD, cursor: 'pointer', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 14, fontFamily: 'CKCL', fontSize: 13, fontWeight: 600, color: T.brand, transition: 'box-shadow 160ms' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(14,17,22,0.08)' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = CARD.boxShadow as string }}
    >
      <span style={{ width: 44, height: 44, borderRadius: '50%', background: T.brandDim, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="9 18 15 12 9 6"/></svg>
      </span>
      View all
    </button>
  )
}

// ─── Quick actions ────────────────────────────────────────────────────────────
const qaIcon = (children: React.ReactNode) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
)

type ActionItem = { label: string; page: PortalPage; icon: React.ReactNode }

// Icon-over-label tiles, 4 across — shared by Quick actions and the mobile Services page
function ActionGrid({ actions, onNavigate }: { actions: ActionItem[]; onNavigate: (p: PortalPage) => void }) {
  return (
    <div className="action-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 8 }}>
      {actions.map((a) => (
        <button
          key={a.label}
          onClick={() => onNavigate(a.page)}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '16px 6px', background: 'transparent', borderRadius: 12, border: 'none', cursor: 'pointer', transition: 'background 160ms', fontFamily: 'CKCL', fontSize: 13, color: T.ink700, lineHeight: 1.3, textAlign: 'center' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = T.brandDim }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
        >
          <span style={{ display: 'flex', color: T.brand }}>{a.icon}</span>
          {a.label}
        </button>
      ))}
    </div>
  )
}

function QuickActions({ onNavigate }: { onNavigate: (p: PortalPage) => void }) {
  const actions: ActionItem[] = [
    { label: 'Pay dues', page: 'account-statement', icon: qaIcon(<><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/><path d="M5 15h4"/></>) },
    { label: 'Download statement', page: 'account-statement', icon: qaIcon(<><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>) },
    { label: 'Payment history', page: 'payment-history', icon: qaIcon(<><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></>) },
    { label: 'Invoices', page: 'invoices', icon: qaIcon(<><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></>) },
    { label: 'Bank accounts', page: 'bank-accounts', icon: qaIcon(<><path d="M3 10l9-6 9 6"/><path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8"/><path d="M3 21h18"/></>) },
    { label: 'Raise a request', page: 'change-request', icon: qaIcon(<><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></>) },
    { label: 'Contact helpdesk', page: 'helpdesk', icon: qaIcon(<><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3z"/><path d="M3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></>) },
    { label: 'Update details', page: 'personal-info', icon: qaIcon(<><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>) },
  ]
  return (
    <SectionCard title="Quick actions">
      <ActionGrid actions={actions} onNavigate={onNavigate}/>
    </SectionCard>
  )
}

// ─── Services (mobile/tablet) — every portal page, grouped like the sidebar ───
const SERVICE_GROUPS: { title: string; actions: ActionItem[] }[] = [
  {
    title: 'My account',
    actions: [
      { label: 'Membership card', page: 'membership-card', icon: qaIcon(<><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="12" r="2.5"/><path d="M13 10h5M13 14h3"/></>) },
      { label: 'Personal information', page: 'personal-info', icon: qaIcon(<><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>) },
      { label: 'Change password', page: 'change-password', icon: qaIcon(<><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></>) },
    ],
  },
  {
    title: 'Payments',
    actions: [
      { label: 'Account statement', page: 'account-statement', icon: qaIcon(<><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/><path d="M5 15h4"/></>) },
      { label: 'Payment history', page: 'payment-history', icon: qaIcon(<><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></>) },
      { label: 'Invoices', page: 'invoices', icon: qaIcon(<><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></>) },
      { label: 'Bank accounts', page: 'bank-accounts', icon: qaIcon(<><path d="M3 10l9-6 9 6"/><path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8"/><path d="M3 21h18"/></>) },
    ],
  },
  {
    title: 'Support',
    actions: [
      { label: 'Change request', page: 'change-request', icon: qaIcon(<><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></>) },
      { label: 'Online helpdesk', page: 'helpdesk', icon: qaIcon(<><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3z"/><path d="M3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></>) },
    ],
  },
]

function Services({ onNavigate, onLogout }: { onNavigate: (p: PortalPage) => void; onLogout: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {SERVICE_GROUPS.map((g) => (
        <SectionCard key={g.title} title={g.title}>
          <ActionGrid actions={g.actions} onNavigate={onNavigate}/>
        </SectionCard>
      ))}
      <button
        onClick={onLogout}
        style={{ ...CARD, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', fontFamily: 'CKCL', fontSize: 14, fontWeight: 600, color: T.brand }}
      >
        {Icons.logout}
        Log out
      </button>
    </div>
  )
}

// ─── Your details ─────────────────────────────────────────────────────────────
function YourDetails({ member, onNavigate }: { member: Member; onNavigate: (p: PortalPage) => void }) {
  const fields = [
    { label: 'Name', value: member.name },
    { label: 'Membership no.', value: member.memberNo },
    { label: 'Membership type', value: member.tier },
    { label: 'Contact no.', value: member.phone },
    { label: 'Email', value: member.email },
    { label: 'Address', value: null },
  ]
  return (
    <SectionCard
      title="Your details"
      action={
        <button
          onClick={() => onNavigate('personal-info')}
          style={{ height: 32, padding: '0 12px', borderRadius: 8, border: `1.5px solid ${T.ink100}`, background: 'none', fontFamily: 'CKCL', fontSize: 12, fontWeight: 600, color: T.ink600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Edit
        </button>
      }
    >
      <div id="details-def-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '18px 24px' }}>
        {fields.map((f) => (
          <div key={f.label} style={{ minWidth: 0 }}>
            <div style={{ fontFamily: 'CKCL', fontSize: 12, color: T.ink400, marginBottom: 4 }}>{f.label}</div>
            {f.value
              ? <div title={f.value} style={{ fontFamily: 'CKCL', fontSize: 14, fontWeight: 600, color: T.ink900, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.value}</div>
              : <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontFamily: 'CKCL', fontSize: 14, color: T.ink200, fontStyle: 'italic' }}>Not provided</span>
                  <button onClick={() => onNavigate('personal-info')} style={{ fontFamily: 'CKCL', fontSize: 12, fontWeight: 600, color: T.brand, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Add</button>
                </div>
            }
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

// ─── Club updates ─────────────────────────────────────────────────────────────
const NOTICES_DATA = [
  { date: '03 Jul', title: '2ND CONVENER COMMITTEE Meeting (Agenda Notice)', bangla: false, type: 'PDF' as const },
  { date: '08 Jul', title: 'বকেয়া পরিশোধ সংক্রান্ত বিশেষ নোটিশ', bangla: true, type: 'PDF' as const },
  { date: '09 Jun', title: 'খুলশী ক্লাব পরিবার শোকাহত', bangla: true, type: 'JPG' as const },
  { date: '02 Jun', title: 'নোটিশ', bangla: true, type: 'PDF' as const },
]
const NEWS_DATA = [
  { date: '09 Jun', title: 'Club Night 2026 — A Night to Remember', bangla: false, type: 'News' as const },
  { date: '19 May', title: 'Annual Picnic 2026 — Registration now open', bangla: false, type: 'News' as const },
  { date: '03 Apr', title: 'CKCL Land Video — Official club documentary', bangla: false, type: 'Video' as const },
  { date: '01 Mar', title: 'দৈনিক আজাদী নিউজ', bangla: true, type: 'News' as const },
]

function ClubUpdates() {
  const [tab, setTab] = useState<'notices' | 'news'>('notices')
  const rows = tab === 'notices' ? NOTICES_DATA : NEWS_DATA
  return (
    <SectionCard
      title="Club updates"
      action={
        <div style={{ display: 'flex', background: T.surface100, borderRadius: 8, padding: 3, gap: 2 }}>
          {(['notices', 'news'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{ padding: '5px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', fontFamily: 'CKCL', fontSize: 12, fontWeight: 600, transition: 'all 160ms', background: tab === t ? T.surface0 : 'transparent', color: tab === t ? T.ink900 : T.ink400, boxShadow: tab === t ? '0 1px 4px rgba(14,17,22,0.08)' : 'none' }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', margin: '0 -8px' }}>
        {rows.map((row, i) => (
          <div
            key={i}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 8px', borderRadius: 10, cursor: 'pointer', transition: 'background 120ms' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = T.surface50 }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
          >
            <div style={{ flexShrink: 0, background: T.brandDim, borderRadius: 8, padding: '6px 8px', fontFamily: 'CKCL', fontSize: 11, fontWeight: 600, color: T.brand, width: 56, textAlign: 'center' }}>{row.date}</div>
            <div style={{ flex: 1, minWidth: 0, fontFamily: 'CKCL', fontSize: row.bangla ? 14 : 13, color: T.ink700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.title}</div>
            <span style={{ flexShrink: 0, fontFamily: 'CKCL', fontSize: 10, fontWeight: 600, color: T.ink400, background: T.surface100, borderRadius: 4, padding: '2px 6px' }}>{row.type}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.ink200} strokeWidth="2.5" style={{ flexShrink: 0 }}><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        ))}
      </div>
      <button style={{ marginTop: 12, fontFamily: 'CKCL', fontSize: 13, fontWeight: 600, color: T.brand, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Open the notice board →</button>
    </SectionCard>
  )
}

// ─── Ad rail ──────────────────────────────────────────────────────────────────
// Placeholder ads with fictional advertisers — swap for real placements later
const AD_IMG = {
  catering: 'https://images.unsplash.com/photo-1643101570532-88c8ecc07c1f?w=400&h=400&fit=crop&auto=format',
  coffee: 'https://images.unsplash.com/photo-1581115685033-ccf1aa701722?w=400&h=400&fit=crop&auto=format',
}

const PARTNER_OFFERS = [
  { name: 'Bay Leaf Travels', offer: "15% off Cox's Bazar weekend packages", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg> },
  { name: 'AquaFit Academy', offer: 'First swimming lesson free for kids', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 12c2 0 2-1.5 4-1.5S8 12 10 12s2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5"/><path d="M2 17c2 0 2-1.5 4-1.5S8 17 10 17s2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5"/><circle cx="16" cy="5" r="2"/></svg> },
  { name: 'Hill View Dental', offer: 'Complimentary check-up for members', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5.5C10.5 4 8.5 3 6.5 3.5 4 4 3 6.5 3.5 9c.5 2.5 1.5 4 2 7 .4 2.5 1 5 2.5 5s1.8-2.5 2.2-4.5c.3-1.3 1-1.8 1.8-1.8s1.5.5 1.8 1.8c.4 2 .8 4.5 2.2 4.5s2.1-2.5 2.5-5c.5-3 1.5-4.5 2-7 .5-2.5-.5-5-3-5.5-2-.5-4 .5-5.5 2z"/></svg> },
]

function AdTag({ side = 'right' }: { side?: 'left' | 'right' }) {
  return (
    <span style={{ position: 'absolute', top: 10, [side]: 10, fontFamily: 'CKCL', fontSize: 9, fontWeight: 700, letterSpacing: '0.10em', color: T.ink400, background: 'rgba(255,255,255,0.75)', border: `1px solid ${T.ink100}`, borderRadius: 999, padding: '2px 7px' }}>AD</span>
  )
}

function PromoAd({ title, body, cta, img, imageSide, background }: {
  title: string; body: string; cta: string; img: string; imageSide: 'left' | 'right'; background: string
}) {
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      style={{ position: 'relative', display: 'flex', flexDirection: imageSide === 'left' ? 'row' : 'row-reverse', alignItems: 'stretch', minHeight: 140, borderRadius: 14, overflow: 'hidden', background, border: '1px solid rgba(225,11,23,0.10)', textDecoration: 'none', transition: 'transform 180ms, box-shadow 180ms' }}
      onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 10px 28px rgba(14,17,22,0.10)' }}
      onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = ''; el.style.boxShadow = 'none' }}
    >
      {/* The "AD" label sits on the photo's outer corner so it never collides with the headline */}
      <div style={{ position: 'relative', width: 120, flexShrink: 0 }}>
        <img src={img} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}/>
        <AdTag side={imageSide}/>
      </div>
      <div style={{ flex: 1, minWidth: 0, padding: '18px 18px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 16, color: T.ink900, lineHeight: 1.3 }}>{title}</div>
        <div style={{ fontFamily: 'CKCL', fontSize: 13, color: T.ink400, lineHeight: 1.5 }}>{body}</div>
        <span style={{ marginTop: 'auto', paddingTop: 4, fontFamily: 'CKCL', fontSize: 12, fontWeight: 600, color: T.brand }}>{cta} →</span>
      </div>
    </a>
  )
}

function AdRail() {
  return (
    <aside id="dash-ads" aria-label="Sponsored">
      <PromoAd
        title="Plan the perfect event"
        body="Spice Route Catering — 10% off Convention Hall catering packages for CKCL members."
        cta="See packages"
        img={AD_IMG.catering}
        imageSide="left"
        background="linear-gradient(120deg, #FFF1F2 0%, #FBF4EA 100%)"
      />
      <PromoAd
        title="Fresh beans, every week"
        body="Beanstalk Roasters delivers across Chattogram. Use code CKCL15 on your first order."
        cta="Order now"
        img={AD_IMG.coffee}
        imageSide="right"
        background="linear-gradient(120deg, #F7F2EA 0%, #EEF1F5 100%)"
      />

      <section style={{ ...CARD, position: 'relative', padding: '18px 20px 12px' }}>
        <AdTag/>
        <h2 style={{ margin: 0, paddingBottom: 12, marginBottom: 6, borderBottom: `1px solid ${T.ink100}`, fontFamily: 'CKCL', fontWeight: 600, fontSize: 16, color: T.ink700 }}>Partner offers</h2>
        {PARTNER_OFFERS.map((p) => (
          <a
            key={p.name}
            href="#"
            onClick={(e) => e.preventDefault()}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 8px', margin: '0 -8px', borderRadius: 10, textDecoration: 'none', transition: 'background 120ms' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = T.surface50 }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
          >
            <IconTile bg={T.brandDim} color={T.brand}>{p.icon}</IconTile>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 14, color: T.ink900 }}>{p.name}</div>
              <div style={{ fontFamily: 'CKCL', fontSize: 12, color: T.green }}>{p.offer}</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.ink400} strokeWidth="2.2" style={{ flexShrink: 0 }}><polyline points="9 18 15 12 9 6"/></svg>
          </a>
        ))}
      </section>
    </aside>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
// ─── Membership status: plain Active / Inactive for members, with the reason ──
function membershipState(status: Member['status']) {
  if (status === 'Active') {
    return { active: true, label: 'Active', color: T.green, bg: T.greenDim, border: 'rgba(22,163,74,0.28)',
      title: 'Your membership is active', note: 'You have full access to all club facilities.', cta: null as null | { label: string; page: PortalPage } }
  }
  return status === 'Suspended'
    ? { active: false, label: 'Inactive', color: T.brand700, bg: T.brandDim, border: 'rgba(225,11,23,0.25)',
        title: 'Your membership is inactive', note: 'Suspended due to overdue dues. Clear your balance to restore facility access.', cta: { label: 'Pay dues', page: 'account-statement' as PortalPage } }
    : { active: false, label: 'Inactive', color: T.brand700, bg: T.brandDim, border: 'rgba(225,11,23,0.25)',
        title: 'Your membership is inactive', note: 'Your membership has expired. Contact the club office to renew.', cta: { label: 'Contact helpdesk', page: 'helpdesk' as PortalPage } }
}

function Dashboard({ member, onNavigate }: { member: Member; onNavigate: (p: PortalPage) => void }) {
  const overdue = DUES.filter((d) => d.status === 'Overdue')
  const totalOutstanding = overdue.reduce((s, d) => s + d.amount, 0)
  const openCard = () => onNavigate('membership-card')

  return (
    <div id="dash-grid">
      {/* Centre column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
        {/* Phones/tablets: the membership card (with its status) comes first */}
        <div id="dash-card-top">
          <div style={{ maxWidth: 440, margin: '0 auto' }}><MembershipCard member={member} onOpen={openCard}/></div>
          <InactiveNote member={member} onNavigate={onNavigate}/>
        </div>

        <NoticeStrip onNavigate={onNavigate}/>

        {/* Tablet/desktop: membership card | dues (same height) | view all */}
        <div id="dash-summary">
          <div id="dash-card-inrow">
            <MembershipCard member={member} onOpen={openCard}/>
            <InactiveNote member={member} onNavigate={onNavigate}/>
          </div>
          <DuesCard outstanding={totalOutstanding} onNavigate={onNavigate}/>
          <ViewAllCard onNavigate={onNavigate}/>
        </div>

        <QuickActions onNavigate={onNavigate}/>
        <YourDetails member={member} onNavigate={onNavigate}/>
        <ClubUpdates/>
      </div>

      {/* Right column — ad placements */}
      <AdRail/>
    </div>
  )
}

// ─── Membership card view: Details · Transactions ─────────────────────────────
// Mock record — replace with the member's profile from the API
const MEMBER_PROFILE = {
  validThrough: 'June 2027',
  issuedOn: '01 July 2025',
  dob: '12 April 1968',
  bloodGroup: 'B+',
  nid: '•••• •••• 4471',
  address: 'House 14, Road 2, Khulshi R/A, Chattogram 4225',
  profession: 'Managing Director, Islam Group of Industries',
  spouse: 'Mrs. Salma Islam',
  nominee: 'Mrs. Salma Islam (Spouse)',
  proposer: 'Founding member',
  lastPayment: { amount: 5000, date: '15 Jul 2026' },
  nextDue: { amount: 2500, date: '01 Oct 2026' },
}

type CardTxn = { id: string; date: string; time: string; title: string; detail: string; amount: number }

// Negative = charge to the member's account, positive = payment received
const CARD_TRANSACTIONS: CardTxn[] = [
  { id: 'INV-2026-0931', date: '28 Sep 2026', time: '08:14 PM', title: 'Main Dining Hall — Dinner', detail: 'Restaurant bill · Table 12 · 4 guests', amount: -3850 },
  { id: 'INV-2026-0918', date: '21 Sep 2026', time: '02:00 PM', title: 'Guest House — 1 night', detail: 'Room 204 · Check-in 21 Sep', amount: -4000 },
  { id: 'INV-2026-0912', date: '14 Sep 2026', time: '10:32 AM', title: 'Swimming Pool — Guest pass', detail: '2 guests', amount: -600 },
  { id: 'INV-2026-009', date: '01 Sep 2026', time: '12:00 AM', title: 'Monthly subscription — Sep 2026', detail: 'Membership dues', amount: -2500 },
  { id: 'INV-2026-008', date: '01 Aug 2026', time: '12:00 AM', title: 'Monthly subscription — Aug 2026', detail: 'Membership dues', amount: -2500 },
  { id: 'PAY-2026-005', date: '15 Jul 2026', time: '06:47 PM', title: 'Payment received — bKash', detail: 'Ref. TXN8K2Q4PZ · Thank you', amount: 5000 },
  { id: 'INV-2026-007', date: '01 Jul 2026', time: '12:00 AM', title: 'Monthly subscription — Jul 2026', detail: 'Membership dues', amount: -2500 },
  { id: 'PAY-2026-004', date: '20 Jun 2026', time: '11:05 AM', title: 'Payment received — Card', detail: 'Visa •••• 4417', amount: 2500 },
  { id: 'INV-2026-006', date: '01 Jun 2026', time: '12:00 AM', title: 'Monthly subscription — Jun 2026', detail: 'Membership dues', amount: -2500 },
]

function DefItem({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div style={{ minWidth: 0, gridColumn: wide ? '1 / -1' : undefined }}>
      <div style={{ fontFamily: 'CKCL', fontSize: 13, color: T.ink400, marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: 'CKCL', fontSize: 16, color: T.ink900, lineHeight: 1.35, overflowWrap: 'anywhere' }}>{children}</div>
    </div>
  )
}

function DefCard({ title, children, action }: { title?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section style={{ ...CARD, padding: '20px 22px' }}>
      {title && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontFamily: 'CKCL', fontWeight: 600, fontSize: 15, color: T.ink700 }}>{title}</h3>
          {action}
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: '20px 20px' }}>{children}</div>
    </section>
  )
}

function CardDetails({ member, outstanding, onNavigate }: { member: Member; outstanding: number; onNavigate: (p: PortalPage) => void }) {
  const p = MEMBER_PROFILE
  const st = membershipState(member.status)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <DefCard>
        <DefItem label="Outstanding balance" wide>
          <span style={{ fontSize: 22, fontWeight: 600, color: outstanding > 0 ? T.brand : T.ink900 }}>৳ {outstanding.toLocaleString()}</span>
        </DefItem>
        <DefItem label="Last payment">৳ {p.lastPayment.amount.toLocaleString()}<div style={{ fontSize: 12, color: T.ink400 }}>{p.lastPayment.date}</div></DefItem>
        <DefItem label="Next due">৳ {p.nextDue.amount.toLocaleString()}<div style={{ fontSize: 12, color: T.ink400 }}>{p.nextDue.date}</div></DefItem>
        <div style={{ gridColumn: '1 / -1' }}>
          <button
            onClick={() => onNavigate('account-statement')}
            style={{ width: '100%', height: 48, borderRadius: 12, border: `1.5px solid ${T.brand}`, background: T.surface0, fontFamily: 'CKCL', fontSize: 15, fontWeight: 600, color: T.brand, cursor: 'pointer', transition: 'background 160ms' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = T.brandDim }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = T.surface0 }}
          >
            Make payment
          </button>
        </div>
      </DefCard>

      <DefCard title="Membership">
        <DefItem label="Membership no.">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>{member.memberNo}<CopyBtn value={member.memberNo} id="card-memberNo" size={22}/></span>
        </DefItem>
        <DefItem label="Status"><span style={{ color: st.color, fontWeight: 600 }}>{st.label}</span></DefItem>
        <DefItem label="Membership type">{member.tier}</DefItem>
        <DefItem label="Member since">{member.joinDate}</DefItem>
        <DefItem label="Card valid through">{p.validThrough}</DefItem>
        <DefItem label="Proposed by">{p.proposer}</DefItem>
      </DefCard>

      <DefCard
        title="Personal"
        action={<button onClick={() => onNavigate('personal-info')} style={{ fontFamily: 'CKCL', fontSize: 13, fontWeight: 600, color: T.brand, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Edit</button>}
      >
        <DefItem label="Name" wide>{member.name}</DefItem>
        <DefItem label="Mobile">{member.phone}</DefItem>
        <DefItem label="Email">{member.email}</DefItem>
        <DefItem label="Date of birth">{p.dob}</DefItem>
        <DefItem label="Blood group">{p.bloodGroup}</DefItem>
        <DefItem label="NID">{p.nid}</DefItem>
        <DefItem label="Spouse">{p.spouse}</DefItem>
        <DefItem label="Profession" wide>{p.profession}</DefItem>
        <DefItem label="Address" wide>{p.address}</DefItem>
        <DefItem label="Nominee" wide>{p.nominee}</DefItem>
      </DefCard>
    </div>
  )
}

type TxnFilter = 'all' | 'charges' | 'payments'

function CardTransactions() {
  const [filter, setFilter] = useState<TxnFilter>('all')
  const [open, setOpen] = useState<string | null>(null)
  const rows = CARD_TRANSACTIONS.filter((t) => filter === 'all' || (filter === 'payments' ? t.amount > 0 : t.amount < 0))
  const filters: { id: TxnFilter; label: string }[] = [{ id: 'all', label: 'All' }, { id: 'charges', label: 'Charges' }, { id: 'payments', label: 'Payments' }]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div role="tablist" aria-label="Filter transactions" style={{ display: 'flex', gap: 10 }}>
        {filters.map((f) => {
          const on = filter === f.id
          return (
            <button
              key={f.id} role="tab" aria-selected={on} onClick={() => { setFilter(f.id); setOpen(null) }}
              style={{ height: 40, padding: '0 20px', borderRadius: 999, border: 'none', background: T.surface0, boxShadow: '0 1px 3px rgba(14,17,22,0.06)', fontFamily: 'CKCL', fontSize: 14, fontWeight: on ? 600 : 500, color: on ? T.brand : T.ink700, cursor: 'pointer' }}
            >
              {f.label}
            </button>
          )
        })}
      </div>

      <div style={{ ...CARD, padding: '6px 0' }}>
        {rows.map((t, i) => {
          const expanded = open === t.id
          const credit = t.amount > 0
          return (
            <div key={t.id} style={{ borderTop: i ? `1px solid ${T.surface100}` : 'none' }}>
              <button
                onClick={() => setOpen(expanded ? null : t.id)}
                aria-expanded={expanded}
                style={{ width: '100%', display: 'flex', alignItems: 'flex-start', gap: 10, padding: '14px 18px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'CKCL', fontSize: 15, color: T.ink900, lineHeight: 1.35 }}>{t.title}</div>
                  <div style={{ fontFamily: 'CKCL', fontSize: 12.5, color: T.ink400, marginTop: 3 }}>{t.date} • {t.time}</div>
                </div>
                <span style={{ fontFamily: 'CKCL', fontSize: 15, fontWeight: 600, color: credit ? T.green : '#E5671B', whiteSpace: 'nowrap' }}>
                  {credit ? '+' : '-'} ৳{Math.abs(t.amount).toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.ink400} strokeWidth="2" style={{ flexShrink: 0, marginTop: 2, transition: 'transform 200ms', transform: expanded ? 'rotate(90deg)' : 'none' }}><polyline points="9 18 15 12 9 6"/></svg>
              </button>
              {expanded && (
                <div style={{ margin: '0 18px 14px', padding: '10px 12px', background: T.surface50, borderRadius: 10, display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '6px 14px', fontFamily: 'CKCL', fontSize: 12.5 }}>
                  <span style={{ color: T.ink400 }}>Reference</span><span style={{ color: T.ink900, fontWeight: 600 }}>{t.id}</span>
                  <span style={{ color: T.ink400 }}>Details</span><span style={{ color: T.ink700 }}>{t.detail}</span>
                  <span style={{ color: T.ink400 }}>Type</span><span style={{ color: T.ink700 }}>{credit ? 'Payment' : 'Charge'}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function MembershipCardView({ member, onNavigate }: { member: Member; onNavigate: (p: PortalPage) => void }) {
  const [tab, setTab] = useState<'details' | 'transactions'>('details')
  const outstanding = DUES.filter((d) => d.status === 'Overdue').reduce((s, d) => s + d.amount, 0)

  return (
    <div style={{ maxWidth: 620, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20, paddingBottom: 40 }}>
      {/* Header — back + title, like a native screen */}
      <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 40px', alignItems: 'center' }}>
        <button
          onClick={() => onNavigate('dashboard')} aria-label="Back to dashboard"
          style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', background: 'transparent', color: T.ink900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = T.surface100 }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 style={{ margin: 0, textAlign: 'center', fontFamily: 'CKCL', fontWeight: 600, fontSize: 20, color: T.ink900 }}>Membership card</h1>
      </div>

      <div style={{ width: '100%', maxWidth: 440, margin: '0 auto' }}>
        <MembershipCard member={member}/>
        <InactiveNote member={member} onNavigate={onNavigate}/>
      </div>

      {/* Segmented control */}
      <div role="tablist" aria-label="Membership card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, padding: 6, background: T.surface0, borderRadius: 14, boxShadow: '0 1px 3px rgba(14,17,22,0.05)' }}>
        {([['details', 'Details'], ['transactions', 'Transactions']] as const).map(([id, label]) => {
          const on = tab === id
          return (
            <button
              key={id} role="tab" aria-selected={on} onClick={() => setTab(id)}
              style={{ height: 44, borderRadius: 10, border: 'none', background: on ? T.brandDim : 'transparent', fontFamily: 'CKCL', fontSize: 15, fontWeight: on ? 600 : 500, color: on ? T.brand : T.ink400, cursor: 'pointer', transition: 'background 160ms, color 160ms' }}
            >
              {label}
            </button>
          )
        })}
      </div>

      {tab === 'details' ? <CardDetails member={member} outstanding={outstanding} onNavigate={onNavigate}/> : <CardTransactions/>}
    </div>
  )
}

// ─── Placeholder for unimplemented pages ──────────────────────────────────────
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 320, gap: 12, background: T.surface0, borderRadius: 16, border: `1px solid ${T.ink100}` }}>
      <div style={{ width: 56, height: 56, borderRadius: '50%', background: T.surface100, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.ink200 }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
      </div>
      <div style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 18, color: T.ink900 }}>{title}</div>
      <div style={{ fontFamily: 'CKCL', fontSize: 14, color: T.ink400 }}>This page is coming soon.</div>
    </div>
  )
}

// ─── Portal Shell ─────────────────────────────────────────────────────────────
// ─── Shared table helpers ─────────────────────────────────────────────────────
const fmt = (n: number) => `৳ ${n.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

type DueStatus = 'Paid' | 'Overdue' | 'Unpaid' | 'Pending' | 'Failed' | 'Cancelled'

function TableStatusChip({ status }: { status: DueStatus }) {
  const cfg: Record<DueStatus, { bg: string; color: string }> = {
    Paid: { bg: T.greenDim, color: T.green },
    Overdue: { bg: T.brandDim, color: T.brand },
    Unpaid: { bg: T.amberDim, color: T.amber },
    Pending: { bg: T.amberDim, color: T.amber },
    Failed: { bg: T.brandDim, color: T.brand700 },
    Cancelled: { bg: T.surface100, color: T.ink400 },
  }
  const { bg, color } = cfg[status]
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: bg, color, borderRadius: 999, padding: '3px 9px', fontFamily: 'CKCL', fontSize: 11, fontWeight: 700 }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0 }}/>
      {status}
    </span>
  )
}

function TableEmpty({ icon, heading, body, action }: { icon: React.ReactNode; heading: string; body: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '56px 24px', gap: 12, textAlign: 'center' }}>
      <div style={{ width: 56, height: 56, borderRadius: '50%', background: T.surface100, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.ink200, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 18, color: T.ink900 }}>{heading}</div>
      <div style={{ fontFamily: 'CKCL', fontSize: 14, color: T.ink400, maxWidth: 360, lineHeight: 1.6 }}>{body}</div>
      {action}
    </div>
  )
}

function TableSkeleton({ cols, rows = 5 }: { cols: string; rows?: number }) {
  return (
    <>
      <style>{`@keyframes shimmer { 0%{opacity:.5}50%{opacity:1}100%{opacity:.5} }`}</style>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: cols, height: 56, borderBottom: `1px solid #EEF1F5`, alignItems: 'center' }}>
          {cols.split(' ').map((__, j) => (
            <div key={j} style={{ padding: '0 16px' }}>
              <div style={{ height: 13, borderRadius: 6, background: '#EEF1F5', animation: 'shimmer 1.4s ease-in-out infinite', animationDelay: `${i * 80}ms` }}/>
            </div>
          ))}
        </div>
      ))}
    </>
  )
}

function TableError({ onRetry }: { onRetry?: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 24px', gap: 12, textAlign: 'center' }}>
      <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#FFF1F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E10B17' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      </div>
      <div style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 17, color: '#0E1116' }}>Could not load data</div>
      <div style={{ fontFamily: 'CKCL', fontSize: 14, color: '#5C6673', maxWidth: 300, lineHeight: 1.6 }}>Something went wrong fetching your records. Check your connection and try again.</div>
      {onRetry && (
        <button onClick={onRetry} style={{ marginTop: 4, height: 38, padding: '0 20px', borderRadius: 9, border: '1.5px solid #E2E6EC', background: 'transparent', fontFamily: 'CKCL', fontSize: 13, fontWeight: 600, color: '#2A3039', cursor: 'pointer' }}>
          Retry
        </button>
      )}
    </div>
  )
}

function ColHead({ label, right }: { label: string; right?: boolean }) {
  return (
    <div style={{ padding: '0 16px', fontFamily: 'CKCL', fontSize: 13, fontWeight: 600, color: T.ink700, textAlign: right ? 'right' : 'left', display: 'flex', alignItems: 'center', justifyContent: right ? 'flex-end' : 'flex-start', gap: 4 }}>
      {label}
    </div>
  )
}

function IconBtn({ title, children, onClick }: { title: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <button title={title} onClick={onClick} style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${T.ink100}`, background: T.surface0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.ink400, transition: 'all 160ms', flexShrink: 0 }}
      onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = T.ink600; el.style.color = T.ink900 }}
      onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = T.ink100; el.style.color = T.ink400 }}
    >
      {children}
    </button>
  )
}

// ─── G. Account Statement ─────────────────────────────────────────────────────
const STATEMENT_DATA = [
  { date: '01 Sep 2026', voucher: 'BF-001', particulars: 'Balance brought forward', due: 5000, paid: 0, balance: 5000, isBF: true },
  { date: '01 Sep 2026', voucher: 'INV-2026-009', particulars: 'Monthly subscription — Sep 2026', due: 2500, paid: 0, balance: 7500, isBF: false },
  { date: '01 Aug 2026', voucher: 'INV-2026-008', particulars: 'Monthly subscription — Aug 2026', due: 2500, paid: 0, balance: 5000, isBF: false },
  { date: '15 Jul 2026', voucher: 'PAY-2026-005', particulars: 'Online payment received — Thank you', due: 0, paid: 5000, balance: 0, isBF: false },
  { date: '01 Jul 2026', voucher: 'INV-2026-007', particulars: 'Monthly subscription — Jul 2026', due: 2500, paid: 0, balance: 5000, isBF: false },
  { date: '20 Jun 2026', voucher: 'PAY-2026-004', particulars: 'Online payment received — Thank you', due: 0, paid: 2500, balance: 2500, isBF: false },
  { date: '01 Jun 2026', voucher: 'INV-2026-006', particulars: 'Monthly subscription — Jun 2026', due: 2500, paid: 0, balance: 5000, isBF: false },
]
type Preset = 'this-month' | 'last-3' | 'this-year' | 'custom'

function AccountStatement() {
  const [preset, setPreset] = useState<Preset>('last-3')
  const [fromDate, setFromDate] = useState('2026-07-01')
  const [toDate, setToDate] = useState('2026-09-30')
  const [tableState, setTableState] = useState<'populated' | 'loading' | 'error'>('populated')
  const rows = tableState === 'populated' ? STATEMENT_DATA : []

  const openingBalance = 5000
  const totalCharged = rows.filter((r) => !r.isBF).reduce((s, r) => s + r.due, 0)
  const totalPaid = rows.reduce((s, r) => s + r.paid, 0)
  const closingBalance = rows[rows.length - 1]?.balance ?? 0

  const presets: { id: Preset; label: string }[] = [
    { id: 'this-month', label: 'This month' },
    { id: 'last-3', label: 'Last 3 months' },
    { id: 'this-year', label: 'This year' },
    { id: 'custom', label: 'Custom' },
  ]

  const COLS = ['Trans. date', 'Voucher no.', 'Particulars', 'Due', 'Paid', 'Balance']
  const colGrid = '140px 140px 1fr 130px 130px 130px'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Filter bar */}
      <div id="stmt-filter-bar" style={{ background: T.surface0, borderRadius: 14, border: `1px solid ${T.ink100}`, padding: '18px 20px', display: 'flex', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
        {/* Date range */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontFamily: 'CKCL', fontSize: 11, fontWeight: 600, color: T.ink400, letterSpacing: '0.04em' }}>FROM</label>
          <input type="date" value={fromDate} onChange={(e) => { setFromDate(e.target.value); setPreset('custom') }} style={{ height: 40, padding: '0 12px', fontFamily: 'CKCL', fontSize: 13, color: T.ink900, background: T.surface50, border: `1.5px solid ${T.ink100}`, borderRadius: 8, outline: 'none', cursor: 'pointer' }}/>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontFamily: 'CKCL', fontSize: 11, fontWeight: 600, color: T.ink400, letterSpacing: '0.04em' }}>TO</label>
          <input type="date" value={toDate} onChange={(e) => { setToDate(e.target.value); setPreset('custom') }} style={{ height: 40, padding: '0 12px', fontFamily: 'CKCL', fontSize: 13, color: T.ink900, background: T.surface50, border: `1.5px solid ${T.ink100}`, borderRadius: 8, outline: 'none', cursor: 'pointer' }}/>
        </div>
        {/* Preset chips */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {presets.map((p) => (
            <button key={p.id} onClick={() => setPreset(p.id)} style={{ height: 40, padding: '0 14px', borderRadius: 8, border: `1.5px solid ${preset === p.id ? T.brand : T.ink100}`, background: preset === p.id ? T.brandDim : T.surface0, fontFamily: 'CKCL', fontSize: 13, fontWeight: 600, color: preset === p.id ? T.brand : T.ink600, cursor: 'pointer', transition: 'all 140ms' }}>
              {p.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => { setTableState('loading'); setTimeout(() => setTableState('populated'), 1000) }}
          style={{ height: 40, padding: '0 20px', borderRadius: 8, border: 'none', background: tableState === 'loading' ? T.ink200 : T.brand, fontFamily: 'CKCL', fontSize: 13, fontWeight: 700, color: '#FFF', cursor: tableState === 'loading' ? 'not-allowed' : 'pointer', transition: 'background 160ms', whiteSpace: 'nowrap' }}
          onMouseEnter={(e) => { if (tableState !== 'loading') (e.currentTarget as HTMLElement).style.background = T.brand700 }}
          onMouseLeave={(e) => { if (tableState !== 'loading') (e.currentTarget as HTMLElement).style.background = T.brand }}
        >
          {tableState === 'loading' ? 'Loading…' : 'Get report'}
        </button>
        <div style={{ flex: 1 }}/>
        <div style={{ display: 'flex', gap: 8 }}>
          <IconBtn title="Download PDF"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></IconBtn>
          <IconBtn title="Print"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg></IconBtn>
        </div>
      </div>

      {/* Summary strip */}
      <div id="stmt-summary" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        {[
          { label: 'Opening balance', value: openingBalance },
          { label: 'Total charged', value: totalCharged },
          { label: 'Total paid', value: totalPaid },
          { label: 'Closing balance', value: closingBalance },
        ].map((s) => (
          <div key={s.label} style={{ background: T.surface0, borderRadius: 12, border: `1px solid ${T.ink100}`, padding: '14px 16px' }}>
            <div style={{ fontFamily: 'CKCL', fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', color: T.ink400, textTransform: 'uppercase' as const, marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 16, color: T.ink900 }}>{fmt(s.value)}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="portal-table-scroll" style={{ background: T.surface0, borderRadius: 14, border: `1px solid ${T.ink100}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(14,17,22,0.04)' }}>
        <div className="portal-table-inner">
        {/* Period caption */}
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${T.ink100}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: 'CKCL', fontSize: 12, color: T.ink400 }}>
            Statement period: <span style={{ fontFamily: 'CKCL', color: T.ink700 }}>01 Jul 2026 – 30 Sep 2026</span>
          </div>
          <div style={{ fontFamily: 'CKCL', fontSize: 12, color: T.ink400 }}>
            {rows.length} transactions
          </div>
        </div>

        {/* Col headers */}
        <div style={{ display: 'grid', gridTemplateColumns: colGrid, height: 48, background: T.surface50, borderBottom: `1px solid ${T.ink100}` }}>
          {COLS.map((c, i) => <ColHead key={c} label={c} right={i >= 3}/>)}
        </div>

        {/* Rows / loading / error */}
        {tableState === 'loading' && <TableSkeleton cols={colGrid}/>}
        {tableState === 'error' && <TableError onRetry={() => setTableState('populated')}/>}
        {tableState === 'populated' && rows.length === 0 && (
          <TableEmpty
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>}
            heading="No transactions in this period"
            body="Try a wider date range."
            action={<button onClick={() => setPreset('this-year')} style={{ height: 36, padding: '0 16px', borderRadius: 8, border: '1.5px solid #E2E6EC', background: 'transparent', fontFamily: 'CKCL', fontSize: 13, fontWeight: 600, color: '#2A3039', cursor: 'pointer' }}>Reset to this year</button>}
          />
        )}
        {tableState === 'populated' && rows.map((row, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: colGrid, height: 56, borderBottom: i < rows.length - 1 ? `1px solid ${T.ink100}` : 'none', background: row.isBF ? T.surface50 : 'transparent', alignItems: 'center', transition: 'background 120ms' }}
            onMouseEnter={(e) => { if (!row.isBF) (e.currentTarget as HTMLElement).style.background = T.surface50 }}
            onMouseLeave={(e) => { if (!row.isBF) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
          >
            <div style={{ padding: '0 16px', fontFamily: 'CKCL', fontSize: 12, color: row.isBF ? T.ink400 : T.ink700 }}>{row.date}</div>
            <div style={{ padding: '0 16px', fontFamily: 'CKCL', fontSize: 12, color: row.isBF ? T.ink400 : T.ink600 }}>{row.voucher}</div>
            <div style={{ padding: '0 16px', fontFamily: 'CKCL', fontSize: 13, color: row.isBF ? T.ink400 : T.ink900, fontStyle: row.isBF ? 'italic' : 'normal', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.particulars}</div>
            <div style={{ padding: '0 16px', fontFamily: 'CKCL', fontSize: 13, textAlign: 'right', color: row.due > 0 ? T.brand : T.ink200 }}>{row.due > 0 ? fmt(row.due) : '—'}</div>
            <div style={{ padding: '0 16px', fontFamily: 'CKCL', fontSize: 13, textAlign: 'right', color: row.paid > 0 ? T.green : T.ink200 }}>{row.paid > 0 ? fmt(row.paid) : '—'}</div>
            <div style={{ padding: '0 16px', fontFamily: 'CKCL', fontSize: 13, textAlign: 'right', fontWeight: 600, color: T.ink900 }}>{fmt(row.balance)}</div>
          </div>
        ))}

        {/* Total row — only when data is visible */}
        {tableState === 'populated' && rows.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: colGrid, height: 52, background: T.surface50, borderTop: `2px solid ${T.ink900}`, alignItems: 'center' }}>
          <div style={{ padding: '0 16px', gridColumn: '1 / 4', fontFamily: 'CKCL', fontSize: 13, fontWeight: 700, color: T.ink900 }}>Closing balance</div>
          <div style={{ padding: '0 16px', fontFamily: 'CKCL', fontSize: 13, fontWeight: 700, textAlign: 'right', color: T.brand }}>{fmt(totalCharged)}</div>
          <div style={{ padding: '0 16px', fontFamily: 'CKCL', fontSize: 13, fontWeight: 700, textAlign: 'right', color: T.green }}>{fmt(totalPaid)}</div>
          <div style={{ padding: '0 16px', fontFamily: 'CKCL', fontSize: 13, fontWeight: 700, textAlign: 'right', color: T.ink900 }}>{fmt(closingBalance)}</div>
        </div>
        )}
        </div>{/* /portal-table-inner */}
      </div>
    </div>
  )
}

// ─── H. Payment History ───────────────────────────────────────────────────────
const PAYMENT_HISTORY = [
  { id: 1, date: '15 Jul 2026', invoiceId: 'INV-2026-007', purpose: 'Monthly subscription — Jul 2026', amount: 5000, status: 'Paid' as DueStatus },
  { id: 2, date: '20 Jun 2026', invoiceId: 'INV-2026-006', purpose: 'Monthly subscription — Jun 2026', amount: 2500, status: 'Paid' as DueStatus },
  { id: 3, date: '10 May 2026', invoiceId: 'INV-2026-005', purpose: 'Monthly subscription — May 2026', amount: 2500, status: 'Paid' as DueStatus },
  { id: 4, date: '02 Apr 2026', invoiceId: 'INV-2026-004', purpose: 'Monthly subscription — Apr 2026', amount: 2500, status: 'Paid' as DueStatus },
  { id: 5, date: '05 Mar 2026', invoiceId: 'INV-2026-003', purpose: 'Monthly subscription — Mar 2026', amount: 2500, status: 'Failed' as DueStatus },
  { id: 6, date: '02 Feb 2026', invoiceId: 'INV-2026-002', purpose: 'Monthly subscription — Feb 2026', amount: 2500, status: 'Paid' as DueStatus },
]
type HistoryFilter = 'All' | 'Paid' | 'Pending' | 'Failed'
const HISTORY_FILTERS: HistoryFilter[] = ['All', 'Paid', 'Pending', 'Failed']
const HISTORY_COLS = ['#', 'Date', 'Invoice ID', 'Purpose', 'Amount', 'Status', 'Receipt']
const HISTORY_GRID = '44px 120px 140px 1fr 130px 120px 60px'

function PaymentHistory() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<HistoryFilter>('All')
  const [page] = useState(1)
  const [tableState, setTableState] = useState<'populated' | 'loading' | 'error'>('populated')
  const PER_PAGE = 10

  const filtered = PAYMENT_HISTORY.filter((r) => {
    const matchFilter = filter === 'All' || r.status === filter
    const matchSearch = !search || r.purpose.toLowerCase().includes(search.toLowerCase()) || r.invoiceId.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <div className="portal-table-scroll" style={{ display: 'flex', flexDirection: 'column', gap: 0, background: T.surface0, borderRadius: 14, border: `1px solid ${T.ink100}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(14,17,22,0.04)' }}>
      <div className="portal-table-inner">
      {/* Card header */}
      <div style={{ height: 64, padding: '0 20px', borderBottom: `1px solid ${T.ink100}`, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 17, color: T.ink900 }}>Payment history</span>
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 38, padding: '0 12px', background: T.surface50, border: `1.5px solid ${T.ink100}`, borderRadius: 8, flex: 1, maxWidth: 280 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.ink200} strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search payments…" style={{ flex: 1, fontFamily: 'CKCL', fontSize: 13, color: T.ink900, background: 'transparent', border: 'none', outline: 'none' }}/>
        </div>
        {/* Status filters */}
        <div style={{ display: 'flex', gap: 4 }}>
          {HISTORY_FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)} style={{ height: 32, padding: '0 12px', borderRadius: 999, border: `1.5px solid ${filter === f ? T.brand : T.ink100}`, background: filter === f ? T.brandDim : 'transparent', fontFamily: 'CKCL', fontSize: 12, fontWeight: 600, color: filter === f ? T.brand : T.ink600, cursor: 'pointer', transition: 'all 140ms' }}>
              {f}
            </button>
          ))}
        </div>
        <div style={{ flex: 1 }}/>
        <IconBtn title="Download PDF"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></IconBtn>
      </div>

      {/* Col headers */}
      <div style={{ display: 'grid', gridTemplateColumns: HISTORY_GRID, height: 48, background: T.surface50, borderBottom: `1px solid ${T.ink100}` }}>
        {HISTORY_COLS.map((c, i) => <ColHead key={c} label={c} right={i === 4}/>)}
      </div>

      {tableState === 'loading' && <TableSkeleton cols={HISTORY_GRID}/>}
      {tableState === 'error' && <TableError onRetry={() => setTableState('populated')}/>}
      {tableState === 'populated' && filtered.length === 0
        ? <TableEmpty
            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>}
            heading="No payments found"
            body="No payments recorded yet. Once you pay dues online or at the club office, receipts appear here."
          />
        : tableState === 'populated' && filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE).map((row, i) => (
            <div key={row.id} style={{ display: 'grid', gridTemplateColumns: HISTORY_GRID, height: 56, borderBottom: i < filtered.length - 1 ? `1px solid ${T.ink100}` : 'none', alignItems: 'center', transition: 'background 120ms' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = T.surface50 }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
              <div style={{ padding: '0 16px', fontFamily: 'CKCL', fontSize: 12, color: T.ink200 }}>{row.id}</div>
              <div style={{ padding: '0 16px', fontFamily: 'CKCL', fontSize: 12, color: T.ink600 }}>{row.date}</div>
              <div style={{ padding: '0 16px', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ fontFamily: 'CKCL', fontSize: 12, color: T.ink600 }}>{row.invoiceId}</span>
                <CopyBtn value={row.invoiceId} id={`inv-${row.id}`} size={24}/>
              </div>
              <div style={{ padding: '0 16px', fontFamily: 'CKCL', fontSize: 13, color: T.ink900, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.purpose}</div>
              <div style={{ padding: '0 16px', fontFamily: 'CKCL', fontSize: 13, textAlign: 'right', color: T.ink900, fontWeight: 600 }}>{fmt(row.amount)}</div>
              <div style={{ padding: '0 16px' }}><TableStatusChip status={row.status}/></div>
              <div style={{ padding: '0 8px', display: 'flex', justifyContent: 'center' }}>
                {row.status === 'Paid' && (
                  <IconBtn title="Download receipt"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></IconBtn>
                )}
              </div>
            </div>
          ))
      }

      {/* Pagination footer */}
      {filtered.length > 0 && (
        <div style={{ padding: '14px 20px', borderTop: `1px solid ${T.ink100}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: 'CKCL', fontSize: 13, color: T.ink400 }}>
            Showing {Math.min(filtered.length, PER_PAGE)} of {filtered.length} payments
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {[1].map((p) => (
              <button key={p} style={{ width: 32, height: 32, borderRadius: 8, border: `1.5px solid ${T.brand}`, background: T.brandDim, fontFamily: 'CKCL', fontSize: 13, fontWeight: 700, color: T.brand, cursor: 'pointer' }}>{p}</button>
            ))}
          </div>
        </div>
      )}
      </div>{/* /portal-table-inner */}
    </div>
  )
}

// ─── I. Invoices ──────────────────────────────────────────────────────────────
const INVOICE_DATA = [
  { id: 1, date: '01 Sep 2026', purpose: 'Monthly subscription — Sep 2026', amount: 2500, status: 'Unpaid' as DueStatus },
  { id: 2, date: '01 Aug 2026', purpose: 'Monthly subscription — Aug 2026', amount: 2500, status: 'Overdue' as DueStatus },
  { id: 3, date: '01 Jul 2026', purpose: 'Monthly subscription — Jul 2026', amount: 2500, status: 'Paid' as DueStatus },
  { id: 4, date: '01 Jun 2026', purpose: 'Monthly subscription — Jun 2026', amount: 2500, status: 'Paid' as DueStatus },
  { id: 5, date: '01 May 2026', purpose: 'Monthly subscription — May 2026', amount: 2500, status: 'Paid' as DueStatus },
]
const INV_COLS = ['#', 'Date', 'Purpose', 'Due amount', 'Status', 'Action']
const INV_GRID = '44px 120px 1fr 140px 120px 120px'

type InvoiceModalData = { id: number; date: string; purpose: string; amount: number; status: DueStatus }

function InvoiceModal({ inv, member, onClose }: { inv: InvoiceModalData; member: Member; onClose: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(14,17,22,0.60)', backdropFilter: 'blur(8px)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={onClose}>
      <div style={{ background: T.surface0, borderRadius: 20, width: '100%', maxWidth: 560, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 24px 64px rgba(14,17,22,0.20)' }} onClick={(e) => e.stopPropagation()}>
        {/* Invoice header */}
        <div style={{ padding: '28px 32px', borderBottom: `1px solid ${T.ink100}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <img src={logoImg} alt="Chittagong Khulshi Club Ltd." style={{ height: 28, width: 'auto', objectFit: 'contain', marginBottom: 10 }}/>
            <div style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 18, color: T.ink900 }}>Tax Invoice</div>
            <div style={{ fontFamily: 'CKCL', fontSize: 12, color: T.ink400, marginTop: 2 }}>INV-2026-00{inv.id}</div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.ink100}`, background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.ink400 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Member + dates */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ fontFamily: 'CKCL', fontSize: 11, fontWeight: 600, color: T.ink400, marginBottom: 6, letterSpacing: '0.06em' }}>BILLED TO</div>
              <div style={{ fontFamily: 'CKCL', fontSize: 14, fontWeight: 600, color: T.ink900 }}>{member.name}</div>
              <div style={{ fontFamily: 'CKCL', fontSize: 12, color: T.ink400, marginTop: 2 }}>{member.memberNo}</div>
            </div>
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'CKCL', fontSize: 12, color: T.ink400 }}>Issue date</span>
                  <span style={{ fontFamily: 'CKCL', fontSize: 12, color: T.ink700 }}>{inv.date}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'CKCL', fontSize: 12, color: T.ink400 }}>Due date</span>
                  <span style={{ fontFamily: 'CKCL', fontSize: 12, color: T.brand }}>15 {inv.date.split(' ').slice(1).join(' ')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'CKCL', fontSize: 12, color: T.ink400 }}>Status</span>
                  <TableStatusChip status={inv.status}/>
                </div>
              </div>
            </div>
          </div>

          {/* Line items */}
          <div style={{ border: `1px solid ${T.ink100}`, borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', height: 40, background: T.surface50, borderBottom: `1px solid ${T.ink100}` }}>
              <ColHead label="Description"/>
              <ColHead label="Amount" right/>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', height: 52, alignItems: 'center', borderBottom: `1px solid ${T.ink100}` }}>
              <div style={{ padding: '0 16px', fontFamily: 'CKCL', fontSize: 13, color: T.ink900 }}>{inv.purpose}</div>
              <div style={{ padding: '0 16px', fontFamily: 'CKCL', fontSize: 13, textAlign: 'right', color: T.ink900 }}>{fmt(inv.amount)}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', height: 48, background: T.surface50, borderTop: `2px solid ${T.ink900}`, alignItems: 'center' }}>
              <div style={{ padding: '0 16px', fontFamily: 'CKCL', fontSize: 13, fontWeight: 700, color: T.ink900 }}>Total due</div>
              <div style={{ padding: '0 16px', fontFamily: 'CKCL', fontSize: 14, fontWeight: 700, textAlign: 'right', color: T.ink900 }}>{fmt(inv.amount)}</div>
            </div>
          </div>

          {/* Payment instructions */}
          <div style={{ background: T.surface50, borderRadius: 10, padding: '14px 16px' }}>
            <div style={{ fontFamily: 'CKCL', fontSize: 12, fontWeight: 600, color: T.ink700, marginBottom: 4 }}>Payment instructions</div>
            <div style={{ fontFamily: 'CKCL', fontSize: 12, color: T.ink400, lineHeight: 1.6 }}>Pay online using the Pay button below, or transfer to one of the club's bank accounts listed on the Bank accounts page. Quote your membership number as the reference.</div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button style={{ flex: 1, height: 44, borderRadius: 10, border: `1.5px solid ${T.ink100}`, background: T.surface0, fontFamily: 'CKCL', fontSize: 14, fontWeight: 600, color: T.ink700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download PDF
            </button>
            {inv.status !== 'Paid' && (
              <button style={{ flex: 1, height: 44, borderRadius: 10, border: 'none', background: T.brand, fontFamily: 'CKCL', fontSize: 14, fontWeight: 700, color: '#FFF', cursor: 'pointer', transition: 'background 160ms' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = T.brand700 }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = T.brand }}
              >
                Pay {fmt(inv.amount)}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Invoices({ member }: { member: Member }) {
  const [modalInv, setModalInv] = useState<InvoiceModalData | null>(null)
  const [tableState, setTableState] = useState<'populated' | 'loading' | 'error'>('populated')

  return (
    <>
      <div className="portal-table-scroll" style={{ background: T.surface0, borderRadius: 14, border: `1px solid ${T.ink100}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(14,17,22,0.04)' }}>
        <div className="portal-table-inner">
        {/* Card header */}
        <div style={{ height: 64, padding: '0 20px', borderBottom: `1px solid ${T.ink100}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 17, color: T.ink900 }}>Invoices</span>
          <IconBtn title="Download PDF"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></IconBtn>
        </div>

        {/* Col headers */}
        <div style={{ display: 'grid', gridTemplateColumns: INV_GRID, height: 48, background: T.surface50, borderBottom: `1px solid ${T.ink100}` }}>
          {INV_COLS.map((c, i) => <ColHead key={c} label={c} right={i === 3}/>)}
        </div>

        {tableState === 'loading' && <TableSkeleton cols={INV_GRID}/>}
        {tableState === 'error' && <TableError onRetry={() => setTableState('populated')}/>}
        {tableState === 'populated' && INVOICE_DATA.length === 0
          ? <TableEmpty
              icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>}
              heading="No invoices yet"
              body="Invoices appear here once the club office raises a charge on your account."
            />
          : tableState === 'populated' && INVOICE_DATA.map((inv, i) => (
              <div key={inv.id} style={{ display: 'grid', gridTemplateColumns: INV_GRID, height: 56, borderBottom: i < INVOICE_DATA.length - 1 ? `1px solid ${T.ink100}` : 'none', alignItems: 'center', transition: 'background 120ms' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = T.surface50 }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                <div style={{ padding: '0 16px', fontFamily: 'CKCL', fontSize: 12, color: T.ink200 }}>{inv.id}</div>
                <div style={{ padding: '0 16px', fontFamily: 'CKCL', fontSize: 12, color: T.ink600 }}>{inv.date}</div>
                <div style={{ padding: '0 16px', fontFamily: 'CKCL', fontSize: 13, color: T.ink900, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inv.purpose}</div>
                <div style={{ padding: '0 16px', fontFamily: 'CKCL', fontSize: 13, textAlign: 'right', fontWeight: 600, color: T.ink900 }}>{fmt(inv.amount)}</div>
                <div style={{ padding: '0 16px' }}><TableStatusChip status={inv.status}/></div>
                <div style={{ padding: '0 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <IconBtn title="View invoice" onClick={() => setModalInv(inv)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </IconBtn>
                  {inv.status !== 'Paid' && (
                    <button onClick={() => setModalInv(inv)} style={{ height: 32, padding: '0 12px', borderRadius: 8, border: 'none', background: T.brand, fontFamily: 'CKCL', fontSize: 12, fontWeight: 700, color: '#FFF', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'background 160ms' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = T.brand700 }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = T.brand }}
                    >
                      Pay
                    </button>
                  )}
                </div>
              </div>
            ))
        }
        </div>{/* /portal-table-inner */}
      </div>

      {modalInv && <InvoiceModal inv={modalInv} member={member} onClose={() => setModalInv(null)}/>}
    </>
  )
}

// ─── J. Bank Accounts ─────────────────────────────────────────────────────────
const BANKS = [
  { name: 'Exim Bank Limited', branch: 'Khulshi Branch', acctNo: '0012300045671234', routingNo: '095261234', logo: 'https://placehold.co/96x32/f7f8fa/5c6673?text=Exim+Bank' },
  { name: 'One Bank Limited', branch: 'CDA Avenue Branch', acctNo: '0034100023459876', routingNo: '195150987', logo: 'https://placehold.co/96x32/f7f8fa/5c6673?text=One+Bank' },
  { name: 'BRAC Bank Limited', branch: 'CDA Avenue Branch', acctNo: '1506202011223344', routingNo: '060261122', logo: 'https://placehold.co/96x32/f7f8fa/5c6673?text=BRAC+Bank' },
  { name: 'Eastern Bank Limited', branch: 'Jamal Khan', acctNo: '1081000056783210', routingNo: '085261007', logo: 'https://placehold.co/96x32/f7f8fa/5c6673?text=Eastern+Bank' },
  { name: 'Prime Bank Limited', branch: 'Jubilee Road Branch', acctNo: '2131100044557788', routingNo: '235261445', logo: 'https://placehold.co/96x32/f7f8fa/5c6673?text=Prime+Bank' },
]

function BankAccounts() {
  const [copied, setCopied] = useState<string | null>(null)

  const copy = (val: string, key: string) => {
    navigator.clipboard.writeText(val).catch(() => {})
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Subtitle */}
      <p style={{ fontFamily: 'CKCL', fontSize: 14, color: T.ink400, margin: 0, lineHeight: 1.6 }}>
        Transfer dues to any of these club accounts, then upload your deposit slip through Change request.
      </p>

      {/* Account name note */}
      <div style={{ background: T.surface100, borderRadius: 10, padding: '10px 16px', fontFamily: 'CKCL', fontSize: 13, color: T.ink600 }}>
        Account name for all transfers: <span style={{ fontWeight: 700, color: T.ink900 }}>Chittagong Khulshi Club Limited</span>
      </div>

      {/* Card grid */}
      <div id="bank-accounts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px,100%), 1fr))', gap: 16 }}>
        {BANKS.map((bank) => (
          <div key={bank.name} style={{ background: T.surface0, borderRadius: 14, border: `1px solid ${T.ink100}`, padding: 24, display: 'flex', flexDirection: 'column', gap: 16, boxShadow: '0 1px 4px rgba(14,17,22,0.04)' }}>
            {/* Logo + name */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{ width: 96, height: 32, flexShrink: 0 }}>
                <img src={bank.logo} alt={bank.name} style={{ width: 96, height: 32, objectFit: 'contain', objectPosition: 'left center', borderRadius: 4 }}/>
              </div>
            </div>
            <div>
              <div style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 16, color: T.ink900 }}>{bank.name}</div>
              <div style={{ fontFamily: 'CKCL', fontSize: 12, color: T.ink400, marginTop: 2 }}>{bank.branch}</div>
            </div>

            {/* Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, borderTop: `1px solid ${T.ink100}`, paddingTop: 14 }}>
              {[
                { label: 'Account no.', value: bank.acctNo, key: `acct-${bank.name}` },
                { label: 'Routing no.', value: bank.routingNo, key: `route-${bank.name}` },
              ].map(({ label, value, key }) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <div>
                    <div style={{ fontFamily: 'CKCL', fontSize: 11, fontWeight: 600, color: T.ink400, letterSpacing: '0.04em', marginBottom: 2 }}>{label.toUpperCase()}</div>
                    <div style={{ fontFamily: 'CKCL', fontSize: 14, fontWeight: 600, color: T.ink900 }}>{value}</div>
                  </div>
                  <button
                    onClick={() => copy(value, key)}
                    title={copied === key ? 'Copied!' : 'Copy'}
                    style={{ flexShrink: 0, width: 32, height: 32, borderRadius: 8, border: `1px solid ${copied === key ? T.green : T.ink100}`, background: copied === key ? T.greenDim : T.surface50, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: copied === key ? T.green : T.ink400, transition: 'all 160ms' }}
                  >
                    {copied === key
                      ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                    }
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Info callout */}
      <div style={{ background: T.brandDim, border: `1px solid rgba(225,11,23,0.15)`, borderLeft: `3px solid ${T.brand}`, borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.brand} strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span style={{ fontFamily: 'CKCL', fontSize: 13, color: T.brand700, fontWeight: 500 }}>Always include your membership number in the transfer reference.</span>
      </div>

      {/* Copied toast */}
      {copied && (
        <div className="portal-toast" style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: T.ink900, color: '#FFF', fontFamily: 'CKCL', fontSize: 13, fontWeight: 600, padding: '10px 20px', borderRadius: 999, zIndex: 200, pointerEvents: 'none', boxShadow: '0 8px 24px rgba(14,17,22,0.20)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          Copied to clipboard
        </div>
      )}
    </div>
  )
}

// ─── K. Personal Information ──────────────────────────────────────────────────
type FormStep = 1 | 2 | 3 | 4

const BLOOD_GROUPS = ['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−']
const PROFESSIONS = ['Business', 'Service', 'Doctor', 'Engineer', 'Lawyer', 'Retired', 'Other']

function FieldInput({
  label, value, onChange, type = 'text', placeholder, locked, sensitive, error, select, options,
}: {
  label: string; value: string; onChange?: (v: string) => void
  type?: string; placeholder?: string; locked?: boolean; sensitive?: boolean
  error?: string; select?: boolean; options?: string[]
}) {
  const [show, setShow] = useState(false)
  const [focused, setFocused] = useState(false)

  const masked = sensitive && !show && value.length > 4
    ? '•'.repeat(value.length - 4) + value.slice(-4)
    : value

  const border = error ? T.brand : focused ? T.ink600 : T.ink100
  const bg = locked ? T.surface100 : T.surface0
  const shadow = focused && !locked && !error ? '0 0 0 3px rgba(14,17,22,0.07)' : error ? '0 0 0 3px rgba(225,11,23,0.09)' : 'none'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontFamily: 'CKCL', fontSize: 12, fontWeight: 600, color: T.ink600 }}>{label}</label>
      <div style={{ position: 'relative' }}>
        {select
          ? <select
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              disabled={locked}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              style={{ width: '100%', height: 44, padding: '0 36px 0 12px', appearance: 'none', fontFamily: 'CKCL', fontSize: 14, color: value ? T.ink900 : T.ink200, background: bg, border: `1.5px solid ${border}`, borderRadius: 9, outline: 'none', cursor: locked ? 'not-allowed' : 'pointer', boxShadow: shadow, transition: 'border-color 140ms, box-shadow 140ms', boxSizing: 'border-box' as const }}
            >
              <option value="">{placeholder || 'Select…'}</option>
              {options?.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          : <input
              type={sensitive && !show ? 'password' : type}
              value={masked}
              readOnly={locked || sensitive}
              placeholder={placeholder}
              onChange={(e) => !locked && onChange?.(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              style={{ width: '100%', height: 44, padding: `0 ${(locked || sensitive) ? '44px' : '12px'} 0 12px`, fontFamily: 'CKCL', fontSize: 14, color: T.ink900, background: bg, border: `1.5px solid ${border}`, borderRadius: 9, outline: 'none', cursor: locked ? 'not-allowed' : 'text', boxShadow: shadow, transition: 'border-color 140ms, box-shadow 140ms', boxSizing: 'border-box' as const }}
            />
        }
        {locked && (
          <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: T.ink200 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          </div>
        )}
        {sensitive && !locked && (
          <button type="button" onClick={() => setShow((v) => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: T.ink200, display: 'flex' }}>
            {show
              ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22"/></svg>
              : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            }
          </button>
        )}
      </div>
      {locked && <div style={{ fontFamily: 'CKCL', fontSize: 11, color: T.ink200, fontStyle: 'italic' }}>Contact the club office to change this.</div>}
      {sensitive && !locked && <div style={{ fontFamily: 'CKCL', fontSize: 11, color: T.ink400 }}>Visible only to you and the club office.</div>}
      {error && <div style={{ fontFamily: 'CKCL', fontSize: 11, color: T.brand }}>{error}</div>}
    </div>
  )
}

function StepIndicator({ step, setStep }: { step: FormStep; setStep: (s: FormStep) => void }) {
  const steps = [
    { id: 1, label: 'Personal' },
    { id: 2, label: 'Contact' },
    { id: 3, label: 'Identity' },
    { id: 4, label: 'Other' },
  ]
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '0 4px' }}>
      {steps.map((s, i) => (
        <React.Fragment key={s.id}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: s.id < step ? 'pointer' : 'default' }} onClick={() => { if (s.id < step) setStep(s.id as FormStep) }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: s.id < step ? T.brand : 'transparent', border: `2px solid ${s.id <= step ? T.brand : T.ink100}`, transition: 'all 200ms', flexShrink: 0 }}>
              {s.id < step
                ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                : <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.id === step ? T.brand : T.ink100, transition: 'all 200ms' }}/>
              }
            </div>
            <span style={{ fontFamily: 'CKCL', fontSize: 11, fontWeight: 600, color: s.id <= step ? T.brand : T.ink200, whiteSpace: 'nowrap', transition: 'color 200ms' }}>{s.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div style={{ flex: 1, height: 2, background: s.id < step ? T.brand : T.ink100, marginBottom: 18, transition: 'background 200ms' }}/>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

function PersonalInfo({ member }: { member: Member }) {
  const [step, setStep] = useState<FormStep>(1)
  const [saved, setSaved] = useState(false)
  const [marital, setMarital] = useState('Single')
  const [form, setForm] = useState({
    surname: 'Islam', givenName: 'Rafiqul', fatherName: 'Md. Idris Islam',
    motherName: 'Begum Fatema', anniversary: '', spouseName: '',
    profession: 'Business', dob: '1975-08-15', place: 'Chattogram',
    cell: member.phone, tel: '', email: member.email,
    nationality: 'Bangladeshi', nid: '1234567890123',
    passport: 'BK1234567', bloodGroup: 'B+', education: 'MBA',
    institution: 'University of Chittagong', eTin: '1234567890',
  })
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }))

  const saveDraft = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, background: T.surface0, borderRadius: 14, border: `1px solid ${T.ink100}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(14,17,22,0.04)' }}>
      <div style={{ padding: '20px 24px', borderBottom: `1px solid ${T.ink100}` }}>
        <StepIndicator step={step} setStep={setStep}/>
      </div>

      <div style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {step === 1 && (
          <>
            <div id="personal-info-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px,100%), 1fr))', gap: 16 }}>
              <FieldInput label="Given name" value={form.givenName} locked/>
              <FieldInput label="Surname" value={form.surname} locked/>
              <FieldInput label="Father's name" value={form.fatherName} onChange={set('fatherName')}/>
              <FieldInput label="Mother's name" value={form.motherName} onChange={set('motherName')}/>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ fontFamily: 'CKCL', fontSize: 12, fontWeight: 600, color: T.ink600 }}>Marital status</label>
                <div style={{ display: 'flex', gap: 20, height: 44, alignItems: 'center', padding: '0 12px', background: T.surface0, border: `1.5px solid ${T.ink100}`, borderRadius: 9 }}>
                  {['Single', 'Married'].map((o) => (
                    <label key={o} style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontFamily: 'CKCL', fontSize: 14, color: T.ink900 }}>
                      <input type="radio" name="marital" value={o} checked={marital === o} onChange={() => setMarital(o)} style={{ accentColor: T.brand }}/>
                      {o}
                    </label>
                  ))}
                </div>
              </div>
              {marital === 'Married' && <FieldInput label="Anniversary" value={form.anniversary} onChange={set('anniversary')} type="date"/>}
              {marital === 'Married' && <FieldInput label="Spouse name" value={form.spouseName} onChange={set('spouseName')}/>}
              <FieldInput label="Profession" value={form.profession} onChange={set('profession')} select options={PROFESSIONS}/>
              <FieldInput label="Date of birth" value={form.dob} onChange={set('dob')} type="date"/>
              <FieldInput label="Place" value={form.place} onChange={set('place')}/>
              <FieldInput label="Cell no." value={form.cell} locked/>
              <FieldInput label="Tel." value={form.tel} onChange={set('tel')}/>
              <FieldInput label="E-mail" value={form.email} locked type="email"/>
              <FieldInput label="Nationality" value={form.nationality} onChange={set('nationality')}/>
              <FieldInput label="National ID no." value={form.nid} onChange={set('nid')} sensitive error={form.nid && !/^\d{10}$|^\d{13}$|^\d{17}$/.test(form.nid) ? 'Enter a valid 10, 13 or 17-digit NID number' : undefined}/>
              <FieldInput label="Passport no." value={form.passport} onChange={set('passport')} sensitive/>
              <FieldInput label="Blood group" value={form.bloodGroup} onChange={set('bloodGroup')} select options={BLOOD_GROUPS}/>
              <FieldInput label="Educational qualifications" value={form.education} onChange={set('education')}/>
              <FieldInput label="Institution name" value={form.institution} onChange={set('institution')}/>
              <FieldInput label="e-TIN no." value={form.eTin} onChange={set('eTin')} sensitive/>
            </div>
          </>
        )}
        {step !== 1 && (
          <div style={{ padding: '40px 0', textAlign: 'center' }}>
            <div style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 18, color: T.ink900, marginBottom: 6 }}>Step {step} content</div>
            <div style={{ fontFamily: 'CKCL', fontSize: 14, color: T.ink400 }}>Fields for this step will be configured by the club office.</div>
          </div>
        )}
      </div>

      {/* Sticky footer */}
      <div style={{ padding: '14px 24px', borderTop: `1px solid ${T.ink100}`, background: T.surface0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <button onClick={saveDraft} style={{ height: 40, padding: '0 18px', borderRadius: 9, border: `1.5px solid ${T.ink100}`, background: 'transparent', fontFamily: 'CKCL', fontSize: 13, fontWeight: 600, color: T.ink600, cursor: 'pointer' }}>
          {saved ? '✓ Draft saved' : 'Save as draft'}
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          {step > 1 && (
            <button onClick={() => setStep((s) => (s - 1) as FormStep)} style={{ height: 40, padding: '0 18px', borderRadius: 9, border: `1.5px solid ${T.ink100}`, background: 'transparent', fontFamily: 'CKCL', fontSize: 13, fontWeight: 600, color: T.ink700, cursor: 'pointer' }}>Back</button>
          )}
          <button onClick={() => { if (step < 4) setStep((s) => (s + 1) as FormStep) }} style={{ height: 40, padding: '0 22px', borderRadius: 9, border: 'none', background: T.brand, fontFamily: 'CKCL', fontSize: 13, fontWeight: 700, color: '#FFF', cursor: 'pointer' }}>
            {step === 4 ? 'Submit changes' : 'Next'}
          </button>
        </div>
      </div>
      {saved && (
        <div className="portal-toast" style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: T.ink900, color: '#FFF', fontFamily: 'CKCL', fontSize: 13, fontWeight: 600, padding: '10px 20px', borderRadius: 999, zIndex: 200, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 24px rgba(14,17,22,0.20)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          Draft saved
        </div>
      )}
      <div style={{ padding: '8px 24px 12px', borderTop: `1px solid ${T.ink100}` }}>
        <span style={{ fontFamily: 'CKCL', fontSize: 11, color: T.ink200 }}>Changes are reviewed by the club office before they take effect.</span>
      </div>
    </div>
  )
}

// ─── L. Online Helpdesk ───────────────────────────────────────────────────────
type TicketStatus = 'Open' | 'Answered' | 'Closed'
const TICKETS = [
  { id: 'TKT-0041', subject: 'Due payment not reflecting after transfer', topic: 'Payments & dues', excerpt: "I transferred ৳2,500 on 5 Aug via BRAC Bank but my dashboard still shows it as unpaid. Please verify.", date: '06 Aug 2026', status: 'Open' as TicketStatus, replies: [{ from: 'club', text: 'Thank you for reaching out. We have received your query and will verify the transfer within 1–2 business days.', date: '07 Aug 2026' }] },
  { id: 'TKT-0039', subject: 'Request for guest house booking', topic: 'Guest house', excerpt: "I would like to book the guest house for the weekend of 15–17 Aug for 2 guests.", date: '01 Aug 2026', status: 'Answered' as TicketStatus, replies: [{ from: 'club', text: 'The guest house is available for your requested dates. Please proceed to the facility booking form to confirm.', date: '02 Aug 2026' }] },
  { id: 'TKT-0036', subject: 'Membership card not received', topic: 'Membership', excerpt: "It has been 3 months since my card was due for renewal but I have not received a replacement.", date: '10 Jul 2026', status: 'Closed' as TicketStatus, replies: [] },
]
const TOPICS = ['Membership', 'Payments & dues', 'Facility booking', 'Guest house', 'Complaint', 'Other']

function Helpdesk() {
  const site = useSiteInfo()
  const [thread, setThread] = useState<typeof TICKETS[0] | null>(null)
  const [topic, setTopic] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const statusCfg: Record<TicketStatus, { bg: string; color: string }> = {
    Open: { bg: T.amberDim, color: T.amber },
    Answered: { bg: T.surface100, color: T.ink600 },
    Closed: { bg: T.greenDim, color: T.green },
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic || !subject || !message) return
    setSent(true)
    setTopic(''); setSubject(''); setMessage('')
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <>
      {/* Urgent callout */}
      <div style={{ background: T.surface100, borderRadius: 10, padding: '10px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.ink400} strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.1 1.18 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.45-.45a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92"/></svg>
        <span style={{ fontFamily: 'CKCL', fontSize: 13, color: T.ink600 }}>For urgent matters call <strong>{site.contact.phone}</strong>{site.office.hours ? `, ${site.office.hours}` : ''}.</span>
      </div>

      <div id="helpdesk-grid" style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: 20, alignItems: 'start' }}>
        {/* Left: ticket list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, background: T.surface0, borderRadius: 14, border: `1px solid ${T.ink100}`, overflow: 'hidden' }}>
          <div style={{ height: 56, padding: '0 20px', borderBottom: `1px solid ${T.ink100}`, display: 'flex', alignItems: 'center' }}>
            <span style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 16, color: T.ink900 }}>My requests</span>
          </div>

          {TICKETS.length === 0
            ? <TableEmpty
                icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>}
                heading="No requests yet"
                body="You haven't raised any requests. Use the form to get in touch with the club office."
              />
            : TICKETS.map((t, i) => (
                <div
                  key={t.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setThread(t)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setThread(t) }}
                  style={{ padding: '16px 20px', borderBottom: i < TICKETS.length - 1 ? `1px solid ${T.ink100}` : 'none', background: 'transparent', cursor: 'pointer', transition: 'background 120ms', userSelect: 'none' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = T.surface50 }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontFamily: 'CKCL', fontSize: 11, color: T.ink200 }}>{t.id}</span>
                      <span onClick={(e) => e.stopPropagation()}><CopyBtn value={t.id} id={`tkt-${t.id}`} size={20}/></span>
                      <span style={{ fontFamily: 'CKCL', fontSize: 11, fontWeight: 600, color: T.ink400, background: T.surface100, borderRadius: 999, padding: '2px 8px' }}>{t.topic}</span>
                    </div>
                    <span style={{ fontFamily: 'CKCL', fontSize: 11, fontWeight: 700, color: statusCfg[t.status].color, background: statusCfg[t.status].bg, borderRadius: 999, padding: '3px 8px', flexShrink: 0 }}>{t.status}</span>
                  </div>
                  <div style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 14, color: T.ink900, marginBottom: 4 }}>{t.subject}</div>
                  <div style={{ fontFamily: 'CKCL', fontSize: 12, color: T.ink400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.excerpt}</div>
                  <div style={{ fontFamily: 'CKCL', fontSize: 11, color: T.ink200, marginTop: 6 }}>{t.date}</div>
                </div>
              ))
          }
        </div>

        {/* Right: new request */}
        <div style={{ background: T.surface0, borderRadius: 14, border: `1px solid ${T.ink100}`, overflow: 'hidden', position: 'sticky', top: 80 }}>
          <div style={{ height: 56, padding: '0 20px', borderBottom: `1px solid ${T.ink100}`, display: 'flex', alignItems: 'center' }}>
            <span style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 16, color: T.ink900 }}>New request</span>
          </div>
          {sent
            ? <div style={{ padding: '40px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: T.greenDim, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.green }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 16, color: T.ink900 }}>Request sent!</div>
                <div style={{ fontFamily: 'CKCL', fontSize: 13, color: T.ink400 }}>The club office will respond within 2 business days.</div>
              </div>
            : <form onSubmit={handleSend} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label style={{ fontFamily: 'CKCL', fontSize: 12, fontWeight: 600, color: T.ink600 }}>Topic <span style={{ color: T.brand }}>*</span></label>
                  <select value={topic} onChange={(e) => setTopic(e.target.value)} required style={{ height: 44, padding: '0 12px', appearance: 'none', fontFamily: 'CKCL', fontSize: 14, color: topic ? T.ink900 : T.ink200, background: T.surface0, border: `1.5px solid ${T.ink100}`, borderRadius: 9, outline: 'none', cursor: 'pointer' }}>
                    <option value="">Select topic…</option>
                    {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label style={{ fontFamily: 'CKCL', fontSize: 12, fontWeight: 600, color: T.ink600 }}>Subject</label>
                  <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Brief subject…" style={{ height: 44, padding: '0 12px', fontFamily: 'CKCL', fontSize: 14, color: T.ink900, background: T.surface0, border: `1.5px solid ${T.ink100}`, borderRadius: 9, outline: 'none' }}/>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label style={{ fontFamily: 'CKCL', fontSize: 12, fontWeight: 600, color: T.ink600 }}>Message</label>
                    <span style={{ fontFamily: 'CKCL', fontSize: 11, color: T.ink200 }}>{message.length}/1000</span>
                  </div>
                  <textarea value={message} onChange={(e) => setMessage(e.target.value.slice(0, 1000))} placeholder="Describe your request in detail…" rows={6} style={{ padding: '10px 12px', fontFamily: 'CKCL', fontSize: 14, color: T.ink900, background: T.surface0, border: `1.5px solid ${T.ink100}`, borderRadius: 9, outline: 'none', resize: 'vertical', lineHeight: 1.6 }}/>
                </div>
                <div style={{ border: `1.5px dashed ${T.ink100}`, borderRadius: 9, padding: '14px 12px', textAlign: 'center', cursor: 'pointer' }}>
                  <div style={{ fontFamily: 'CKCL', fontSize: 13, color: T.ink400 }}>Drop attachment here or <span style={{ color: T.brand, fontWeight: 600 }}>browse</span></div>
                </div>
                <button type="submit" style={{ height: 44, borderRadius: 9, border: 'none', background: T.brand, fontFamily: 'CKCL', fontSize: 14, fontWeight: 700, color: '#FFF', cursor: 'pointer', transition: 'background 160ms' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = T.brand700 }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = T.brand }}
                >
                  Send request
                </button>
              </form>
          }
        </div>
      </div>

      {/* Thread modal */}
      {thread && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(14,17,22,0.60)', backdropFilter: 'blur(8px)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setThread(null)}>
          <div style={{ background: T.surface0, borderRadius: 20, width: '100%', maxWidth: 600, maxHeight: '85vh', overflow: 'auto', boxShadow: '0 24px 64px rgba(14,17,22,0.20)' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${T.ink100}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontFamily: 'CKCL', fontSize: 12, color: T.ink200 }}>{thread.id}</span>
                  <span style={{ fontFamily: 'CKCL', fontSize: 11, fontWeight: 700, color: statusCfg[thread.status].color, background: statusCfg[thread.status].bg, borderRadius: 999, padding: '2px 8px' }}>{thread.status}</span>
                </div>
                <div style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 16, color: T.ink900 }}>{thread.subject}</div>
              </div>
              <button onClick={() => setThread(null)} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.ink100}`, background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.ink400, flexShrink: 0 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Original message */}
              <div style={{ background: T.surface100, borderRadius: 10, padding: '14px 16px' }}>
                <div style={{ fontFamily: 'CKCL', fontSize: 11, color: T.ink400, marginBottom: 6 }}>Your message · {thread.date}</div>
                <div style={{ fontFamily: 'CKCL', fontSize: 13, color: T.ink900, lineHeight: 1.7 }}>{thread.excerpt}</div>
              </div>
              {thread.replies.map((r, i) => (
                <div key={i} style={{ background: T.brandDim, borderRadius: 10, padding: '14px 16px' }}>
                  <div style={{ fontFamily: 'CKCL', fontSize: 11, color: T.brand, marginBottom: 6, fontWeight: 600 }}>Club office · {r.date}</div>
                  <div style={{ fontFamily: 'CKCL', fontSize: 13, color: T.ink900, lineHeight: 1.7 }}>{r.text}</div>
                </div>
              ))}
              {thread.status !== 'Closed' && (
                <div style={{ marginTop: 4 }}>
                  <textarea placeholder="Reply…" rows={3} style={{ width: '100%', padding: '10px 12px', fontFamily: 'CKCL', fontSize: 13, color: T.ink900, border: `1.5px solid ${T.ink100}`, borderRadius: 9, outline: 'none', resize: 'none', boxSizing: 'border-box' as const }}/>
                  <button style={{ marginTop: 8, height: 40, padding: '0 20px', borderRadius: 9, border: 'none', background: T.brand, fontFamily: 'CKCL', fontSize: 13, fontWeight: 700, color: '#FFF', cursor: 'pointer' }}>Send reply</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ─── M. Change Password ───────────────────────────────────────────────────────
function ChangePassword() {
  const [current, setCurrent] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirm, setConfirm] = useState('')
  const [show, setShow] = useState({ current: false, new: false, confirm: false })
  const [done, setDone] = useState(false)

  const reqs = [
    { label: 'At least 8 characters', met: newPw.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(newPw) },
    { label: 'One number', met: /\d/.test(newPw) },
    { label: 'One symbol', met: /[^A-Za-z0-9]/.test(newPw) },
  ]
  const strength = reqs.filter((r) => r.met).length
  const mismatch = confirm.length > 0 && newPw !== confirm
  const strengthColors = ['#E2E6EC', '#E10B17', '#D97706', '#16A34A', '#16A34A']

  if (done) {
    return (
      <div style={{ maxWidth: 560, margin: '0 auto', background: T.surface0, borderRadius: 16, border: `1px solid ${T.ink100}`, padding: '48px 40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: T.greenDim, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.green }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 22, color: T.ink900 }}>Password updated</div>
        <div style={{ fontFamily: 'CKCL', fontSize: 14, color: T.ink400 }}>{"You'll stay signed in on this device."}</div>
        <button onClick={() => setDone(false)} style={{ marginTop: 8, height: 40, padding: '0 24px', borderRadius: 9, border: `1.5px solid ${T.ink100}`, background: 'transparent', fontFamily: 'CKCL', fontSize: 13, fontWeight: 600, color: T.ink600, cursor: 'pointer' }}>
          Change again
        </button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', background: T.surface0, borderRadius: 16, border: `1px solid ${T.ink100}`, padding: '32px 40px', display: 'flex', flexDirection: 'column', gap: 22, boxShadow: '0 1px 4px rgba(14,17,22,0.04)' }}>
      {/* Current password */}
      {[
        { label: 'Current password', val: current, set: setCurrent, key: 'current' as const },
        { label: 'New password', val: newPw, set: setNewPw, key: 'new' as const },
        { label: 'Confirm new password', val: confirm, set: setConfirm, key: 'confirm' as const },
      ].map(({ label, val, set, key }) => (
        <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontFamily: 'CKCL', fontSize: 13, fontWeight: 600, color: T.ink700 }}>{label}</label>
          <div style={{ position: 'relative' }}>
            <input
              type={show[key] ? 'text' : 'password'}
              value={val}
              onChange={(e) => set(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', height: 48, padding: '0 46px 0 14px', fontFamily: 'CKCL', fontSize: 15, color: T.ink900, background: T.surface0, border: `1.5px solid ${key === 'confirm' && mismatch ? T.brand : T.ink100}`, borderRadius: 10, outline: 'none', boxSizing: 'border-box' as const }}
            />
            <button type="button" onClick={() => setShow((s) => ({ ...s, [key]: !s[key] }))} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: T.ink200, display: 'flex' }}>
              {show[key]
                ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22"/></svg>
                : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              }
            </button>
          </div>
          {key === 'confirm' && mismatch && (
            <div style={{ fontFamily: 'CKCL', fontSize: 12, color: T.brand }}>Passwords do not match.</div>
          )}
        </div>
      ))}

      {/* Strength meter */}
      {newPw.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{ flex: 1, height: 4, borderRadius: 999, background: i < strength ? strengthColors[strength] : T.surface100, transition: 'background 200ms' }}/>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {reqs.map((r) => (
              <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                {r.met
                  ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.green} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  : <div style={{ width: 6, height: 6, borderRadius: '50%', background: T.ink100, marginLeft: 3 }}/>
                }
                <span style={{ fontFamily: 'CKCL', fontSize: 12, color: r.met ? T.green : T.ink200, transition: 'color 200ms' }}>{r.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
        <button style={{ flex: 1, height: 46, borderRadius: 10, border: `1.5px solid ${T.ink100}`, background: 'transparent', fontFamily: 'CKCL', fontSize: 14, fontWeight: 600, color: T.ink600, cursor: 'pointer' }}>Cancel</button>
        <button
          onClick={() => { if (current && strength === 4 && newPw === confirm) setDone(true) }}
          disabled={!current || strength < 4 || newPw !== confirm}
          style={{ flex: 2, height: 46, borderRadius: 10, border: 'none', background: (!current || strength < 4 || newPw !== confirm) ? T.surface100 : T.brand, fontFamily: 'CKCL', fontSize: 14, fontWeight: 700, color: (!current || strength < 4 || newPw !== confirm) ? T.ink200 : '#FFF', cursor: (!current || strength < 4 || newPw !== confirm) ? 'not-allowed' : 'pointer', transition: 'all 160ms' }}
        >
          Update password
        </button>
      </div>
    </div>
  )
}

const HEADER_H = 72

// ─── PAGE_META ────────────────────────────────────────────────────────────────
const PAGE_META: Record<PortalPage, { title: string; breadcrumb: string[] }> = {
  dashboard: { title: 'My dashboard', breadcrumb: ['Home', 'My account', 'Dashboard'] },
  'membership-card': { title: 'Membership card', breadcrumb: ['Home', 'My account', 'Membership card'] },
  'personal-info': { title: 'Personal information', breadcrumb: ['Home', 'My account', 'Personal information'] },
  'account-statement': { title: 'Account statement', breadcrumb: ['Home', 'My account', 'Payments', 'Account statement'] },
  'payment-history': { title: 'Payment history', breadcrumb: ['Home', 'My account', 'Payments', 'Payment history'] },
  invoices: { title: 'Invoices', breadcrumb: ['Home', 'My account', 'Payments', 'Invoices'] },
  'bank-accounts': { title: 'Bank accounts', breadcrumb: ['Home', 'My account', 'Bank accounts'] },
  'change-request': { title: 'Change request', breadcrumb: ['Home', 'My account', 'Change request'] },
  helpdesk: { title: 'Online helpdesk', breadcrumb: ['Home', 'My account', 'Online helpdesk'] },
  'change-password': { title: 'Change password', breadcrumb: ['Home', 'My account', 'Change password'] },
  services: { title: 'Services', breadcrumb: ['Home', 'My account', 'Services'] },
}

// ─── Mobile bottom tab bar (below 1024px, where the sidebar is hidden) ────────
const PAYMENT_PAGES: PortalPage[] = ['account-statement', 'payment-history', 'invoices']
const TAB_BAR_H = 68

type TabId = 'dashboard' | 'payments' | 'helpdesk' | 'services'

// Outline when idle, solid when active — as in native tab bars
const TAB_ICONS: Record<TabId, (active: boolean) => React.ReactNode> = {
  dashboard: (a) => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill={a ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <path d="M3.5 10.2L12 3.5l8.5 6.7V19a1.5 1.5 0 01-1.5 1.5h-4.2v-5.8H9.2v5.8H5A1.5 1.5 0 013.5 19z"/>
    </svg>
  ),
  payments: (a) => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16.5 6.5V5a1.5 1.5 0 00-1.9-1.45L5 6.5"/>
      <rect x="2.5" y="6.5" width="19" height="14" rx="3" fill={a ? 'currentColor' : 'none'}/>
      <circle cx="17" cy="13.5" r="1.4" fill={a ? '#FFFFFF' : 'currentColor'} stroke="none"/>
    </svg>
  ),
  helpdesk: (a) => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <path d="M20.5 11.5a8 8 0 01-11.7 7.1L4 20l1.3-4.4A8 8 0 1120.5 11.5z" fill={a ? 'currentColor' : 'none'}/>
      {[8.5, 12.5, 16.5].map((x) => <circle key={x} cx={x - 0.2} cy="11.5" r="1.1" fill={a ? '#FFFFFF' : 'currentColor'} stroke="none"/>)}
    </svg>
  ),
  services: () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      {[5, 12, 19].flatMap((y) => [5, 12, 19].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6"/>))}
    </svg>
  ),
}

const TABS: { id: TabId; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'payments', label: 'Payments' },
  { id: 'helpdesk', label: 'Helpdesk' },
  { id: 'services', label: 'Services' },
]

function PortalTabBar({ activePage, onNavigate }: {
  activePage: PortalPage; onNavigate: (p: PortalPage) => void
}) {
  const current: TabId = activePage === 'dashboard' || activePage === 'membership-card' ? 'dashboard'
    : PAYMENT_PAGES.includes(activePage) ? 'payments'
    : activePage === 'helpdesk' ? 'helpdesk'
    : 'services'
  const idx = TABS.findIndex((t) => t.id === current)

  const select = (id: TabId) => {
    if (id === 'payments') { if (!PAYMENT_PAGES.includes(activePage)) onNavigate('account-statement') }
    else onNavigate(id)
  }

  return (
    <nav
      id="portal-tab-bar"
      aria-label="Member portal"
      style={{
        position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 60,
        paddingBottom: 'env(safe-area-inset-bottom)',
        background: 'linear-gradient(180deg, rgba(236,214,216,0.78) 0%, rgba(246,240,241,0.86) 100%)',
        backdropFilter: 'blur(24px) saturate(160%)',
        WebkitBackdropFilter: 'blur(24px) saturate(160%)',
        borderTop: '1px solid rgba(255,255,255,0.55)',
        boxShadow: '0 -6px 24px rgba(14,17,22,0.08)',
      }}
    >
      {/* Tron-style light trails racing along the top edge, in opposite directions */}
      <style>{`
        .tabbar-tron { position:absolute; left:0; right:0; top:-9px; height:18px; overflow:hidden; pointer-events:none; }
        .tabbar-tron::before, .tabbar-tron::after {
          content:''; position:absolute; top:8px; height:2px; width:38%; border-radius:2px;
          animation: tron-run 3.2s linear infinite;
        }
        .tabbar-tron::before {
          background: linear-gradient(90deg, transparent, rgba(225,11,23,0.7) 70%, #FF5A63 94%, #FFFFFF);
          filter: drop-shadow(0 0 3px #E10B17) drop-shadow(0 0 7px rgba(225,11,23,0.75));
        }
        .tabbar-tron::after {
          background: linear-gradient(270deg, transparent, rgba(185,139,67,0.7) 70%, #E8C584 94%, #FFFFFF);
          filter: drop-shadow(0 0 3px #B98B43) drop-shadow(0 0 7px rgba(232,197,132,0.75));
          animation-name: tron-run-back; animation-duration: 4.4s;
        }
        @keyframes tron-run { from { left:-38%; } to { left:100%; } }
        @keyframes tron-run-back { from { left:100%; } to { left:-38%; } }
        @media (prefers-reduced-motion: reduce) { .tabbar-tron { display:none; } }
      `}</style>
      <div aria-hidden className="tabbar-tron"/>

      <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: `repeat(${TABS.length}, 1fr)`, height: TAB_BAR_H, maxWidth: 640, margin: '0 auto' }}>
        {/* Active marker — slides along the top edge */}
        <div
          aria-hidden
          style={{
            position: 'absolute', top: 0, left: 0, width: `${100 / TABS.length}%`, height: 3,
            display: 'flex', justifyContent: 'center',
            transform: `translateX(${idx * 100}%)`,
            transition: 'transform 320ms cubic-bezier(0.34, 1.25, 0.64, 1)',
          }}
        >
          <span style={{ width: 44, height: 3, borderRadius: '0 0 3px 3px', background: T.brand }}/>
        </div>

        {TABS.map((tab) => {
          const active = tab.id === current
          return (
            <button
              key={tab.id}
              onClick={() => select(tab.id)}
              aria-current={active ? 'page' : undefined}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
                background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0 0',
                color: active ? T.brand : '#6B6F76',
                fontFamily: 'CKCL', fontSize: 12, fontWeight: active ? 600 : 500,
                transition: 'color 200ms',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <span style={{ display: 'flex', transform: active ? 'translateY(-1px)' : 'none', transition: 'transform 200ms' }}>{TAB_ICONS[tab.id](active)}</span>
              {tab.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default function MemberPortalPage({
  memberNo, onLogout, onNavigate,
}: {
  memberNo: string; onLogout: () => void; onNavigate: (p: string) => void
}) {
  const [activePage, setActivePage] = useState<PortalPage>('dashboard')
  const member = { ...MOCK_MEMBER, memberNo }
  const meta = PAGE_META[activePage]

  const navigate = (p: PortalPage) => setActivePage(p)

  // Services is the phone/tablet menu; the desktop sidebar covers it, so leave it when widening
  useEffect(() => {
    const mq = window.matchMedia('(min-width:1024px)')
    const onChange = () => { if (mq.matches) setActivePage((p) => (p === 'services' ? 'dashboard' : p)) }
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const overdueTotal = DUES.filter((d) => d.status === 'Overdue').reduce((s, d) => s + d.amount, 0)

  return (
    <div style={{ minHeight: '100vh', background: T.surface50, fontFamily: 'CKCL' }}>

      {/* ── Responsive style block ── */}
      <style>{`
        /* Shell: fixed-width white sidebar + fluid content */
        #portal-shell { display:grid; grid-template-columns:272px minmax(0,1fr); align-items:start; }
        @media (max-width:1023px) {
          #portal-shell { grid-template-columns:minmax(0,1fr) !important; }
          #portal-sidebar-desktop { display:none !important; }
        }
        @media (min-width:480px) { #portal-avatar-name { display:block !important; } }
        @media (max-width:479px) { #portal-search-btn { display:none !important; } }

        /* Dashboard: centre column + 360px ad rail; rail drops below the content under 1280px */
        #dash-grid { display:grid; grid-template-columns:minmax(0,1fr) 360px; gap:24px; align-items:start; padding-bottom:80px; }
        #dash-ads { display:flex; flex-direction:column; gap:16px; position:sticky; top:96px; }
        @media (max-width:1279px) {
          #dash-grid { grid-template-columns:minmax(0,1fr) !important; }
          #dash-ads { position:static; display:grid; grid-template-columns:repeat(auto-fill, minmax(300px, 1fr)); }
        }

        /* Summary row (tablet/desktop): membership card | full dues card | narrow view-all tile.
           The card's aspect ratio sets the row height; dues and view-all stretch to match.
           Phones (<768px): the card moves to the top of the dashboard and dues turns compact. */
        #dash-summary { display:grid; grid-template-columns:minmax(0,1.25fr) minmax(0,1fr) 112px; gap:16px; align-items:stretch; }
        #dash-viewall { display:flex; flex-direction:column; }
        #dash-card-top { display:none; }
        #dash-dues-full { display:flex; }
        #dash-dues-compact { display:none; }
        @media (max-width:767px) {
          #dash-card-top { display:block; }
          #dash-card-inrow { display:none; }
          #dash-notice-strip { display:none !important; }
          #dash-dues-full { display:none; }
          #dash-dues-compact { display:flex; }
          #dash-summary { grid-template-columns:minmax(0,1fr) 112px !important; }
        }
        @media (max-width:539px) {
          #dash-summary { grid-template-columns:minmax(0,1fr) !important; gap:10px; }
          #dash-viewall { flex-direction:row; padding:10px !important; }
          #dash-viewall > span { width:32px !important; height:32px !important; }
        }

        /* Membership card: lift on hover when it opens the card view */
        .pcard-clickable { transition: transform 200ms cubic-bezier(.22,1,.36,1), box-shadow 200ms; }
        .pcard-clickable:hover { transform: translateY(-3px); box-shadow: 0 24px 48px -18px rgba(14,17,22,0.6) !important; }
        .pcard-clickable:focus-visible { outline: 3px solid rgba(225,11,23,0.45); outline-offset: 3px; }

        /* Quick actions / Services tiles: 4 across, tighter on phones */
        @media (max-width:479px) {
          .action-grid { gap:2px !important; }
          .action-grid button { font-size:12px !important; padding:12px 2px !important; }
        }

        /* YourDetails 3-col → 2-col → 1-col */
        @media (max-width:767px) { #details-def-grid { grid-template-columns:repeat(2, minmax(0,1fr)) !important; } }
        @media (max-width:479px) { #details-def-grid { grid-template-columns:minmax(0,1fr) !important; } }

        /* Account statement summary 4-col → 2-col */
        @media (max-width:599px) { #stmt-summary { grid-template-columns:1fr 1fr !important; } }

        /* Helpdesk 7/5 → 1-col */
        @media (max-width:767px) { #helpdesk-grid { grid-template-columns:1fr !important; } }

        /* Personal info field grid: collapse on mobile */
        @media (max-width:599px) { #personal-info-grid { grid-template-columns:1fr !important; } }

        /* Bank accounts: already auto-fill, but ensure single col on 390 */
        @media (max-width:499px) { #bank-accounts-grid { grid-template-columns:1fr !important; } }

        /* Filter bar in account statement: wrap on mobile */
        @media (max-width:639px) { #stmt-filter-bar { flex-wrap:wrap !important; } }

        /* Mobile sticky pay bar — sits just above the tab bar */
        @media (min-width:768px) { #mobile-pay-bar { display:none !important; } }
        #mobile-pay-bar { bottom: calc(${TAB_BAR_H}px + env(safe-area-inset-bottom)) !important; }

        /* Bottom tab bar replaces the sidebar below 1024px; keep content clear of it */
        @media (min-width:1024px) { #portal-tab-bar { display:none !important; } }

        /* Membership status dot on the avatar — phones/tablets, where the sidebar card is hidden */
        @media (max-width:1023px) {
          #portal-status-dot { display:block !important; }
        }
        @media (max-width:1023px) {
          #portal-main { padding-bottom: calc(${TAB_BAR_H}px + 24px + env(safe-area-inset-bottom)) !important; }
          #portal-main.with-pay-bar { padding-bottom: calc(${TAB_BAR_H}px + 96px + env(safe-area-inset-bottom)) !important; }
          .portal-toast { bottom: calc(${TAB_BAR_H}px + 16px + env(safe-area-inset-bottom)) !important; }
        }

        /* Table horizontal scroll on mobile */
        @media (max-width:767px) {
          .portal-table-scroll { overflow-x:auto !important; -webkit-overflow-scrolling:touch; }
          .portal-table-scroll .portal-table-inner { min-width:700px; }
        }
      `}</style>

      {/* Top bar */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, height: HEADER_H, background: T.surface0, borderBottom: `1px solid ${T.ink100}` }}>
        <div style={{ maxWidth: 1440, height: '100%', margin: '0 auto', padding: '0 clamp(16px,2.5vw,32px)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => onNavigate('home')} style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <img src={logoImg} alt="Chittagong Khulshi Club Ltd." style={{ height: 32, width: 'auto', objectFit: 'contain' }}/>
          </button>
          <div style={{ flex: 1 }}/>

          {/* Search */}
          <button
            id="portal-search-btn"
            onClick={() => onNavigate('search')}
            aria-label="Search"
            style={{ width: 40, height: 40, borderRadius: '50%', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.ink600, flexShrink: 0 }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = T.surface100 }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>

          {/* Bell */}
          <button
            aria-label="Notifications"
            style={{ position: 'relative', width: 40, height: 40, borderRadius: '50%', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.ink600, flexShrink: 0 }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = T.surface100 }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
            <span style={{ position: 'absolute', top: 8, right: 9, width: 8, height: 8, borderRadius: '50%', background: T.brand, border: '2px solid white' }}/>
          </button>

          {/* Avatar pill + dropdown */}
          <AvatarDropdown member={member} onNavigate={navigate} onLogout={onLogout}/>
        </div>
      </header>

      {/* Sidebar + content */}
      <div id="portal-shell" style={{ maxWidth: 1440, margin: '0 auto' }}>

        {/* Sidebar — desktop only; white panel spanning the viewport height */}
        <aside
          id="portal-sidebar-desktop"
          style={{ position: 'sticky', top: HEADER_H, height: `calc(100vh - ${HEADER_H}px)`, background: T.surface0, borderRight: `1px solid ${T.ink100}`, padding: '24px 16px 20px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}
        >
          <SidebarMemberCard member={member} onNavigate={navigate} centered/>
          <SidebarNav activePage={activePage} onNavigate={navigate} onLogout={onLogout}/>
        </aside>

        {/* Main content */}
        <main
          id="portal-main"
          className={activePage === 'dashboard' && overdueTotal > 0 ? 'with-pay-bar' : undefined}
          style={{ minWidth: 0, padding: '24px clamp(16px,2.5vw,32px)' }}
        >
          {activePage !== 'dashboard' && activePage !== 'membership-card' && (
            <PageHeader
              breadcrumb={meta.breadcrumb}
              title={meta.title}
              action={activePage === 'account-statement' ? (
                <button style={{ height: 40, padding: '0 18px', borderRadius: 10, border: `1.5px solid ${T.ink100}`, background: T.surface0, fontFamily: 'CKCL', fontSize: 13, fontWeight: 600, color: T.ink700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Download PDF
                </button>
              ) : undefined}
            />
          )}
          {activePage === 'dashboard' && <Dashboard member={member} onNavigate={navigate}/>}
          {activePage === 'membership-card' && <MembershipCardView member={member} onNavigate={navigate}/>}
          {activePage === 'account-statement' && <AccountStatement/>}
          {activePage === 'payment-history' && <PaymentHistory/>}
          {activePage === 'invoices' && <Invoices member={member}/>}
          {activePage === 'bank-accounts' && <BankAccounts/>}
          {activePage === 'personal-info' && <PersonalInfo member={member}/>}
          {activePage === 'helpdesk' && <Helpdesk/>}
          {activePage === 'change-password' && <ChangePassword/>}
          {activePage === 'services' && <Services onNavigate={navigate} onLogout={onLogout}/>}
          {!['dashboard','membership-card','account-statement','payment-history','invoices','bank-accounts','personal-info','helpdesk','change-password','services'].includes(activePage) && <PlaceholderPage title={meta.title}/>}
        </main>
      </div>

      {/* Mobile sticky pay bar */}
      {activePage === 'dashboard' && overdueTotal > 0 && (
        <div id="mobile-pay-bar" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 60, padding: '12px 16px', background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderTop: `1px solid ${T.ink100}`, boxShadow: '0 -4px 20px rgba(14,17,22,0.08)' }}>
          <button onClick={() => setActivePage('account-statement')} style={{ width: '100%', height: 50, borderRadius: 12, border: 'none', background: T.brand, fontFamily: 'CKCL', fontSize: 15, fontWeight: 700, color: '#FFF', cursor: 'pointer' }}>
            Pay ৳{overdueTotal.toLocaleString()}
          </button>
        </div>
      )}

      <PortalTabBar activePage={activePage} onNavigate={navigate}/>
    </div>
  )
}
