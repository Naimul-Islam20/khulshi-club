/**
 * Public club-website API client (muktoerp_api).
 * Mirrors muktoerp_ui helpers/axios base URL style:
 *   `${NEXT_PUBLIC_BACKEND_URL}api/`
 *
 * Club is resolved by portal domain (same as member portal).
 */

function trimSlash(url: string) {
  return url.replace(/\/+$/, '')
}

function withTrailingSlash(url: string) {
  return url.endsWith('/') ? url : `${url}/`
}

/**
 * Where the API lives, first match wins:
 *  1. window.__APP_CONFIG__ — /config.js, written from the container's env at start
 *     (API_URL / PORTAL_DOMAIN in Coolify). Change it there and restart; no rebuild.
 *  2. Vite env at build/dev time — .env / .env.local (NEXT_PUBLIC_BACKEND_URL, …).
 *  3. Local fallback: http://localhost:8000/ and the page's own hostname.
 */
const runtimeConfig: AppRuntimeConfig = (typeof window !== 'undefined' && window.__APP_CONFIG__) || {}

function firstSet(...values: (string | undefined | null)[]): string {
  for (const v of values) {
    const t = String(v ?? '').trim()
    if (t) return t
  }
  return ''
}

const configuredBackend = firstSet(runtimeConfig.API_URL, import.meta.env.NEXT_PUBLIC_BACKEND_URL)

if (!configuredBackend && typeof window !== 'undefined' && !/^(localhost|127\.|192\.168\.|10\.)/.test(window.location.hostname)) {
  // A deployed site with no API_URL would call the visitor's own localhost.
  console.error('API_URL is not configured — set it on the container (see .env.example).')
}

/** e.g. http://localhost:8000/ → http://localhost:8000/api/ */
export const backendURL = withTrailingSlash(trimSlash(configuredBackend || 'http://localhost:8000') + '/')

/** JSON API root — `${backendURL}api/` (ERP convention). */
export const baseURL = `${backendURL}api/`

/** Sent as X-Portal-Domain so club.portal middleware can resolve the club. */
export const portalDomain = firstSet(
  runtimeConfig.PORTAL_DOMAIN,
  import.meta.env.NEXT_PUBLIC_PORTAL_DOMAIN,
  typeof window !== 'undefined' ? window.location.hostname : '',
  'localhost',
)

export type ClubApiResponse<T> = {
  success?: boolean
  data?: T
  output?: T
  message?: string
  msg?: string
  errors?: Record<string, string[]>
}

export class ApiError extends Error {
  status: number
  errors: Record<string, string[]>

  constructor(message: string, status: number, errors: Record<string, string[]> = {}) {
    super(message)
    this.status = status
    this.errors = errors
  }
}

function joinUrl(base: string, path: string) {
  const p = path.startsWith('/') ? path.slice(1) : path
  return `${base}${p}`
}

function readMemberBearer(): string | null {
  try {
    const raw = sessionStorage.getItem('ckcl_member_session')
    if (!raw) return null
    const parsed = JSON.parse(raw) as { token?: string }
    return parsed?.token ? String(parsed.token) : null
  } catch {
    return null
  }
}

/**
 * Low-level request. `path` is relative to /api/ (e.g. `club-portal/website/home`).
 * Unwraps Club `{ success, data, message }` and returns `data`.
 * Attaches member Bearer token when a portal session exists.
 */
export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'X-Portal-Domain': portalDomain,
    ...(init.headers as Record<string, string> | undefined),
  }
  if (!headers.Authorization && !headers.authorization) {
    const token = readMemberBearer()
    if (token) headers.Authorization = `Bearer ${token}`
  }
  if (init.body && !(init.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  let res: Response
  try {
    res = await fetch(joinUrl(baseURL, path), { ...init, headers })
  } catch {
    throw new ApiError('Could not reach the club server. Please check your connection and try again.', 0)
  }

  const body = (await res.json().catch(() => ({}))) as ClubApiResponse<T>
  if (!res.ok || body.success === false) {
    const message =
      res.status === 429
        ? 'Too many attempts. Please wait a minute and try again.'
        : body.message || body.msg || 'Something went wrong. Please try again.'
    throw new ApiError(message, res.status, body.errors || {})
  }

  return (body.data ?? body.output ?? (body as unknown as T)) as T
}

export function apiGet<T>(path: string, params?: Record<string, string | number | boolean | undefined | null>) {
  const qs = params
    ? Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join('&')
    : ''
  return apiRequest<T>(qs ? `${path}?${qs}` : path, { method: 'GET' })
}

export function apiPost<T>(path: string, data?: unknown) {
  return apiRequest<T>(path, {
    method: 'POST',
    body: data instanceof FormData ? data : JSON.stringify(data ?? {}),
  })
}

/**
 * Turn CMS image paths into absolute URLs.
 * Absolute http(s) / blob / data URLs pass through; `/uploads/...` uses the API host.
 */
export function mediaUrl(src: string | null | undefined): string {
  if (!src) return ''
  const v = String(src).trim()
  if (!v) return ''
  if (/^(https?:|blob:|data:)/i.test(v)) return v
  if (v.startsWith('//')) return `${window.location.protocol}${v}`
  if (v.startsWith('/')) return `${trimSlash(backendURL)}${v}`
  return `${backendURL}${v.replace(/^\//, '')}`
}
