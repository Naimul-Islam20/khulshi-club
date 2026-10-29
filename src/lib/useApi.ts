import { useCallback, useEffect, useState } from 'react'
import { apiGet } from './api/client'

/**
 * Session-cached GET for club-portal paths (relative to /api/).
 * Example: useApi('club-portal/website/home')
 */
const cache = new Map<string, unknown>()
const pending = new Map<string, Promise<unknown>>()

function load<T>(path: string): Promise<T> {
  let p = pending.get(path) as Promise<T> | undefined
  if (!p) {
    p = apiGet<T>(path).finally(() => pending.delete(path))
    pending.set(path, p)
  }
  return p
}

export function useApi<T>(path: string | null) {
  const [data, setData] = useState<T | null>(() => (path && cache.has(path) ? (cache.get(path) as T) : null))
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(() => !!path && !cache.has(path))
  const [nonce, setNonce] = useState(0)

  useEffect(() => {
    if (!path) return
    let alive = true
    if (cache.has(path)) setData(cache.get(path) as T)
    else setLoading(true)
    setError(null)

    load<T>(path)
      .then((d) => {
        cache.set(path, d)
        if (alive) setData(d)
      })
      .catch((e: Error) => {
        if (alive) setError(e.message)
      })
      .finally(() => {
        if (alive) setLoading(false)
      })

    return () => {
      alive = false
    }
  }, [path, nonce])

  const reload = useCallback(() => {
    if (path) cache.delete(path)
    setNonce((n) => n + 1)
  }, [path])

  return { data, error, loading, reload }
}
