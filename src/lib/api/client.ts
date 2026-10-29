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

/** e.g. http://localhost:8000/ → http://localhost:8000/api/ */
export const backendURL = withTrailingSlash(
  trimSlash(import.meta.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000') + '/'
)

/**
 * Prefer LARAVEL_PUBLIC_BACKEND_URL when set (index.php deployments),
 * otherwise NEXT_PUBLIC_BACKEND_URL + api/ — same idea as ERP apps.
 */
export const baseURL = (() => {
  const laravel = import.meta.env.LARAVEL_PUBLIC_BACKEND_URL as string | undefined
  if (laravel && String(laravel).trim()) {
    // LARAVEL_PUBLIC is often .../index.php/ — API still lives under /api on the host.
    // Use NEXT_PUBLIC host + /api/ for JSON API (ERP convention).
  }
  return `${backendURL}api/`
})()

/** Sent as X-Portal-Domain so club.portal middleware can resolve the club. */
export const portalDomain = String(import.meta.env.NEXT_PUBLIC_PORTAL_DOMAIN || window.location.hostname || 'localhost')

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

/**
 * Low-level request. `path` is relative to /api/ (e.g. `club-portal/website/home`).
 * Unwraps Club `{ success, data, message }` and returns `data`.
 */
export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'X-Portal-Domain': portalDomain,
    ...(init.headers as Record<string, string> | undefined),
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
