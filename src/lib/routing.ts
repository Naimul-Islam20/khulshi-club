/**
 * Lightweight path ↔ page mapping (no react-router).
 * Keeps the address bar in sync with in-app navigation.
 */

export type RoutedPage =
  | 'home'
  | 'about-club'
  | 'mission-vision'
  | 'terms'
  | 'refund-policy'
  | 'benefits'
  | 'affiliated-clubs'
  | 'membership-process'
  | 'member-list'
  | 'become-member'
  | 'facilities'
  | `facility:${string}`
  | 'committee:founding'
  | 'committee:executive'
  | 'media'
  | 'resources'
  | 'contact'
  | 'search'
  | '404'
  | 'member-login'
  | 'member-portal'

export type MediaTab = 'notices' | 'news' | 'gallery' | 'video'

/** Signed-in member portal sections under /portal/... */
export type PortalTab =
  | 'dashboard'
  | 'membership-card'
  | 'personal-info'
  | 'account-statement'
  | 'payment-history'
  | 'invoices'
  | 'bank-accounts'
  | 'change-request'
  | 'helpdesk'
  | 'change-password'
  | 'services'

export type RouteState = {
  page: RoutedPage
  mediaTab: MediaTab
  portalPage: PortalTab
}

const MEDIA_TABS: MediaTab[] = ['notices', 'news', 'gallery', 'video']

const PORTAL_TABS: PortalTab[] = [
  'dashboard',
  'membership-card',
  'personal-info',
  'account-statement',
  'payment-history',
  'invoices',
  'bank-accounts',
  'change-request',
  'helpdesk',
  'change-password',
  'services',
]

export function isPortalTab(v: string): v is PortalTab {
  return (PORTAL_TABS as string[]).includes(v)
}

const STATIC: Record<string, RoutedPage> = {
  '/': 'home',
  '/home': 'home',
  '/about': 'about-club',
  '/about/about-club': 'about-club',
  '/about/club': 'about-club',
  '/about/mission-vision': 'mission-vision',
  '/about/mission': 'mission-vision',
  '/about/terms': 'terms',
  '/about/terms-conditions': 'terms',
  '/about/refund': 'refund-policy',
  '/about/refund-policy': 'refund-policy',
  '/membership': 'benefits',
  '/membership/benefits': 'benefits',
  '/membership/affiliated-clubs': 'affiliated-clubs',
  '/membership/affiliated': 'affiliated-clubs',
  '/membership/process': 'membership-process',
  '/membership/members': 'member-list',
  '/membership/member-list': 'member-list',
  '/membership/become-a-member': 'become-member',
  '/membership/apply': 'become-member',
  '/facilities': 'facilities',
  '/committee/founding': 'committee:founding',
  '/committee/executive': 'committee:executive',
  '/media': 'media',
  '/resources': 'resources',
  '/contact': 'contact',
  '/search': 'search',
  '/login': 'member-login',
  '/member-login': 'member-login',
  '/portal': 'member-portal',
  '/member-portal': 'member-portal',
  '/404': '404',
}

/** Build a clean path for a page (+ optional media / portal section). */
export function pathForPage(
  page: RoutedPage,
  mediaTab: MediaTab = 'notices',
  portalPage: PortalTab = 'dashboard',
): string {
  if (page === 'home') return '/'
  if (page === 'about-club') return '/about/about-club'
  if (page === 'mission-vision') return '/about/mission-vision'
  if (page === 'terms') return '/about/terms'
  if (page === 'refund-policy') return '/about/refund-policy'
  if (page === 'benefits') return '/membership/benefits'
  if (page === 'affiliated-clubs') return '/membership/affiliated-clubs'
  if (page === 'membership-process') return '/membership/process'
  if (page === 'member-list') return '/membership/members'
  if (page === 'become-member') return '/membership/become-a-member'
  if (page === 'facilities') return '/facilities'
  if (page.startsWith('facility:')) return `/facilities/${encodeURIComponent(page.slice('facility:'.length))}`
  if (page === 'committee:founding') return '/committee/founding'
  if (page === 'committee:executive') return '/committee/executive'
  if (page === 'media') return mediaTab === 'notices' ? '/media' : `/media/${mediaTab}`
  if (page === 'resources') return '/resources'
  if (page === 'contact') return '/contact'
  if (page === 'search') return '/search' // query string attached by syncUrl when provided
  if (page === 'member-login') return '/login'
  if (page === 'member-portal') {
    return portalPage === 'dashboard' ? '/portal' : `/portal/${portalPage}`
  }
  if (page === '404') return '/404'
  return '/'
}

/** Parse current location into page + media / portal tab. Unknown paths → 404. */
export function parseLocation(pathname = window.location.pathname): RouteState {
  const raw = pathname.replace(/\/+$/, '') || '/'
  const path = raw.toLowerCase()

  const portalMatch = path.match(/^\/(?:portal|member-portal)(?:\/([^/]+))?$/)
  if (portalMatch) {
    const section = portalMatch[1]
    if (!section || section === 'dashboard') {
      return { page: 'member-portal', mediaTab: 'notices', portalPage: 'dashboard' }
    }
    if (isPortalTab(section)) {
      return { page: 'member-portal', mediaTab: 'notices', portalPage: section }
    }
    return { page: '404', mediaTab: 'notices', portalPage: 'dashboard' }
  }

  if (STATIC[path]) {
    return { page: STATIC[path], mediaTab: 'notices', portalPage: 'dashboard' }
  }

  const mediaMatch = path.match(/^\/media\/(notices|news|gallery|video)$/)
  if (mediaMatch) {
    return { page: 'media', mediaTab: mediaMatch[1] as MediaTab, portalPage: 'dashboard' }
  }

  const facilityMatch = path.match(/^\/facilities\/([^/]+)$/)
  if (facilityMatch) {
    return {
      page: `facility:${decodeURIComponent(facilityMatch[1])}`,
      mediaTab: 'notices',
      portalPage: 'dashboard',
    }
  }

  return { page: '404', mediaTab: 'notices', portalPage: 'dashboard' }
}

export function readRoute(): RouteState {
  return parseLocation(window.location.pathname)
}

/** Push or replace the URL without a full reload. */
export function syncUrl(
  page: RoutedPage,
  mediaTab: MediaTab = 'notices',
  mode: 'push' | 'replace' = 'push',
  portalPage: PortalTab = 'dashboard',
  searchQuery?: string,
) {
  let next = pathForPage(page, mediaTab, portalPage)
  if (page === 'search' && searchQuery && searchQuery.trim()) {
    next = `${next}?q=${encodeURIComponent(searchQuery.trim())}`
  }
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`
  const state = { page, mediaTab, portalPage, searchQuery: searchQuery || '' }
  if (current === next) {
    if (mode === 'replace') window.history.replaceState(state, '', next)
    return
  }
  if (mode === 'replace') window.history.replaceState(state, '', next)
  else window.history.pushState(state, '', next)
}

export function readSearchQuery(): string {
  try {
    return new URLSearchParams(window.location.search).get('q') || ''
  } catch {
    return ''
  }
}

export function isMediaTab(v: string): v is MediaTab {
  return (MEDIA_TABS as string[]).includes(v)
}
